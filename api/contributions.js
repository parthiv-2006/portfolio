// Vercel serverless function — queries GitHub's GraphQL API directly for the
// live contribution calendar, using a server-side token (GITHUB_TOKEN) that
// never reaches the client. Edge-cached briefly so repeat visits don't burn
// GitHub API quota or add latency.
export default async function handler(req, res) {
    const token = process.env.GITHUB_TOKEN;
    const login = (req.query.user || 'parthiv-2006').toString();

    if (!token) {
        res.status(500).json({ error: 'GITHUB_TOKEN not configured' });
        return;
    }

    try {
        const ghRes = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query($login: String!) {
                        user(login: $login) {
                            contributionsCollection {
                                contributionCalendar {
                                    totalContributions
                                    weeks { contributionDays { date contributionCount } }
                                }
                            }
                        }
                    }
                `,
                variables: { login },
            }),
        });

        if (!ghRes.ok) {
            res.status(502).json({ error: `GitHub API error: ${ghRes.status}` });
            return;
        }

        const json = await ghRes.json();
        if (json.errors) {
            res.status(502).json({ error: json.errors.map((e) => e.message).join('; ') });
            return;
        }

        const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            res.status(502).json({ error: 'Unexpected GitHub API response shape' });
            return;
        }

        const contributions = calendar.weeks.flatMap((w) =>
            w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
        );

        // Edge-cache for 5 min; serve stale for up to 30 min while revalidating
        // in the background, so a cold GitHub API call never blocks a visitor.
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
        res.status(200).json({ total: calendar.totalContributions, contributions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
