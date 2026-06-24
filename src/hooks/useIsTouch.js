import { useState, useEffect } from 'react';

// True on coarse-pointer / no-hover devices (phones, most tablets).
export default function useIsTouch() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(hover: none), (pointer: coarse)');
        const update = () => setIsTouch(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);
    return isTouch;
}
