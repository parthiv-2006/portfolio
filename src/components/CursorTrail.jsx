import { useEffect, useRef, useCallback } from 'react';

/**
 * CursorTrail — State-Aware Custom Cursor
 * ─────────────────────────────────────────
 * Three distinct cursor states, each with unique visual language:
 *
 * 1. DEFAULT (scrolling/idle)
 *    Small accent dot + comet-tail particle trail
 *
 * 2. HOVER (over interactive elements: a, button, input, etc.)
 *    Dot shrinks to a tiny point. A larger ring expands around it
 *    creating a "lens" or "target lock" effect. The ring breathes
 *    with a subtle pulse. Trail particles become wider + slower.
 *
 * 3. CLICK (mousedown)
 *    Ring contracts sharply inward. A ripple burst fires outward.
 *    Dot scales up briefly. Spring-back to hover state on release.
 *
 * Performance: canvas-only, requestAnimationFrame, object-pooled particles,
 * lerped transitions (no sudden jumps), prefers-reduced-motion respected.
 */

const PARTICLE_COUNT = 15;
const PARTICLE_LIFETIME = 400;
const SPAWN_RATE = 24;
const TRAIL_MAX_RADIUS = 2;

// Accent color matching the portfolio
const ACCENT = { r: 226, g: 160, b: 78 };

// Interactive element selector for hover detection
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [tabindex], label, summary';

// Lerp utility for smooth transitions
const lerp = (a, b, t) => a + (b - a) * t;

