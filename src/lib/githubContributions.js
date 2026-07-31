export const GITHUB_USERNAME = 'parthiv-2006';

/**
 * Contribution counts are not available from the public GitHub REST API — the
 * events endpoint caps out at 300 events / 90 days. These proxies read the
 * contribution calendar and expose it as JSON.
 *
 * Sources are tried in order so one provider going dark degrades to the next
 * instead of blanking the whole feature. (The previous single source,
 * github-contributions-api.deno.dev, disappeared when Deno Deploy Classic was
 * sunset on 2026-07-20 and every day silently read as zero.)
 *
 * Each source returns the trailing ~year as a flat [{ date, count }].
 */
const SOURCES = [
    {
        name: 'jogruber',
        url: (user, bust) =>
            `https://github-contributions-api.jogruber.de/v4/${user}?y=last&t=${bust}`,
        parse: (json) =>
            json.contributions.map((d) => ({ date: d.date, count: d.count })),
    },
    {
        name: 'gh-calendar',
        url: (user, bust) =>
            `https://gh-calendar.rschristian.dev/user/${user}?t=${bust}`,
        // Returns a 2D array of weeks.
        parse: (json) =>
            json.contributions.flat().map((d) => ({ date: d.date, count: d.count })),
    },
];

export function toDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toDateStr(d);
}

/** Days are compared against the visitor's local date, so a browser behind UTC
 *  doesn't get a "tomorrow" cell the API has already rolled over to. */
function normalize(days) {
    const today = daysAgo(0);
    return days
        .filter((d) => d && d.date && d.date <= today && Number.isFinite(d.count))
        .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchFromSource(source, user) {
    const res = await fetch(source.url(user, Date.now()));
    if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status}`);
    const days = normalize(source.parse(await res.json()));
    if (!days.length) throw new Error(`${source.name}: empty calendar`);
    return days;
}

let _cache = null;
let _promise = null;

/**
 * Resolves to { days, error }. `days` is [] only when every source failed, in
 * which case `error` is set — callers should surface that rather than render a
 * zero streak, which is indistinguishable from a real one.
 */
export function loadContributions(user = GITHUB_USERNAME) {
    if (_cache) return Promise.resolve(_cache);
    if (!_promise) {
        _promise = (async () => {
            const failures = [];
            for (const source of SOURCES) {
                try {
                    return (_cache = { days: await fetchFromSource(source, user), error: null });
                } catch (err) {
                    failures.push(err.message);
                }
            }
            // Leave _cache unset so a later mount can retry.
            _promise = null;
            return { days: [], error: failures.join('; ') || 'no contribution source available' };
        })();
    }
    return _promise;
}

/** Exposed for tests / manual verification. */
export function _resetCache() {
    _cache = null;
    _promise = null;
}

/**
 * Streak stats over the fetched window. `longest` is therefore the best streak
 * within the trailing year, not all time.
 */
export function computeStreaks(days) {
    if (!days.length) {
        return { current: 0, longest: 0, todayCount: 0, lastActive: null, streakDates: new Set() };
    }

    const today = daysAgo(0);
    const map = Object.fromEntries(days.map((d) => [d.date, d.count]));
    const todayCount = map[today] ?? 0;

    // A day with no commits yet doesn't break the streak until it's over, so
    // start counting back from yesterday when today is still empty.
    const streakDates = new Set();
    let back = todayCount > 0 ? 0 : 1;
    while ((map[daysAgo(back)] ?? 0) > 0) {
        streakDates.add(daysAgo(back));
        back++;
    }

    let longest = 0;
    let run = 0;
    let prev = null;
    for (const d of days) {
        // Guard against a source omitting empty days — a gap must reset the run.
        const contiguous = prev !== null && daysBetween(prev, d.date) === 1;
        run = d.count > 0 ? (contiguous ? run + 1 : 1) : 0;
        if (run > longest) longest = run;
        prev = d.date;
    }

    let lastActive = null;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) {
            lastActive = days[i].date;
            break;
        }
    }

    return { current: streakDates.size, longest, todayCount, lastActive, streakDates };
}

function daysBetween(a, b) {
    const ms = new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`);
    return Math.round(ms / 86400000);
}
