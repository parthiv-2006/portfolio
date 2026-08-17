import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import useIsTouch from '../hooks/useIsTouch';

const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 200, damping: 18 },
    },
};

export default function BentoItem({
    children,
    className = '',
    delay = 0,
    onClick,
    label,
    isStaggerChild = false,
}) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const reducedMotion = usePrefersReducedMotion();
    const isTouch = useIsTouch();

    const isInteractive = typeof onClick === 'function';
    // The pointer-tracked tilt is driven by React state, not framer's own
    // reduced-motion handling, so it has to opt out here explicitly.
    const tiltEnabled = !reducedMotion && !isTouch;

    const handleMouseMove = (e) => {
        if (!tiltEnabled) return;
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rotateX: -y * 8, rotateY: x * 8 });
    };

    const handleMouseLeave = () => {
        if (!tiltEnabled) return;
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    const handleKeyDown = (e) => {
        if (!isInteractive) return;
        if (e.key !== 'Enter' && e.key !== ' ') return;
        // Space would otherwise scroll the page out from under the card.
        e.preventDefault();
        onClick(e);
    };

    const interactiveProps = isInteractive
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': label,
            onClick,
            onKeyDown: handleKeyDown,
            whileTap: { scale: 0.97, transition: { type: 'spring', stiffness: 300, damping: 10 } },
        }
        : {};

    return (
        <motion.div
            ref={cardRef}
            variants={isStaggerChild ? itemVariants : undefined}
            initial={isStaggerChild ? undefined : { opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            whileInView={isStaggerChild ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={isStaggerChild ? undefined : { once: true, margin: '-100px' }}
            transition={isStaggerChild ? undefined : { type: 'spring', stiffness: 200, damping: 18, delay }}
            {...interactiveProps}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '800px',
                transformStyle: 'preserve-3d',
            }}
            className={`relative rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-5 sm:p-6 overflow-hidden group shadow-lg shadow-black/20 hover:border-border-hover hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 ${
                isInteractive ? 'cursor-pointer' : ''
            } ${className}`}
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
                {/* Subtle hover glow — accent token so it tracks the day/night theme */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--color-accent-glow)_0%,transparent_70%)]"
                />
                <div className="relative z-10">{children}</div>
            </motion.div>
        </motion.div>
    );
}
