import { motion } from 'framer-motion';

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

export default function ScrollProgress({ activeSection }) {
    const handleClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
            {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                    <button
                        key={section.id}
                        onClick={() => handleClick(section.id)}
                        className="group relative flex items-center"
                        aria-label={`Go to ${section.label}`}
                    >
                        {/* Tooltip */}
                        <span className="absolute right-6 px-2 py-1 rounded-md bg-surface-light text-text text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            {section.label}
                        </span>

                        {/* Dot */}
                        <motion.div
                            className="rounded-full transition-colors duration-300"
                            animate={{
                                width: isActive ? 10 : 6,
                                height: isActive ? 10 : 6,
                                backgroundColor: isActive
                                    ? 'var(--color-accent)'
                                    : 'rgba(255,255,255,0.15)',
                                boxShadow: isActive
                                    ? '0 0 12px rgba(0,229,255,0.5)'
                                    : '0 0 0px transparent',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                    </button>
                );
            })}
        </div>
    );
}
