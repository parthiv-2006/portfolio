import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

/* Splits a string into characters, preserving spaces as thin wrappers */
function SplitChars({ text, className = '', charClassName = '' }) {
    return (
        <span className={className} aria-label={text}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    className={`inline-block ${charClassName}`}
                    variants={{
                        hidden: { opacity: 0, y: 60, rotateX: -80, filter: 'blur(8px)' },
                        visible: {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            filter: 'blur(0px)',
                            transition: {
                                type: 'spring',
                                stiffness: 150,
                                damping: 12,
                                delay: i * 0.04 + Math.random() * 0.02,
                            },
                        },
                    }}
                    aria-hidden="true"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}

export default function Hero() {
    const containerRef = useRef(null);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    // Parallax transforms for depth layers
    const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPos({ x, y });
    };

    const titleVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0 } },
    };

    return (
        <section
            id="hero"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 snap-section"
        >
            {/* Animated gradient blob — parallax layer 1 */}
            <motion.div
                className="absolute pointer-events-none w-[500px] h-[500px] rounded-full opacity-30"
                style={{
                    background:
                        'radial-gradient(circle, rgba(0,229,255,0.25) 0%, rgba(0,229,255,0.05) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    y: blob1Y,
                }}
                animate={{
                    x: [0, 80, -60, 40, 0],
                    y: [0, -60, 40, -80, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Secondary blob — parallax layer 2 */}
            <motion.div
                className="absolute pointer-events-none w-[350px] h-[350px] rounded-full opacity-20"
                style={{
                    background:
                        'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    y: blob2Y,
                }}
                animate={{
                    x: [0, -70, 50, -30, 0],
                    y: [0, 50, -70, 30, 0],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Mouse-following radial gradient glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
                style={{
                    background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,229,255,0.07), transparent 60%)`,
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

            <motion.div
                className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={titleVariants}
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block text-accent font-mono text-sm tracking-widest uppercase mb-6"
                    >
                        Software Engineer
                    </motion.span>

                    <motion.h1
                        className="text-[clamp(3rem,9vw,8rem)] font-black leading-none tracking-tighter mb-8"
                        style={{
                            perspective: '600px',
                        }}
                        initial="hidden"
                        animate="visible"
                        variants={titleVariants}
                    >
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            <SplitChars text="Parthiv" />
                        </span>
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            <SplitChars text="Paul" />
                        </span>
                        <motion.span
                            style={{ WebkitTextFillColor: '#00e5ff' }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: 0.5,
                                type: 'spring',
                                stiffness: 400,
                                damping: 10,
                            }}
                            className="inline-block"
                        >
                            .
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-text-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
                    >
                        Computer Science Specialist @ University of Toronto.
                        <br className="hidden sm:block" />
                        Building full-stack systems.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
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
                            className="px-6 py-3 rounded-xl border border-white/10 text-text-muted text-sm font-medium hover:border-accent/30 hover:text-accent transition-all duration-300"
                        >
                            Contact Me
                        </a>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                    <ArrowDown size={20} className="text-text-dim" />
                </motion.div>
            </motion.div>
        </section>
    );
}
