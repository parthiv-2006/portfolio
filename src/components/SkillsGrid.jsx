import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const skillGroups = [
    {
        category: 'Languages',
        items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C'],
    },
    {
        category: 'Frameworks',
        items: ['React', 'Node.js', 'Express', 'Next.js'],
    },
    {
        category: 'Data',
        items: ['MongoDB', 'PostgreSQL', 'Firebase'],
    },
    {
        category: 'Tools',
        items: ['Git', 'Docker', 'Linux', 'CI/CD'],
    },
];

export default function SkillsGrid() {
    return (
        <section id="skills" className="w-full">
            <div className="w-full">
                <SectionHeading
                    label="Toolkit"
                    title="Skills & Technologies"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
                    {skillGroups.map((group, groupIndex) => (
                        <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{
                                duration: 0.5,
                                delay: groupIndex * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <h3 className="font-mono text-accent text-xs tracking-[0.15em] uppercase mb-4">
                                {group.category}
                            </h3>
                            <ul className="space-y-2">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="text-text text-[15px] leading-relaxed flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-text-dim shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
