import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic button effect — button drifts toward cursor when hovered nearby,
 * then springs back on leave. Matches the `data-magnetic` behavior in the
 * Claude Design reference.
 *
 * @param {number} strength  How far the button moves (0–1). Default 0.35.
 */
export function useMagnetic(strength = 0.35) {
    const ref = useRef(null);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

    const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 });
    const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 });

    const onMouseMove = useCallback(
        (e) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
            rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
        },
        [rawX, rawY, strength]
    );

    const onMouseLeave = useCallback(() => {
        rawX.set(0);
        rawY.set(0);
    }, [rawX, rawY]);

    return { ref, motionStyle: { x, y }, onMouseMove, onMouseLeave };
}
