import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 200, damping: 18 },
    },
};

export default function BentoItem({ children, className = '', delay = 0, onClick, isStaggerChild = false }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rotateX: -y * 8, rotateY: x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            variants={isStaggerChild ? itemVariants : undefined}
            initial={isStaggerChild ? undefined : { opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            whileInView={isStaggerChild ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={isStaggerChild ? undefined : { once: true, margin: '-100px' }}
            transition={isStaggerChild ? undefined : { type: 'spring', stiffness: 200, damping: 18, delay }}
            whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '800px',
                transformStyle: 'preserve-3d',
            }}
            className={`relative rounded-2xl border border-white/[0.08] bg-surface/60 backdrop-blur-sm p-6 overflow-hidden group cursor-pointer shadow-lg shadow-black/20 hover:border-white/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 ${className}`}
        >
            <motion.div
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)]" />
                <div className="relative z-10">{children}</div>
            </motion.div>
        </motion.div>
    );
}
