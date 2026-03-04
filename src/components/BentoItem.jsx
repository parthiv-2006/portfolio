import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BentoItem({ children, className = '', delay = 0, onClick, isStaggerChild = false }) {
    return (
        <motion.div
            variants={isStaggerChild ? itemVariants : undefined}
            initial={isStaggerChild ? undefined : { opacity: 0, y: 20 }}
            whileInView={isStaggerChild ? undefined : { opacity: 1, y: 0 }}
            viewport={isStaggerChild ? undefined : { once: true, margin: '-100px' }}
            transition={isStaggerChild ? undefined : { duration: 0.5, delay }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
            onClick={onClick}
            className={`relative rounded-2xl border border-white/[0.08] bg-surface/60 backdrop-blur-sm p-6 overflow-hidden group cursor-pointer shadow-lg shadow-black/20 hover:border-white/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 ${className}`}
        >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)]" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
