import { motion } from 'framer-motion';

/**
 * Shared section opener. `rule` is opt-out only — every section is meant to
 * open the same way, so callers get the accent rule without asking for it.
 */
export default function SectionHeading({ label, title, subtitle, rule = true }) {
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
                    <span className="h-px flex-1 max-w-[120px] bg-border-hover" aria-hidden="true" />
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
            {rule && (
                <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="block h-px w-[104px] mt-5 origin-left bg-gradient-to-r from-accent to-transparent"
                />
            )}
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
