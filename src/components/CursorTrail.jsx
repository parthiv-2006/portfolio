import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * CursorTrail — State-Aware Custom Cursor
 *
 * States: 'default' | 'hover' | 'click'
 *
 * SAFETY CONTRACT
 *   index.css hides the native cursor with `cursor: none !important` inside
 *   `@media (hover: hover) and (prefers-reduced-motion: no-preference)`. This
 *   component must therefore be drawing a cursor for EXACTLY that condition,
 *   or the visitor is left with no pointer at all.
 *
 *   Two invariants enforce that:
 *     1. ENABLE_QUERY is the same media query as the CSS rule, and it is watched
 *        live. Previously the check ran once at mount, so a visitor who turned
 *        reduced-motion off (or plugged a mouse into a tablet) after load got
 *        the CSS rule with no canvas behind it — an invisible cursor.
 *     2. Whenever the rAF loop is NOT running — tab hidden, pointer outside the
 *        window, component unmounted — `body[data-cursor-lost]` is set, which
 *        the CSS escape hatch turns back into a native cursor. "Loop stopped"
 *        and "native cursor restored" are the same state change.
 *
 * Loop resilience:
 *   requestAnimationFrame is re-scheduled at the TOP of render(), before any
 *   code that could throw or early-return, so no error can permanently kill it.
 */

const PARTICLE_COUNT    = 15;
const PARTICLE_LIFETIME = 400;
const SPAWN_RATE        = 24;
const TRAIL_MAX_RADIUS  = 2;
const LEAVE_DEBOUNCE_MS = 500;   // long enough to survive rapid-click DOM mutations
const CLICK_GRACE_MS    = 800;   // recent click forces cursor visible

/** Must stay identical to the `cursor: none` media query in index.css. */
const ENABLE_QUERY = '(hover: hover) and (prefers-reduced-motion: no-preference)';

const FALLBACK_ACCENT = { r: 226, g: 160, b: 78 };

const INTERACTIVE_SELECTOR =
    'a, button, input, textarea, select, [role="button"], [tabindex], label, summary';

/**
 * Text-entry fields need the native I-beam to show where text will land — a dot
 * can't convey that. Over these we hand the cursor back to the browser instead
 * of inventing a caret shape.
 */
const TEXT_ENTRY_SELECTOR =
    'textarea, [contenteditable=""], [contenteditable="true"], ' +
    'input:not([type="button"]):not([type="submit"]):not([type="reset"])' +
    ':not([type="checkbox"]):not([type="radio"]):not([type="range"])' +
    ':not([type="color"]):not([type="file"]):not([type="image"])';

const lerp = (a, b, t) => a + (b - a) * t;

/** Accepts `#rgb`, `#rrggbb` and `rgb()/rgba()`; returns null on anything else. */
function parseColor(raw) {
    if (!raw) return null;
    const value = raw.trim();

    const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
        const h = hex[1];
        const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
        return {
            r: parseInt(full.slice(0, 2), 16),
            g: parseInt(full.slice(2, 4), 16),
            b: parseInt(full.slice(4, 6), 16),
        };
    }

    const rgb = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (rgb) {
        return { r: Math.round(+rgb[1]), g: Math.round(+rgb[2]), b: Math.round(+rgb[3]) };
    }

    return null;
}

