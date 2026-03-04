import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, subtitle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            {label && (
                <span className="text-accent text-xs md:text-sm font-mono tracking-widest uppercase mb-4 block">
                    {label}
                </span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text">{title}</h2>
            {subtitle && (
                <p className="mt-4 text-text-muted text-lg max-w-2xl leading-relaxed">{subtitle}</p>
            )}
        </motion.div>
    );
}
