import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, subtitle }) {
    return (
        <div className="mb-12">
            {label && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex items-center gap-3 mb-4"
                >
                    <span className="font-mono text-xs tracking-[0.28em] uppercase text-accent">{label}</span>
                    <span className="h-px flex-1 max-w-[120px] bg-white/[0.12]" />
                </motion.div>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-text leading-[1.02] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontStyle: 'italic', fontWeight: 400 }}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mt-3 text-text-muted text-[15px] max-w-[480px] leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