export default function CursorTrail() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -100, y: -100 });
    const particlesRef = useRef([]);
    const ripplesRef = useRef([]);
    const lastSpawnRef = useRef(0);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);

    // Cursor state: 'default' | 'hover' | 'click'
    const stateRef = useRef('default');

    // Animated values (lerped each frame for smooth transitions)
    const animRef = useRef({
        dotRadius: 4,       // Current dot radius
        ringRadius: 0,      // Current ring radius (0 = invisible)
        ringAlpha: 0,       // Current ring opacity
        glowRadius: 18,     // Ambient glow size
        ringRotation: 0,    // Ring dashed rotation angle
    });

    // Target values per state
    const getTargets = (state) => {
        switch (state) {
            case 'hover':
                return { dotRadius: 2, ringRadius: 18, ringAlpha: 0.4, glowRadius: 14 };
            case 'click':
                return { dotRadius: 4, ringRadius: 10, ringAlpha: 0.6, glowRadius: 6 };
            default:
                return { dotRadius: 3, ringRadius: 0, ringAlpha: 0, glowRadius: 10 };
        }
    };

    /* ── Spawn a trail particle ── */
    const spawnParticle = useCallback(() => {
        const { x, y } = mouseRef.current;
        if (x < 0 || y < 0) return;

        const isHover = stateRef.current === 'hover';
        particlesRef.current.push({
            x,
            y,
            born: performance.now(),
            vx: (Math.random() - 0.5) * (isHover ? 0.8 : 0.4),
            vy: (Math.random() - 0.5) * (isHover ? 0.8 : 0.4),
        });

        if (particlesRef.current.length > PARTICLE_COUNT) {
            particlesRef.current.shift();
        }
    }, []);

    /* ── Spawn a ripple burst (on click) ── */
    const spawnRipple = useCallback(() => {
        const { x, y } = mouseRef.current;
        ripplesRef.current.push({
            x,
            y,
            born: performance.now(),
            maxRadius: 40 + Math.random() * 15,
        });
    }, []);

    /* ── Main render loop ── */
    const render = useCallback((now) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const anim = animRef.current;
        const targets = getTargets(stateRef.current);

        // Lerp speed — faster for click (snappy), slower for hover (smooth)
        const speed = stateRef.current === 'click' ? 0.2 : 0.1;
        anim.dotRadius = lerp(anim.dotRadius, targets.dotRadius, speed);
        anim.ringRadius = lerp(anim.ringRadius, targets.ringRadius, speed);
        anim.ringAlpha = lerp(anim.ringAlpha, targets.ringAlpha, speed);
        anim.glowRadius = lerp(anim.glowRadius, targets.glowRadius, speed);
        anim.ringRotation += 0.01; // Slow continuous rotation

        // Spawn trail particles
        if (now - lastSpawnRef.current > SPAWN_RATE && visibleRef.current) {
            spawnParticle();
            lastSpawnRef.current = now;
        }

        // ── Draw trail particles ──
        const alive = [];
        for (const p of particlesRef.current) {
            const age = now - p.born;
            if (age > PARTICLE_LIFETIME) continue;

            const progress = age / PARTICLE_LIFETIME;
            const alpha = 1 - progress;
            const radius = TRAIL_MAX_RADIUS * (1 - progress * 0.7);

            p.x += p.vx;
            p.y += p.vy;

            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha * 0.25})`;
            ctx.fill();

            alive.push(p);
        }
        particlesRef.current = alive;

        // ── Draw comet-tail line ──
        if (alive.length > 1) {
            ctx.beginPath();
            ctx.moveTo(alive[0].x, alive[0].y);
            for (let i = 1; i < alive.length; i++) {
                const progress = (now - alive[i].born) / PARTICLE_LIFETIME;
                ctx.lineTo(alive[i].x, alive[i].y);
                ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${(1 - progress) * 0.08})`;
            }
            const { x: mx, y: my } = mouseRef.current;
            ctx.lineTo(mx, my);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // ── Draw ripple bursts ──
        const aliveRipples = [];
        for (const r of ripplesRef.current) {
            const age = now - r.born;
            const duration = 500;
            if (age > duration) continue;

            const progress = age / duration;
            const radius = r.maxRadius * progress;
            const alpha = (1 - progress) * 0.35;

            ctx.beginPath();
            ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`;
            ctx.lineWidth = 1.5 * (1 - progress);
            ctx.stroke();

            aliveRipples.push(r);
        }
        ripplesRef.current = aliveRipples;

        // ── Draw main cursor ──
        if (visibleRef.current) {
            const { x, y } = mouseRef.current;

            // Ambient glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, anim.glowRadius);
            gradient.addColorStop(0, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.08)`);
            gradient.addColorStop(1, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0)`);
            ctx.beginPath();
            ctx.arc(x, y, anim.glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // ── Hover/click ring ──
            if (anim.ringRadius > 0.5) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(anim.ringRotation);
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 4;

                // Dashed ring for that "target lock" feel
                ctx.beginPath();
                ctx.arc(0, 0, anim.ringRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${anim.ringAlpha})`;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 6]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Four crosshair ticks at cardinal points
                const tickLen = 4;
                const tickDist = anim.ringRadius + 3;
                ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${anim.ringAlpha * 0.6})`;
                ctx.lineWidth = 1;
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i;
                    const cx = Math.cos(angle) * tickDist;
                    const cy = Math.sin(angle) * tickDist;
                    const ex = Math.cos(angle) * (tickDist + tickLen);
                    const ey = Math.sin(angle) * (tickDist + tickLen);
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                }

                ctx.restore();
            }

            // Core dot — dark shadow ensures contrast on light backgrounds
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(x, y, anim.dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.9)`;
            ctx.fill();
            ctx.restore();

            // White hot center
            if (anim.dotRadius > 1.5) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, 0.85)`;
                ctx.fill();
            }
        }

        rafRef.current = requestAnimationFrame(render);
    }, [spawnParticle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect accessibility: reduced motion or touch-only → bail
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(hover: none)').matches) return;

        // Size canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Mouse tracking ──
        const onMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            // Always restore visibility on movement (handles tab-switch / focus return)
            visibleRef.current = true;

            // Detect hover over interactive elements
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const isInteractive = target && target.closest(INTERACTIVE_SELECTOR);

            if (stateRef.current !== 'click') {
                stateRef.current = isInteractive ? 'hover' : 'default';
            }
        };

        const onMouseDown = () => {
            visibleRef.current = true; // clicking always means cursor is present
            stateRef.current = 'click';
            spawnRipple();
        };

        const onMouseUp = () => {
            visibleRef.current = true; // restore after any click, no matter what
            // Check if still hovering something interactive
            const { x, y } = mouseRef.current;
            const target = document.elementFromPoint(x, y);
            const isInteractive = target && target.closest(INTERACTIVE_SELECTOR);
            stateRef.current = isInteractive ? 'hover' : 'default';
        };

        const onMouseLeave = () => {
            visibleRef.current = false;
        };
        const onMouseEnter = () => {
            visibleRef.current = true;
        };

        // Restore cursor when the window regains focus after switching to another
        // tab/app (e.g. clicking "Live Demo" then returning to the portfolio).
        // `document.mouseenter` is unreliable in this scenario; `window.focus`
        // and `visibilitychange` fire consistently across browsers.
        const onWindowFocus = () => {
            visibleRef.current = true;
        };
        const onVisibilityChange = () => {
            if (!document.hidden) visibleRef.current = true;
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus', onWindowFocus);

        // Start render loop
        rafRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('focus', onWindowFocus);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [render, spawnRipple]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999 }}
        />
    );
}
