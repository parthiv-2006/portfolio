import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download } from 'lucide-react';

/* ── Dynamic greeting based on visitor's local time ── */
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', emoji: '🌤' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', emoji: '🌅' };
    return { text: 'Late night coding?', emoji: '🌙' };
}

export default function Hero() {
    const containerRef = useRef(null);
    const greeting = useMemo(() => getGreeting(), []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden snap-section"
        >
            <motion.div
                className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
                style={{ y: contentY, opacity: contentOpacity }}
            >
                {/* Dynamic time-of-day greeting */}
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-text-dim text-sm tracking-[0.2em] uppercase mb-6"
                >
                    {greeting.text}
                </motion.p>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-text leading-[0.9] tracking-tight mb-6"
                    style={{
                        fontSize: 'clamp(4rem, 10vw, 9rem)',
                        fontStyle: 'italic',
                    }}
                >
                    Parthiv
                    <br />
                    Paul
                    <span className="text-accent">.</span>
                </motion.h1>

                {/* Horizontal rule — editorial divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-24 h-px bg-accent mb-8 mx-auto"
                    style={{ transformOrigin: 'center' }}
                />

                {/* Role line with blinking cursor */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="font-mono text-accent text-sm tracking-wide mb-6 cursor-blink"
                >
                    cs @ uoft · full-stack engineer
                </motion.p>

                {/* One-liner */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10"
                >
                    Always Learning. Always Building. Sometimes it works out.
                </motion.p>

                {/* CTAs row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex items-center justify-center gap-5"
                >
                    {/* See my work — text link */}
                    <a
                        href="#projects"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-accent transition-colors duration-300 group"
                    >
                        See my work
                        <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                            ↓
                        </span>
                    </a>

                    {/* Divider dot */}
                    <span className="w-1 h-1 rounded-full bg-text-dim/50" />

                    {/* Download Resume — creative pill button */}
                    <a
                        href="resume.pdf"
                        download="Parthiv_Paul_Resume.pdf"
                        className="group/resume relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-accent border border-accent/25 bg-accent/[0.07] hover:bg-accent/15 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(226,160,78,0.15)]"
                    >
                        {/* Animated glow ring */}
                        <span className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]" />

                        <Download
                            size={14}
                            className="transition-transform duration-300 group-hover/resume:translate-y-0.5"
                        />
                        <span>Resume</span>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
