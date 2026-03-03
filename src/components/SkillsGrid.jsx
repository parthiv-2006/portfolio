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
        name: 'React',
        icon: Code2,
        desc: 'Component-driven UIs with hooks, context, and state management.',
        span: 'md:col-span-2',
        accent: true,
    },
    {
        name: 'Node.js',
        icon: Hexagon,
        desc: 'Scalable server-side applications and REST APIs.',
        span: '',
    },
    {
        name: 'MongoDB',
        icon: Database,
        desc: 'NoSQL database design, aggregation pipelines, indexing.',
        span: '',
    },
    {
        name: 'Express',
        icon: Server,
        desc: 'RESTful API architecture with middleware and auth.',
        span: 'md:col-span-2',
    },
    {
        name: 'Python',
        icon: BrainCircuit,
        desc: 'Data structures, algorithms, scripting, and automation.',
        span: '',
    },
    {
        name: 'DSA',
        icon: Layers,
        desc: 'Advanced data structures & algorithms problem solving.',
        span: '',
    },
    {
        name: 'Full Stack',
        icon: Globe,
        desc: 'End-to-end application development and deployment.',
        span: 'md:col-span-2',
    },
    {
        name: 'Git & CI/CD',
        icon: GitBranch,
        desc: 'Version control, branching strategies, and pipelines.',
        span: '',
    },
];

export default function SkillsGrid() {
    return (
        <section id="skills" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <SectionHeading
                    label="Toolkit"
                    title="Skills & Technologies"
                    subtitle="The core technologies I use to build robust, scalable applications."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {skills.map((skill, i) => (
                        <BentoItem
                            key={skill.name}
                            className={skill.span}
                            delay={i * 0.05}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`p-2.5 rounded-xl ${skill.accent
                                            ? 'bg-accent/10 text-accent'
                                            : 'bg-surface-light text-text-muted'
                                        }`}
                                >
                                    <skill.icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text text-sm mb-1">{skill.name}</h3>
                                    <p className="text-text-dim text-xs leading-relaxed">{skill.desc}</p>
                                </div>
                            </div>
                        </BentoItem>
                    ))}
                </div>
            </div>
        </section>
    );
}
