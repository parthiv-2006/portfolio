import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, subtitle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mb-12"
        >
            {label && (
                <span className="text-accent text-sm font-mono tracking-widest uppercase mb-3 block">
                    {label}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">{title}</h2>
            {subtitle && (
                <p className="mt-3 text-text-muted text-lg max-w-2xl">{subtitle}</p>
            )}
        </motion.div>
    );
}
