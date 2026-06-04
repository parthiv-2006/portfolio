import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, subtitle }) {
    const words = title.split(' ');

    return (
        <div className="mb-16">
            {label && (
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex items-center gap-3 mb-4"
                >
                    <span className="block w-6 h-px bg-accent/70 shrink-0" />
                    <span className="text-accent text-xs md:text-sm font-mono tracking-widest uppercase">
                        {label}
                    </span>
                </motion.div>
            )}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        className="inline-block mr-[0.3em]"
                        initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1 + i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 text-text-muted text-lg max-w-2xl leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
