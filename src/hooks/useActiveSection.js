import { useState, useEffect, useRef } from 'react';

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];

export default function useActiveSection() {
    const [activeSection, setActiveSection] = useState('hero');
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Pick the entry with the largest intersection ratio
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                }
            },
            { threshold: [0.3, 0.5, 0.7] }
        );

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    return { activeSection, sectionIds: SECTION_IDS };
}
