import { useEffect, useRef, useCallback } from 'react';

/**
 * CursorTrail — State-Aware Custom Cursor
 *
 * States: 'default' | 'hover' | 'click'
 *
 * Visibility model:
 *   visibleRef drives whether the cursor is drawn. It starts true and is only
 *   set false by a DEBOUNCED mouseleave (150 ms). Any mouse activity within
 *   that window cancels the hide, preventing spurious disappearances caused by
 *   OS scrollbars, Framer Motion DOM mutations, overlays, and iframes.
 */

const PARTICLE_COUNT = 15;
const PARTICLE_LIFETIME = 400;
const SPAWN_RATE = 24;
const TRAIL_MAX_RADIUS = 2;

const ACCENT = { r: 226, g: 160, b: 78 };

const INTERACTIVE_SELECTOR =
    'a, button, input, textarea, select, [role="button"], [tabindex], label, summary';

const lerp = (a, b, t) => a + (b - a) * t;

export default function CursorTrail() {
    const canvasRef    = useRef(null);
    const mouseRef     = useRef({ x: -100, y: -100 });
    const particlesRef = useRef([]);
    const ripplesRef   = useRef([]);
    const lastSpawnRef = useRef(0);
    const rafRef       = useRef(null);
    const visibleRef   = useRef(true);
    const clickStampRef  = useRef(0);
    const leaveTimerRef  = useRef(null); // debounce handle for mouseleave

    const stateRef = useRef('default');

    const animRef = useRef({
        dotRadius:    4,
        ringRadius:   0,
        ringAlpha:    0,
        glowRadius:   18,
        ringRotation: 0,
    });

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
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const anim    = animRef.current;
        const targets = getTargets(stateRef.current);

        // Auto-recover from stuck 'click' state (missed mouseup, focus traps, rapid clicks)
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
            ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${(1 - progress) * 0.25})`;
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
                ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${(1 - progress) * 0.08})`;
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
            ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${(1 - progress) * 0.35})`;
            ctx.lineWidth   = 1.5 * (1 - progress);
            ctx.stroke();
            aliveRipples.push(r);
        }
        ripplesRef.current = aliveRipples;

        // ── Cursor dot ──
        if (visibleRef.current) {
            const { x, y } = mouseRef.current;

            // Ambient glow
            const g = ctx.createRadialGradient(x, y, 0, x, y, anim.glowRadius);
            g.addColorStop(0, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.08)`);
            g.addColorStop(1, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0)`);
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
                ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${anim.ringAlpha})`;
                ctx.lineWidth   = 1.5;
                ctx.setLineDash([4, 6]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${anim.ringAlpha * 0.6})`;
                ctx.lineWidth   = 1;
                const tickDist = anim.ringRadius + 3;
                const tickLen  = 4;
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle) * tickDist,         Math.sin(angle) * tickDist);
                    ctx.lineTo(Math.cos(angle) * (tickDist + tickLen), Math.sin(angle) * (tickDist + tickLen));
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Core dot — shadow gives depth; stroke ring ensures contrast on light backgrounds
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur  = 8;
            ctx.beginPath();
            ctx.arc(x, y, anim.dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.9)`;
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

        rafRef.current = requestAnimationFrame(render);
    }, [spawnParticle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(hover: none)').matches) return;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

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

        const hoverState = (e) => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            return target?.closest(INTERACTIVE_SELECTOR) ? 'hover' : 'default';
        };

        // ─── Event handlers ─────────────────────────────────────────────────────

        const onMouseMove = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current = true;

            // Recover from missed mouseup (e.g. click opened new tab)
            if (stateRef.current === 'click' && e.buttons === 0) {
                stateRef.current = 'default';
            }

            if (stateRef.current !== 'click') {
                stateRef.current = hoverState(e);
            }
        };

        const onMouseDown = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current   = true;
            stateRef.current     = 'click';
            clickStampRef.current = performance.now();
            spawnRipple();
        };

        const onMouseUp = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current = true;
            stateRef.current   = hoverState(e);
        };

        // Fires after mouseup — clears any spurious mouseleave that DOM mutations
        // (modals, overlays, Framer Motion animations) may have triggered.
        const onDocumentClick = (e) => {
            clearLeaveTimer();
            setPos(e);
            visibleRef.current = true;
        };

        const onPointerCancel = () => {
            if (stateRef.current === 'click') stateRef.current = 'default';
        };

        // Debounced hide: only set invisible if NO mouse activity arrives within
        // 150 ms. This prevents spurious hides from scrollbars, iframes, and
        // overlay DOM mutations that fire mouseleave without a matching mouseenter.
        const onMouseLeave = () => {
            clearLeaveTimer();
            leaveTimerRef.current = setTimeout(() => {
                visibleRef.current = false;
            }, 150);
        };

        const onMouseEnter = () => {
            clearLeaveTimer();
            visibleRef.current = true;
        };

        const onWindowFocus = () => {
            clearLeaveTimer();
            visibleRef.current = true;
        };

        const onVisibilityChange = () => {
            if (!document.hidden) {
                clearLeaveTimer();
                visibleRef.current = true;
            }
        };

        // ─── Register ────────────────────────────────────────────────────────────
        document.addEventListener('mousemove',       onMouseMove);
        document.addEventListener('mousedown',       onMouseDown);
        document.addEventListener('mouseup',         onMouseUp);
        document.addEventListener('click',           onDocumentClick);
        document.addEventListener('pointercancel',   onPointerCancel);
        document.addEventListener('mouseleave',      onMouseLeave);
        document.addEventListener('mouseenter',      onMouseEnter);
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus',             onWindowFocus);

        rafRef.current = requestAnimationFrame(render);

        return () => {
            clearLeaveTimer();
            window.removeEventListener('resize',            resize);
            window.removeEventListener('focus',             onWindowFocus);
            document.removeEventListener('mousemove',       onMouseMove);
            document.removeEventListener('mousedown',       onMouseDown);
            document.removeEventListener('mouseup',         onMouseUp);
            document.removeEventListener('click',           onDocumentClick);
            document.removeEventListener('pointercancel',   onPointerCancel);
            document.removeEventListener('mouseleave',      onMouseLeave);
            document.removeEventListener('mouseenter',      onMouseEnter);
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
