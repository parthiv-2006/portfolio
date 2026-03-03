import { motion } from 'framer-motion';

export default function BentoItem({ children, className = '', delay = 0, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
            onClick={onClick}
            className={`relative rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-6 overflow-hidden group cursor-pointer hover:border-border-hover transition-colors duration-300 ${className}`}
        >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--color-accent-glow)_0%,transparent_70%)]" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
