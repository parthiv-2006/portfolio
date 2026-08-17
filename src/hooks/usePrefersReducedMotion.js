import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the user has asked the OS to minimise motion.
 * Read it before starting rAF loops, autoplaying marquees, or long
 * transform animations so the site stays comfortable for everyone.
 */
export default function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(QUERY).matches;
    });

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    return reduced;
}
