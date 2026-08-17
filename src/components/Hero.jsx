import { useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download } from 'lucide-react';
import useLatestRepo from '../hooks/useLatestRepo';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import useIsTouch from '../hooks/useIsTouch';

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'good morning';
    if (hour >= 12 && hour < 17) return 'good afternoon';
    if (hour >= 17 && hour < 21) return 'good evening';
    return 'late night coding?';
}

const FALLBACK_ACCENT = 'rgba(226,160,78,';

/**
 * Read the live `--color-accent` token and turn it into an `rgba(r,g,b,`
 * prefix, so canvas strokes follow whichever theme is active.
 */
function readAccentPrefix() {
    const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim();

    const hex = raw.match(/^#([0-9a-f]{3,8})$/i);
    if (hex) {
        let digits = hex[1];
        if (digits.length < 6) {
            digits = digits.slice(0, 3).split('').map((c) => c + c).join('');
        }
        const int = parseInt(digits.slice(0, 6), 16);
        return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},`;
    }

    const rgb = raw.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (rgb) return `rgba(${rgb[1]},${rgb[2]},${rgb[3]},`;

    return FALLBACK_ACCENT;
}

/* ── Canvas particle field ── */
function useParticleCanvas(canvasRef, sectionRef, enabled) {
    useEffect(() => {
        if (!enabled) return undefined;
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');

        const COUNT = 55;
        const LINK = 120;
        const LINK_SQ = LINK * LINK;

        let raf = 0;
        let running = false;
        let onScreen = true;
        let resizeTimer = 0;
        let particles = [];
        // Logical (CSS pixel) size; the backing store is this times the DPR.
        let width = 0;
        let height = 0;
        let accent = readAccentPrefix();

        function measure() {
            // Cap the DPR: beyond 2x the extra pixels cost more than they show.
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return [w, h];
        }

        function seed() {
            particles = Array.from({ length: COUNT }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.6,
                o: Math.random() * 0.5 + 0.15,
            }));
        }

        function layout() {
            const prevW = width;
            const prevH = height;
            [width, height] = measure();

            if (!particles.length) {
                seed();
                return;
            }
            // Rescale instead of re-seeding so nothing teleports on resize.
            if (prevW > 0 && prevH > 0) {
                const sx = width / prevW;
                const sy = height / prevH;
                for (const p of particles) {
                    p.x *= sx;
                    p.y *= sy;
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = accent + p.o + ')';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    // Compare squared distances; only the survivors pay for a sqrt.
                    const distSq = dx * dx + dy * dy;
                    if (distSq < LINK_SQ) {
                        const fade = 0.06 * (1 - Math.sqrt(distSq) / LINK);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = accent + fade + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            raf = requestAnimationFrame(draw);
        }

        function start() {
            if (running) return;
            running = true;
            raf = requestAnimationFrame(draw);
        }

        function stop() {
            running = false;
            cancelAnimationFrame(raf);
        }

        // The loop is O(n^2) per frame — never run it for an unseen hero.
        function sync() {
            if (onScreen && !document.hidden) start();
            else stop();
        }

        function onResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layout, 150);
        }

        layout();
        sync();

        const themeObserver = new MutationObserver(() => {
            accent = readAccentPrefix();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        let io;
        const section = sectionRef.current;
        if (section && typeof IntersectionObserver !== 'undefined') {
            io = new IntersectionObserver(
                ([entry]) => {
                    onScreen = entry.isIntersecting;
                    sync();
                },
                { threshold: 0 },
            );
            io.observe(section);
        }

        // Element-level resizes (scrollbar appearing, layout shifts) plus the
        // window listener, which is what catches a devicePixelRatio change.
        let ro;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(onResize);
            ro.observe(canvas);
        }
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', sync);

        return () => {
            stop();
            clearTimeout(resizeTimer);
            themeObserver.disconnect();
            if (io) io.disconnect();
            if (ro) ro.disconnect();
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', sync);
        };
    }, [canvasRef, sectionRef, enabled]);
}

/* ── Hoverable letter ── */
function HoverLetter({ char, interactive }) {
    if (!interactive) {
        // No hover state on touch, so the lift would only ever half-fire.
        return <span className="inline-block">{char}</span>;
    }
    return (
        <motion.span
            className="inline-block cursor-default transition-colors duration-300 hover:text-accent"
            whileHover={{ y: -11 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            {char}
        </motion.span>
    );
}

export default function Hero() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const greeting = useMemo(() => getGreeting(), []);
    const latestRepo = useLatestRepo('parthiv-2006');
    const reducedMotion = usePrefersReducedMotion();
    const isTouch = useIsTouch();

    useParticleCanvas(canvasRef, containerRef, !reducedMotion);

    const scrollToAbout = useCallback(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const firstLine = 'Parthiv';
    const secondLine = 'Paul';

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden snap-section"
        >
            {/* Particle canvas — dropped entirely when the user asked for less motion */}
            {!reducedMotion && (
                <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full z-0"
                    style={{ pointerEvents: 'none' }}
                />
            )}

            {/* Ambient warm glow */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 64% 52% at 50% 40%, color-mix(in srgb, var(--color-accent) 7%, transparent) 0%, transparent 66%)',
                }}
            />

            <motion.div
                className="relative z-[2] w-full max-w-5xl mx-auto px-5 sm:px-6 text-center"
                style={{ y: contentY, opacity: contentOpacity }}
            >
                {/* Greeting */}
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-text-dim text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.28em] uppercase mb-6"
                >
                    {greeting}
                </motion.p>

                {/* Name with letter-hover */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-text leading-[0.9] tracking-tight mb-6 select-none"
                    style={{ fontSize: 'clamp(3rem, 13vw, 9rem)', fontStyle: 'italic' }}
                >
                    <span className="block">
                        {firstLine.split('').map((ch, i) => (
                            <HoverLetter key={i} char={ch} interactive={!isTouch} />
                        ))}
                    </span>
                    <span className="block">
                        {secondLine.split('').map((ch, i) => (
                            <HoverLetter key={i} char={ch} interactive={!isTouch} />
                        ))}
                        <motion.span
                            className="text-accent"
                            whileHover={isTouch ? undefined : { scale: 1.25, rotate: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            .
                        </motion.span>
                    </span>
                </motion.h1>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-24 h-px bg-accent mb-8 mx-auto"
                    style={{ transformOrigin: 'center' }}
                />

                {/* Role — tracking and size ease off on narrow screens so this
                    stays on a single row down to 375px */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="font-mono text-accent text-[13px] sm:text-base tracking-normal sm:tracking-[0.04em] mb-4 cursor-blink"
                >
                    cs @ uoft · full-stack &amp; ai engineer
                </motion.p>

                {/* Currently working on */}
                {latestRepo && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="font-mono text-text-dim text-xs tracking-wide mb-4 flex items-center justify-center gap-x-2 gap-y-1 flex-wrap"
                    >
                        <span className="relative inline-flex w-[7px] h-[7px] shrink-0">
                            <span className="absolute inset-0 rounded-full bg-accent" />
                            <span className="absolute inset-0 rounded-full bg-accent animate-[glow-pulse_1.8s_ease-in-out_infinite]" />
                        </span>
                        <span>
                            currently working on{' '}
                            <a
                                href={latestRepo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:opacity-75 transition-opacity"
                            >
                                {latestRepo.name}
                            </a>
                        </span>
                    </motion.p>
                )}

                {/* One-liner */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10"
                >
                    Always learning. Always building. Sometimes it works out.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex items-center justify-center flex-wrap gap-x-5 gap-y-3"
                >
                    <a
                        href="#work"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-accent transition-colors duration-300 group min-h-[44px] rounded px-2 -mx-2"
                    >
                        See my work
                        <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                    </a>

                    <span className="w-1 h-1 rounded-full bg-text-dim/50" />

                    <a
                        href="parthiv_paul_swe.pdf"
                        download="parthiv_paul_swe.pdf"
                        className="group/resume relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-accent border border-accent/25 bg-accent/[0.07] hover:bg-accent/15 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_20px_var(--color-accent-dim)] min-h-[44px]"
                    >
                        <span className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]" />
                        <Download size={14} className="transition-transform duration-300 group-hover/resume:translate-y-0.5" />
                        Resume
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator — a real control, sized to a 44px tap target */}
            <button
                type="button"
                onClick={scrollToAbout}
                aria-label="Scroll to the about section"
                className="group absolute bottom-7 left-1/2 -translate-x-1/2 z-[2] flex w-11 h-11 items-center justify-center"
            >
                <span className="w-[22px] h-9 border border-border-hover rounded-xl flex justify-center pt-[7px] transition-colors duration-300 group-hover:border-accent/50">
                    <span
                        className="w-[3px] h-[7px] rounded-sm bg-accent"
                        style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }}
                    />
                </span>
            </button>
        </section>
    );
}
