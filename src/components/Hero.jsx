import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef(null);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPos({ x, y });
    };

    return (
        <section
            id="hero"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        >
            {/* Mouse-following radial gradient glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
                style={{
                    background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,229,255,0.08), transparent 60%)`,
                }}
            />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(228,228,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(228,228,231,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block text-accent font-mono text-sm tracking-widest uppercase mb-6"
                    >
                        Software Engineer
                    </motion.span>

                    <h1
                        className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.04em] mb-8"
                        style={{
                            background: 'linear-gradient(135deg, #e4e4e7 0%, #71717a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Parthiv
                        <br />
                        <span>
                            Paul
                            <span style={{ WebkitTextFillColor: '#00e5ff' }}>.</span>
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-text-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
                    >
                        Computer Science Specialist @ University of Toronto.
                        <br className="hidden sm:block" />
                        Building full-stack systems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <a
                            href="#projects"
                            className="group relative px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]"
                        >
                            <span className="relative z-10">View Projects</span>
                        </a>
                        <a
                            href="#contact"
                            className="px-6 py-3 rounded-xl border border-border text-text-muted text-sm font-medium hover:border-accent/30 hover:text-accent transition-all duration-300"
                        >
                            Contact Me
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                        <ArrowDown size={20} className="text-text-dim" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
