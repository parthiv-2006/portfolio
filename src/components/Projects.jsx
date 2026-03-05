import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const projects = [
    {
        id: 'anima',
        title: 'Anima',
        tagline: 'Gamified Habit Tracking',
        description:
            'A full-stack gamified habit-tracking application that transforms daily routines into engaging quests. Users create habits, earn XP, level up their character avatar, and compete on leaderboards — making self-improvement feel like playing an RPG.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Framer Motion', 'JWT Auth'],
        year: '2025',
        role: 'Full-Stack',
    },
    {
        id: 'macromatch',
        title: 'MacroMatch',
        tagline: 'Full-Stack Nutrition Platform',
        description:
            'An intelligent nutrition platform that helps users track macronutrients, plan meals, and reach dietary goals. Features AI-powered meal suggestions based on user preferences and fitness objectives.',
        tech: ['React', 'Python', 'Flask', 'PostgreSQL', 'REST API', 'Chart.js'],
        year: '2025',
        role: 'Full-Stack',
    },
    {
        id: 'uofthacks',
        title: 'UofTHacks Submission',
        tagline: 'Hackathon Project',
        description:
            'A hackathon project built in 36 hours at UofTHacks. Rapid prototyping of an innovative solution addressing real-world challenges with a team of talented engineers.',
        tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
        year: '2025',
        role: 'Frontend Lead',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.1 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

export default function Projects() {
    const [selected, setSelected] = useState(null);

    return (
        <section id="projects" className="w-full">
            <div className="w-full">
                <SectionHeading
                    label="Work"
                    title="Featured Projects"
                />

                <div className="space-y-4">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                            onClick={() => setSelected(project)}
                            className="group relative rounded-xl border border-white/[0.06] bg-surface/40 overflow-hidden cursor-pointer transition-all duration-400 hover:border-accent/30 hover:bg-surface"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 p-5 md:p-6">
                                {/* Left: number + title */}
                                <div className="flex items-baseline gap-4 md:w-[280px] shrink-0">
                                    <span className="font-mono text-text-dim text-xs tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text tracking-tight group-hover:text-accent transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-text-dim text-xs mt-0.5">{project.tagline}</p>
                                    </div>
                                </div>

                                {/* Center: tech stack */}
                                <div className="flex flex-wrap gap-1.5 flex-1 md:px-6">
                                    {project.tech.slice(0, 4).map((t) => (
                                        <span
                                            key={t}
                                            className="px-2.5 py-1 text-[11px] rounded-md bg-surface-light/60 text-text-dim font-mono border border-white/[0.04] transition-colors duration-300 group-hover:text-text-muted group-hover:border-white/[0.08]"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                    {project.tech.length > 4 && (
                                        <span className="px-2.5 py-1 text-[11px] rounded-md text-text-dim font-mono">
                                            +{project.tech.length - 4}
                                        </span>
                                    )}
                                </div>

                                {/* Right: year + arrow */}
                                <div className="flex items-center gap-4 md:ml-auto shrink-0">
                                    <span className="font-mono text-text-dim text-xs hidden sm:block">
                                        {project.year}
                                    </span>
                                    <ArrowUpRight
                                        size={16}
                                        className="text-text-dim group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </div>
                            </div>

                            {/* Bottom border accent on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Expanded detail modal */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40"
                            >
                                {/* Header */}
                                <div className="p-6 pb-0 flex items-start justify-between">
                                    <div>
                                        <p className="font-mono text-accent text-xs tracking-wide mb-2">
                                            {selected.role} · {selected.year}
                                        </p>
                                        <h3 className="text-2xl font-bold tracking-tight text-text">
                                            {selected.title}
                                        </h3>
                                        <p className="text-text-muted text-sm mt-1">{selected.tagline}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="p-2 rounded-lg text-text-dim hover:text-text hover:bg-surface-light transition-colors"
                                        aria-label="Close"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="mx-6 my-5 h-px bg-white/[0.06]" />

                                {/* Body */}
                                <div className="px-6 pb-6">
                                    <p className="text-text-muted text-sm leading-relaxed mb-6">
                                        {selected.description}
                                    </p>

                                    <h4 className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-3">
                                        Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selected.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-3 py-1.5 text-xs rounded-lg bg-surface-light text-text-muted font-mono border border-white/[0.06]"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium border border-accent/20 hover:bg-accent/20 transition-colors"
                                        >
                                            <Github size={15} /> Source
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light text-text-muted text-sm font-medium border border-white/[0.06] hover:border-white/[0.15] hover:text-text transition-colors"
                                        >
                                            <ExternalLink size={15} /> Live Demo
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