export default function CursorTrail() {
    // Watched live, not read once — see invariant 1.
    const [enabled, setEnabled] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(ENABLE_QUERY).matches;
    });

    const canvasRef      = useRef(null);
    const mouseRef       = useRef({ x: -100, y: -100 });
    const particlesRef   = useRef([]);
    const ripplesRef     = useRef([]);
    const lastSpawnRef   = useRef(0);
    const rafRef         = useRef(null);
    const visibleRef     = useRef(true);
    const clickStampRef  = useRef(0);
    const leaveTimerRef  = useRef(null);
    const lastDrawnRef   = useRef(performance.now());

    // Inputs to the "should the native cursor be showing?" decision.
    const runningRef     = useRef(false);
    const textZoneRef    = useRef(false);
    const lostRef        = useRef(false);
    const nativeRef      = useRef(false);

    const accentRef      = useRef(FALLBACK_ACCENT);
    const stateRef       = useRef('default');

    const animRef = useRef({
        dotRadius:    4,
        ringRadius:   0,
        ringAlpha:    0,
        glowRadius:   18,
        ringRotation: 0,
    });

    /* ── Live media-query gate ── */
    useEffect(() => {
        const mq = window.matchMedia(ENABLE_QUERY);
        const update = () => setEnabled(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    /**
     * Single source of truth for the CSS escape hatch. `data-cursor-lost`
     * restores the native cursor, so it must be set whenever this component
     * isn't painting one.
     */
    const syncNativeCursor = useCallback(() => {
        const wantNative = !runningRef.current || textZoneRef.current || lostRef.current;
        if (wantNative === nativeRef.current) return;
        nativeRef.current = wantNative;
        if (wantNative) document.body.setAttribute('data-cursor-lost', '');
        else document.body.removeAttribute('data-cursor-lost');
    }, []);

    const getTargets = (state) => {
        switch (state) {
            case 'hover': return { dotRadius: 2,  ringRadius: 18, ringAlpha: 0.4, glowRadius: 14 };
            case 'click': return { dotRadius: 4,  ringRadius: 10, ringAlpha: 0.6, glowRadius: 6  };
            default:      return { dotRadius: 3,  ringRadius: 0,  ringAlpha: 0,   glowRadius: 10 };
        }
    };

    const spawnParticle = useCallback(() => {
        const { x, y } = mouseRef.current;
        if (x < 0 || y < 0) return;
        const isHover = stateRef.current === 'hover';
        particlesRef.current.push({
            x, y,
            born: performance.now(),
            vx: (Math.random() - 0.5) * (isHover ? 0.8 : 0.4),
            vy: (Math.random() - 0.5) * (isHover ? 0.8 : 0.4),
        });
        if (particlesRef.current.length > PARTICLE_COUNT) particlesRef.current.shift();
    }, []);

    const spawnRipple = useCallback(() => {
        const { x, y } = mouseRef.current;
        ripplesRef.current.push({ x, y, born: performance.now(), maxRadius: 40 + Math.random() * 15 });
    }, []);

    const render = useCallback((now) => {
        // Pre-schedule FIRST — errors and early returns can never kill the loop.
        // Guarded by runningRef so a paused loop doesn't resurrect itself.
        if (runningRef.current) rafRef.current = requestAnimationFrame(render);

        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const a = accentRef.current;
            const rgba = (alpha) => `rgba(${a.r},${a.g},${a.b},${alpha})`;

            // Yield to the native cursor: Gist demo open, or pointer over a
            // text field where the I-beam carries real information.
            if (document.body.hasAttribute('data-demo-open') || textZoneRef.current) {
                lastDrawnRef.current = now;
                if (lostRef.current) {
                    lostRef.current = false;
                    syncNativeCursor();
                }
                return;
            }

            // Recent click/mousedown → cursor must be present regardless of any
            // spurious mouseleave fired by DOM mutations during rapid clicking.
            if (now - clickStampRef.current < CLICK_GRACE_MS) {
                visibleRef.current = true;
            }

            const anim    = animRef.current;
            const targets = getTargets(stateRef.current);

            // Auto-recover from stuck 'click' state
            if (stateRef.current === 'click' && now - clickStampRef.current > 600) {
                stateRef.current = 'default';
            }

            const speed = stateRef.current === 'click' ? 0.2 : 0.1;
            anim.dotRadius    = lerp(anim.dotRadius,    targets.dotRadius,  speed);
            anim.ringRadius   = lerp(anim.ringRadius,   targets.ringRadius, speed);
            anim.ringAlpha    = lerp(anim.ringAlpha,    targets.ringAlpha,  speed);
            anim.glowRadius   = lerp(anim.glowRadius,   targets.glowRadius, speed);
            anim.ringRotation += 0.01;

            if (now - lastSpawnRef.current > SPAWN_RATE && visibleRef.current) {
                spawnParticle();
                lastSpawnRef.current = now;
            }

            // ── Particles ──
            const alive = [];
            for (const p of particlesRef.current) {
                const age = now - p.born;
                if (age > PARTICLE_LIFETIME) continue;
                const progress = age / PARTICLE_LIFETIME;
                p.x += p.vx;
                p.y += p.vy;
                ctx.beginPath();
                ctx.arc(p.x, p.y, TRAIL_MAX_RADIUS * (1 - progress * 0.7), 0, Math.PI * 2);
                ctx.fillStyle = rgba((1 - progress) * 0.25);
                ctx.fill();
                alive.push(p);
            }
            particlesRef.current = alive;

            // ── Comet tail ──
            if (alive.length > 1) {
                ctx.beginPath();
                ctx.moveTo(alive[0].x, alive[0].y);
                for (let i = 1; i < alive.length; i++) {
                    const progress = (now - alive[i].born) / PARTICLE_LIFETIME;
                    ctx.lineTo(alive[i].x, alive[i].y);
                    ctx.strokeStyle = rgba((1 - progress) * 0.08);
                }
                const { x: mx, y: my } = mouseRef.current;
                ctx.lineTo(mx, my);
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // ── Ripples ──
            const aliveRipples = [];
            for (const r of ripplesRef.current) {
                const age = now - r.born;
                const dur = 500;
                if (age > dur) continue;
                const progress = age / dur;
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.maxRadius * progress, 0, Math.PI * 2);
                ctx.strokeStyle = rgba((1 - progress) * 0.35);
                ctx.lineWidth   = 1.5 * (1 - progress);
                ctx.stroke();
                aliveRipples.push(r);
            }
            ripplesRef.current = aliveRipples;

            // ── Cursor dot ──
            if (visibleRef.current) {
                lastDrawnRef.current = now;
                const { x, y } = mouseRef.current;

                // Ambient glow
                const g = ctx.createRadialGradient(x, y, 0, x, y, anim.glowRadius);
                g.addColorStop(0, rgba(0.08));
                g.addColorStop(1, rgba(0));
                ctx.beginPath();
                ctx.arc(x, y, anim.glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                // Hover/click ring
                if (anim.ringRadius > 0.5) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(anim.ringRotation);
                    ctx.shadowColor = 'rgba(0,0,0,0.7)';
                    ctx.shadowBlur  = 4;
                    ctx.beginPath();
                    ctx.arc(0, 0, anim.ringRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = rgba(anim.ringAlpha);
                    ctx.lineWidth   = 1.5;
                    ctx.setLineDash([4, 6]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.strokeStyle = rgba(anim.ringAlpha * 0.6);
                    ctx.lineWidth   = 1;
                    const tickDist = anim.ringRadius + 3;
                    const tickLen  = 4;
                    for (let i = 0; i < 4; i++) {
                        const angle = (Math.PI / 2) * i;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(angle) * tickDist,           Math.sin(angle) * tickDist);
                        ctx.lineTo(Math.cos(angle) * (tickDist + tickLen), Math.sin(angle) * (tickDist + tickLen));
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // Core dot. The black outline and white centre are painted ON the
                // accent dot, not against the page, so they read in both themes.
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur  = 8;
                ctx.beginPath();
                ctx.arc(x, y, anim.dotRadius, 0, Math.PI * 2);
                ctx.fillStyle = rgba(0.9);
                ctx.fill();
                ctx.shadowBlur  = 0;
                ctx.beginPath();
                ctx.arc(x, y, anim.dotRadius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0,0,0,0.45)';
                ctx.lineWidth   = 1.5;
                ctx.stroke();
                ctx.restore();

                // White hot centre
                if (anim.dotRadius > 1.5) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.85)';
                    ctx.fill();
                }
            }

            // Cursor-lost detection: if unseen for >1.5 s, restore native cursor
            const lost = !visibleRef.current && (now - lastDrawnRef.current > 1500);
            if (lost !== lostRef.current) {
                lostRef.current = lost;
                syncNativeCursor();
            }
        } catch { /* swallow — next frame is already scheduled */ }
    }, [spawnParticle, syncNativeCursor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!enabled || !canvas) return;

        // Adopt whatever the DOM already says so the guard in syncNativeCursor
        // can't get stuck out of step after a remount.
        nativeRef.current = document.body.hasAttribute('data-cursor-lost');

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ─── Theme-aware accent ─────────────────────────────────────────────────
        const readAccent = () => {
            const parsed = parseColor(
                getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
            );
            if (parsed) accentRef.current = parsed;
        };
        readAccent();
        const themeObserver = new MutationObserver(readAccent);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class', 'style'],
        });

        // ─── Loop control ───────────────────────────────────────────────────────
        const clearCanvas = () => {
            try {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            } catch { /* context unavailable — nothing was drawn anyway */ }
        };

        const setRunning = (run) => {
            if (run === runningRef.current) return;
            runningRef.current = run;
            if (run) {
                lostRef.current = false;
                lastDrawnRef.current = performance.now();
                syncNativeCursor();
                rafRef.current = requestAnimationFrame(render);
            } else {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                clearCanvas();
                syncNativeCursor();
            }
        };

        // ─── Helpers ────────────────────────────────────────────────────────────
        const clearLeaveTimer = () => {
            if (leaveTimerRef.current) {
                clearTimeout(leaveTimerRef.current);
                leaveTimerRef.current = null;
            }
        };

        const setPos = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        /** One elementFromPoint hit answers both "is it interactive" and
         *  "is it a text field" — doing it twice per move is wasteful. */
        const probe = (e) => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const inTextZone = Boolean(target?.closest(TEXT_ENTRY_SELECTOR));
            if (inTextZone !== textZoneRef.current) {
                textZoneRef.current = inTextZone;
                if (inTextZone) clearCanvas();
                syncNativeCursor();
            }
            return target?.closest(INTERACTIVE_SELECTOR) ? 'hover' : 'default';
        };

        // ─── Event handlers ─────────────────────────────────────────────────────

        const onMouseMove = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current = true;
            setRunning(true);

            // Recover from missed mouseup (e.g. click opened new tab)
            if (stateRef.current === 'click' && e.buttons === 0) {
                stateRef.current = 'default';
            }

            const hover = probe(e);
            if (stateRef.current !== 'click') {
                stateRef.current = hover;
            }
        };

        // pointermove fires more reliably than mousemove during heavy DOM activity
        // (Framer Motion animations, React re-renders). Used only to keep the
        // position ref current — full state logic lives in onMouseMove.
        const onPointerMove = (e) => {
            if (e.pointerType !== 'mouse') return;
            mouseRef.current = { x: e.clientX, y: e.clientY };
            visibleRef.current = true;
            clearLeaveTimer();
            setRunning(true);
        };

        const onMouseDown = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current    = true;
            stateRef.current      = 'click';
            clickStampRef.current = performance.now();
            setRunning(true);
            spawnRipple();
        };

        const onMouseUp = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current    = true;
            // Refresh click stamp so the CLICK_GRACE_MS window stays open through mouseup
            clickStampRef.current = performance.now();
            stateRef.current      = probe(e);
        };

        const onDocumentClick = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current    = true;
            clickStampRef.current = performance.now();
            setRunning(true);
        };

        const onPointerCancel = () => {
            if (stateRef.current === 'click') stateRef.current = 'default';
        };

        // Debounced hide with a generous 500 ms window so rapid-click DOM mutations
        // (which fire mouseleave on document) don't prematurely hide the cursor.
        // Once it really has left, the loop stops and the native cursor comes back.
        const onMouseLeave = () => {
            clearLeaveTimer();
            leaveTimerRef.current = setTimeout(() => {
                visibleRef.current = false;
                setRunning(false);
            }, LEAVE_DEBOUNCE_MS);
        };

        const onMouseEnter = () => {
            clearLeaveTimer();
            visibleRef.current = true;
            setRunning(true);
        };

        const onWindowFocus = () => {
            clearLeaveTimer();
            visibleRef.current = true;
            if (!document.hidden) setRunning(true);
        };

        // Background tabs still fire rAF in some browsers and always waste work
        // in none — stop entirely and restore the native cursor while hidden.
        const onVisibilityChange = () => {
            if (document.hidden) {
                setRunning(false);
            } else {
                clearLeaveTimer();
                visibleRef.current = true;
                setRunning(true);
            }
        };

        // ─── Register ────────────────────────────────────────────────────────────
        document.addEventListener('mousemove',        onMouseMove);
        document.addEventListener('pointermove',      onPointerMove);
        document.addEventListener('mousedown',        onMouseDown);
        document.addEventListener('mouseup',          onMouseUp);
        document.addEventListener('click',            onDocumentClick);
        document.addEventListener('pointercancel',    onPointerCancel);
        document.addEventListener('mouseleave',       onMouseLeave);
        document.addEventListener('mouseenter',       onMouseEnter);
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus',              onWindowFocus);

        if (!document.hidden) setRunning(true);

        return () => {
            clearLeaveTimer();
            themeObserver.disconnect();
            window.removeEventListener('resize',             resize);
            window.removeEventListener('focus',              onWindowFocus);
            document.removeEventListener('mousemove',        onMouseMove);
            document.removeEventListener('pointermove',      onPointerMove);
            document.removeEventListener('mousedown',        onMouseDown);
            document.removeEventListener('mouseup',          onMouseUp);
            document.removeEventListener('click',            onDocumentClick);
            document.removeEventListener('pointercancel',    onPointerCancel);
            document.removeEventListener('mouseleave',       onMouseLeave);
            document.removeEventListener('mouseenter',       onMouseEnter);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            // Loop stopped ⇒ native cursor restored. Never leave the page with
            // `cursor: none` and nothing painting a replacement.
            setRunning(false);
        };
    }, [enabled, render, spawnRipple, syncNativeCursor]);

    /* Disabled (touch, reduced motion): the CSS rule doesn't apply either, so
       the native cursor is already showing. Drop the overlay entirely. */
    useEffect(() => {
        if (enabled) return;
        textZoneRef.current = false;
        lostRef.current = false;
        runningRef.current = false;
        nativeRef.current = document.body.hasAttribute('data-cursor-lost');
        // Harmless while the media query doesn't match, and correct the instant
        // it starts matching again.
        syncNativeCursor();
    }, [enabled, syncNativeCursor]);

    if (!enabled) return null;

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999 }}
        />
    );
}
