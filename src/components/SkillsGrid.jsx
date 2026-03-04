import { motion } from 'framer-motion';
import {
    Database,
    Server,
    Code2,
    Hexagon,
    BrainCircuit,
    Layers,
    Globe,
    GitBranch,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import BentoItem from './BentoItem';

const skills = [
    {
        name: 'React / MERN Stack',
        icon: Code2,
        desc: 'Component-driven UIs with hooks, context, and state management. Full MERN pipeline from database to deploy.',
        span: 'md:col-span-2 lg:col-span-2 md:row-span-2',
        accent: true,
        large: true,
    },
    {
        name: 'Python',
        icon: BrainCircuit,
        desc: 'Scripting, automation, and data work.',
        span: '',
    },
    {
        name: 'DSA',
        icon: Layers,
        desc: 'Advanced problem solving & competitive patterns.',
        span: '',
    },
    {
        name: 'Node.js',
        icon: Hexagon,
        desc: 'Scalable server-side apps, event-driven architecture, and REST APIs.',
        span: 'md:col-span-2 lg:col-span-2',
    },
    {
        name: 'Express',
        icon: Server,
        desc: 'Middleware, auth, and API routing.',
        span: '',
    },
    {
        name: 'MongoDB',
        icon: Database,
        desc: 'NoSQL design and aggregation.',
        span: '',
    },
    {
        name: 'Full Stack',
        icon: Globe,
        desc: 'End-to-end application development, deployment, and CI/CD.',
        span: 'md:col-span-2 lg:col-span-2',
    },
    {
        name: 'Git & CI/CD',
        icon: GitBranch,
        desc: 'Version control, branching strategies, and automated pipelines.',
        span: 'md:col-span-2 lg:col-span-3',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

export default function SkillsGrid() {
    return (
        <section id="skills" className="py-32 w-full">
            <div className="w-full">
                <SectionHeading
                    label="Toolkit"
                    title="Skills & Technologies"
                    subtitle="The core technologies I use to build robust, scalable applications."
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {skills.map((skill) => (
                        <BentoItem
                            key={skill.name}
                            className={`${skill.span} w-full h-full ${skill.accent ? 'border-l-2 border-l-accent/60' : ''}`}
                            delay={0}
                            isStaggerChild
                        >
                            <div className={`flex ${skill.large ? 'flex-col gap-5 h-full' : 'items-start gap-4'}`}>
                                <div className="relative">
                                    <div
                                        className={`shrink-0 ${skill.large ? 'p-4' : 'p-2.5'} rounded-xl ${skill.accent
                                            ? 'bg-accent/10 text-accent'
                                            : 'bg-surface-light text-text-muted'
                                            }`}
                                    >
                                        <skill.icon size={skill.large ? 32 : 20} />
                                    </div>
                                    {/* Glow behind hero card icon */}
                                    {skill.accent && (
                                        <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl -z-10" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-text ${skill.large ? 'text-xl mb-2' : 'text-sm mb-1'}`}>
                                        {skill.name}
                                    </h3>
                                    <p className={`text-text-dim leading-relaxed ${skill.large ? 'text-sm' : 'text-xs'}`}>
                                        {skill.desc}
                                    </p>
                                </div>
                            </div>
                        </BentoItem>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
