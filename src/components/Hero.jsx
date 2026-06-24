import { useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download } from 'lucide-react';
import useLatestRepo from '../hooks/useLatestRepo';

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'good morning';
    if (hour >= 12 && hour < 17) return 'good afternoon';
    if (hour >= 17 && hour < 21) return 'good evening';
    return 'late night coding?';
}

/* ── Canvas particle field ── */
function useParticleCanvas(canvasRef) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let particles = [];

        const ACCENT = 'rgba(226,160,78,';
        const COUNT = 55;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function init() {
            resize();
            particles = Array.from({ length: COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.6,
                o: Math.random() * 0.5 + 0.15,
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = ACCENT + p.o + ')';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = ACCENT + (0.06 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        }

        init();
        draw();
        window.addEventListener('resize', init);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', init);
        };
    }, [canvasRef]);
}

/* ── Hoverable letter ── */
function HoverLetter({ char }) {
    return (
        <motion.span
            className="inline-block cursor-default"
            whileHover={{ y: -11, color: 'var(--color-accent)' }}
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

    useParticleCanvas(canvasRef);

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
            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
                style={{ pointerEvents: 'none' }}
            />

            {/* Ambient warm glow */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 64% 52% at 50% 40%, rgba(226,160,78,0.07) 0%, transparent 66%)',
                }}
            />

            <motion.div
                className="relative z-[2] w-full max-w-5xl mx-auto px-6 text-center"
                style={{ y: contentY, opacity: contentOpacity }}
            >
                {/* Greeting */}
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-text-dim text-sm tracking-[0.28em] uppercase mb-6"
                >
                    {greeting}
                </motion.p>

                {/* Name with letter-hover */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-text leading-[0.9] tracking-tight mb-6 select-none"
                    style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', fontStyle: 'italic' }}
                >
                    <span className="block">
                        {firstLine.split('').map((ch, i) => <HoverLetter key={i} char={ch} />)}
                    </span>
                    <span className="block">
                        {secondLine.split('').map((ch, i) => <HoverLetter key={i} char={ch} />)}
                        <motion.span
                            className="text-accent cursor-pointer"
                            whileHover={{ scale: 1.25, rotate: 8 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
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

                {/* Role */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="font-mono text-accent text-base tracking-[0.04em] mb-4 cursor-blink"
                >
                    cs @ uoft · full-stack &amp; ai engineer
                </motion.p>

                {/* Currently working on */}
                {latestRepo && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="font-mono text-text-dim text-xs tracking-wide mb-4 flex items-center justify-center gap-2 flex-wrap"
                    >
                        <span className="relative inline-flex w-[7px] h-[7px]">
                            <span className="absolute inset-0 rounded-full bg-accent" />
                            <span className="absolute inset-0 rounded-full bg-accent animate-[glow-pulse_1.8s_ease-in-out_infinite]" />
                        </span>
                        currently working on{' '}
                        <a
                            href={latestRepo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:opacity-75 transition-opacity"
                        >
                            {latestRepo.name}
                        </a>
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
                    className="flex items-center justify-center gap-5"
                >
                    <a
                        href="#work"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-accent transition-colors duration-300 group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded px-2 -mx-2"
                    >
                        See my work
                        <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                    </a>

                    <span className="w-1 h-1 rounded-full bg-text-dim/50" />

                    <a
                        href="parthiv_paul_swe.pdf"
                        download="parthiv_paul_swe.pdf"
                        className="group/resume relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-accent border border-accent/25 bg-accent/[0.07] hover:bg-accent/15 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(226,160,78,0.15)] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <span className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]" />
                        <Download size={14} className="transition-transform duration-300 group-hover/resume:translate-y-0.5" />
                        Résumé
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll dot indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] w-[22px] h-9 border border-white/[0.12] rounded-xl flex justify-center pt-[7px]">
                <span
                    className="w-[3px] h-[7px] rounded-sm bg-accent"
                    style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }}
                />
            </div>
        </section>
    );
}
