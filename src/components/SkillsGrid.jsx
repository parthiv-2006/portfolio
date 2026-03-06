import { motion } from 'framer-motion';
import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiCplusplus,
    SiReact,
    SiNodedotjs,
    SiExpress,
    SiNextdotjs,
    SiMongodb,
    SiPostgresql,
    SiRedux,
    SiTailwindcss,
    SiGit,
    SiDocker,
    SiGithubactions,
    SiWebauthn
} from 'react-icons/si';
import { FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { VscDatabase } from 'react-icons/vsc';
import SectionHeading from './SectionHeading';

const skills = [
    // ── Languages ──
    { name: 'Python', icon: SiPython, category: 'Languages', core: true },
    { name: 'JavaScript', icon: SiJavascript, category: 'Languages', core: true },
    { name: 'TypeScript', icon: SiTypescript, category: 'Languages', core: true },
    { name: 'Java', icon: FaJava, category: 'Languages', core: false },
    { name: 'C/C++', icon: SiCplusplus, category: 'Languages', core: false },
    { name: 'HTML', icon: FaHtml5, category: 'Languages', core: false },
    { name: 'CSS', icon: FaCss3Alt, category: 'Languages', core: false },
    { name: 'SQL', icon: VscDatabase, category: 'Languages', core: false },

    // ── Frameworks ──
    { name: 'Next.js', icon: SiNextdotjs, category: 'Frameworks', core: true },
    { name: 'React', icon: SiReact, category: 'Frameworks', core: true },
    { name: 'Node.js', icon: SiNodedotjs, category: 'Frameworks', core: true },
    { name: 'Express.js', icon: SiExpress, category: 'Frameworks', core: false },
    { name: 'MongoDB', icon: SiMongodb, category: 'Frameworks', core: true },
    { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frameworks', core: true },
    { name: 'Redux', icon: SiRedux, category: 'Frameworks', core: false },
    // Using a generic icon for Zustand as react-icons doesn't have one specifically usually
    { name: 'Zustand', icon: SiReact, category: 'Frameworks', core: false },

    // ── Dev Tools & Concepts ──
    { name: 'Git/GitHub', icon: SiGit, category: 'Dev Tools & Concepts', core: true },
    { name: 'Docker', icon: SiDocker, category: 'Dev Tools & Concepts', core: false },
    { name: 'WebAuthn', icon: SiWebauthn, category: 'Dev Tools & Concepts', core: false },
    { name: 'CI/CD', icon: SiGithubactions, category: 'Dev Tools & Concepts', core: true },
    { name: 'REST APIs', icon: VscDatabase, category: 'Dev Tools & Concepts', core: true },
];

const categories = ['Languages', 'Frameworks', 'Dev Tools & Concepts'];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
        },
    },
};

export default function SkillsGrid() {
    return (
        <section id="skills" className="w-full">
            <div className="w-full">
                <SectionHeading
                    label="Toolkit"
                    title="Skills & Technologies"
                />

                <div className="space-y-12">
                    {categories.map((category, catIndex) => {
                        const categorySkills = skills.filter(
                            (s) => s.category === category
                        );

                        return (
                            <div key={category}>
                                <motion.h3
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{
                                        duration: 0.4,
                                        delay: catIndex * 0.08,
                                    }}
                                    className="font-mono text-accent text-xs tracking-[0.15em] uppercase mb-5"
                                >
                                    {category}
                                </motion.h3>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-40px' }}
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                                >
                                    {categorySkills.map((skill) => {
                                        const Icon = skill.icon;
                                        return (
                                            <motion.div
                                                key={skill.name}
                                                variants={cardVariants}
                                                whileHover={{
                                                    scale: 1.04,
                                                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                                                }}
                                                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 cursor-default
                                                    ${skill.core
                                                        ? 'bg-surface border-accent/20 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(226,160,78,0.1)]'
                                                        : 'bg-surface border-white/[0.06] hover:border-white/[0.15] hover:bg-surface-light'
                                                    }`}
                                            >
                                                {/* Core stack indicator dot */}
                                                {skill.core && (
                                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent" />
                                                )}

                                                <Icon
                                                    className={`shrink-0 transition-colors duration-300
                                                        ${skill.core
                                                            ? 'text-accent group-hover:text-accent'
                                                            : 'text-text-dim group-hover:text-text-muted'
                                                        }`}
                                                    size={20}
                                                />

                                                <span
                                                    className={`text-sm font-medium transition-colors duration-300
                                                        ${skill.core
                                                            ? 'text-text group-hover:text-text'
                                                            : 'text-text-muted group-hover:text-text'
                                                        }`}
                                                >
                                                    {skill.name}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
