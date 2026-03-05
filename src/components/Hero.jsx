import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
    const containerRef = useRef(null);

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
            className="relative min-h-screen flex items-end overflow-hidden snap-section"
        >
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-[12vh]"
                style={{ y: contentY, opacity: contentOpacity }}
            >
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
                    className="w-24 h-px bg-accent mb-8"
                    style={{ transformOrigin: 'left' }}
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
                    className="text-text-muted text-base md:text-lg max-w-lg leading-relaxed mb-10"
                >
                    I care about performance, clean APIs, and interfaces
                    that don't get in the way.
                </motion.p>

                {/* Single CTA — text link, not a button */}
                <motion.a
                    href="#projects"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
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
                </motion.a>
            </motion.div>
        </section>
    );
}
