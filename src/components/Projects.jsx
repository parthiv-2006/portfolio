import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Gamepad2, Apple, Trophy } from 'lucide-react';
import SectionHeading from './SectionHeading';

const projects = [
    {
        id: 'anima',
        title: 'Anima',
        tagline: 'Gamified Habit Tracking',
        description:
            'A full-stack gamified habit-tracking application that transforms daily routines into engaging quests. Users create habits, earn XP, level up their character avatar, and compete on leaderboards — making self-improvement feel like playing an RPG.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Framer Motion', 'JWT Auth'],
        gradient: 'from-purple-500/40 to-cyan-500/40',
        accentColor: '#a855f7',
        icon: Gamepad2,
    },
    {
        id: 'macromatch',
        title: 'MacroMatch',
        tagline: 'Full-Stack Nutrition Platform',
        description:
            'An intelligent nutrition platform that helps users track macronutrients, plan meals, and reach dietary goals. Features AI-powered meal suggestions based on user preferences and fitness objectives.',
        tech: ['React', 'Python', 'Flask', 'PostgreSQL', 'REST API', 'Chart.js'],
        gradient: 'from-emerald-500/40 to-blue-500/40',
        accentColor: '#10b981',
        icon: Apple,
    },
    {
        id: 'uofthacks',
        title: 'UofTHacks Submission',
        tagline: 'Hackathon Project',
        description:
            'A hackathon project built in 36 hours at UofTHacks. Rapid prototyping of an innovative solution addressing real-world challenges with a team of talented engineers.',
        tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
        gradient: 'from-orange-500/40 to-rose-500/40',
        accentColor: '#f97316',
        icon: Trophy,
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
    const [selected, setSelected] = useState(null);

    return (
        <section id="projects" className="py-32 w-full">
            <div className="w-full">
                <SectionHeading
                    label="Work"
                    title="Featured Projects"
                    subtitle="A selection of projects I've built — from gamified apps to full-stack platforms."
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            layoutId={`project-${project.id}`}
                            onClick={() => setSelected(project)}
                            className="group relative rounded-2xl border border-white/[0.08] bg-surface/60 overflow-hidden cursor-pointer shadow-lg shadow-black/20 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 flex flex-col w-full h-full"
                        >
                            {/* Image placeholder area — 60% height */}
                            <div className="relative h-56 overflow-hidden bg-surface-light">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-500 group-hover:scale-105`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <project.icon
                                        size={56}
                                        className="text-white/40 group-hover:text-white/60 transition-colors duration-300"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-5 right-5">
                                    <h3 className="text-xl font-bold tracking-tight text-text">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Text + tech pills — 40% */}
                            <div className="p-5 flex-1 flex flex-col space-y-3">
                                <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-1">
                                    {project.tagline} — {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="px-2.5 py-1 text-[11px] rounded-md bg-surface-light text-text-muted font-mono border border-white/[0.06]"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Expanded modal */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                layoutId={`project-${selected.id}`}
                                className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40"
                            >
                                {/* Gradient header */}
                                <div className="relative h-48 overflow-hidden">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${selected.gradient}`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <selected.icon size={64} className="text-white/25" strokeWidth={1.5} />
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="absolute top-4 right-4 p-2 rounded-xl bg-black/30 backdrop-blur text-white/70 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                    <div className="absolute bottom-5 left-6">
                                        <h3 className="text-3xl font-bold tracking-tight text-text">
                                            {selected.title}
                                        </h3>
                                        <p className="text-text-muted text-sm mt-1">{selected.tagline}</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <p className="text-text-muted text-sm leading-relaxed mb-6">
                                        {selected.description}
                                    </p>

                                    <h4 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-3">
                                        Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selected.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-3 py-1 text-xs rounded-lg bg-surface-light text-text-muted font-mono border border-white/[0.08]"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium border border-accent/20 hover:bg-accent/20 transition-colors">
                                            <Github size={16} /> Source
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light text-text-muted text-sm font-medium border border-white/[0.08] hover:border-white/20 transition-colors">
                                            <ExternalLink size={16} /> Live Demo
                                        </button>
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
