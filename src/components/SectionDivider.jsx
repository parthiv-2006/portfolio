import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const variants = {
    line: LineVariant,
    code: CodeVariant,
    dots: DotsVariant,
};

export default function SectionDivider({ variant = 'line', label }) {
    const Variant = variants[variant] || LineVariant;

    return (
        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
            <Variant label={label} />
        </div>
    );
}

/* ── Animated growing line ── */
function LineVariant({ label }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.8', 'end 0.5'],
    });
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div ref={ref} className="flex items-center gap-4">
            <motion.div
                className="flex-1 h-px bg-accent/30 origin-left"
                style={{ scaleX }}
            />
            {label && (
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="font-mono text-[10px] text-text-dim uppercase tracking-[0.2em] shrink-0"
                >
                    {label}
                </motion.span>
            )}
            <motion.div
                className="flex-1 h-px bg-accent/30 origin-right"
                style={{ scaleX }}
            />
        </div>
    );
}

/* ── Code-style comment divider ── */
function CodeVariant({ label }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <span className="font-mono text-[11px] text-text-dim/50">
                {'// '}
                <span className="text-accent/40">{label || '---'}</span>
            </span>
        </motion.div>
    );
}

/* ── Animated dots trail ── */
function DotsVariant() {
    return (
        <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: i * 0.08,
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                    }}
                    className={`rounded-full ${i === 2
                            ? 'w-2 h-2 bg-accent/50'
                            : 'w-1.5 h-1.5 bg-text-dim/30'
                        }`}
                />
            ))}
        </div>
    );
}
