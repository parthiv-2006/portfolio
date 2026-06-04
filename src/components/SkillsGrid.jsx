import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
    SiWebauthn,
    SiFastapi,
    SiFramer,
    SiVite,
    SiOpenai,
    SiGoogle,
} from 'react-icons/si';
import { FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { VscDatabase } from 'react-icons/vsc';
import { Brain, Cpu, Zap, Shield, Code2 } from 'lucide-react';
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
    { name: 'FastAPI', icon: SiFastapi, category: 'Frameworks', core: true },
    { name: 'MongoDB', icon: SiMongodb, category: 'Frameworks', core: true },
    { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frameworks', core: true },
    { name: 'Framer Motion', icon: SiFramer, category: 'Frameworks', core: false },
    { name: 'Vite', icon: SiVite, category: 'Frameworks', core: false },
    { name: 'Redux', icon: SiRedux, category: 'Frameworks', core: false },
    { name: 'Zustand', icon: SiReact, category: 'Frameworks', core: false },
    { name: 'LlamaIndex', icon: Brain, category: 'Frameworks', core: false },

    // ── AI Tools ──
    { name: 'Claude Code', icon: Brain, category: 'AI Tools', core: true },
    { name: 'Claude API', icon: Brain, category: 'AI Tools', core: true },
    { name: 'Google Gemini', icon: SiGoogle, category: 'AI Tools', core: true },
    { name: 'Antigravity', icon: SiGoogle, category: 'AI Tools', core: false },
    { name: 'Cursor', icon: Cpu, category: 'AI Tools', core: true },
    { name: 'OpenAI Codex', icon: SiOpenai, category: 'AI Tools', core: false },
    { name: 'VS Code', icon: Code2, category: 'AI Tools', core: false },

    // ── Dev Tools & Concepts ──
    { name: 'Git/GitHub', icon: SiGit, category: 'Dev Tools & Concepts', core: true },
    { name: 'Docker', icon: SiDocker, category: 'Dev Tools & Concepts', core: false },
    { name: 'WebAuthn', icon: SiWebauthn, category: 'Dev Tools & Concepts', core: false },
    { name: 'OAuth 2.0', icon: Shield, category: 'Dev Tools & Concepts', core: false },
    { name: 'SSE', icon: Zap, category: 'Dev Tools & Concepts', core: false },
    { name: 'CI/CD', icon: SiGithubactions, category: 'Dev Tools & Concepts', core: true },
    { name: 'REST APIs', icon: VscDatabase, category: 'Dev Tools & Concepts', core: true },
];

const categories = ['Languages', 'Frameworks', 'AI Tools', 'Dev Tools & Concepts'];

function SkillCard({ skill, index }) {
    const glowControls = useAnimation();
    const Icon = skill.icon;

    const handleHoverStart = () => {
        if (!skill.core) return;
        glowControls.start({
            opacity: [0, 1, 0],
            transition: { duration: 0.8, ease: 'easeInOut' },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.04,
                type: 'spring',
                stiffness: 200,
                damping: 20,
            }}
            whileHover={{
                scale: 1.04,
                transition: { type: 'spring', stiffness: 400, damping: 15 },
            }}
            onHoverStart={handleHoverStart}
            className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors duration-300 cursor-default overflow-hidden
                ${skill.core
                    ? 'bg-surface border-accent/20 hover:border-accent/50'
                    : 'bg-surface border-white/[0.06] hover:border-white/[0.15] hover:bg-surface-light'
                }`}
        >
            {/* Amber glow pulse overlay — core skills only, triggered on hover via animate prop */}
            {skill.core && (
                <motion.div
                    animate={glowControls}
                    initial={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(226,160,78,0.22) 0%, transparent 70%)',
                    }}
                />
            )}

            {/* Core stack indicator dot */}
            {skill.core && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent" />
            )}

            <Icon
                className={`shrink-0 transition-colors duration-300 ${
                    skill.core
                        ? 'text-accent'
                        : 'text-text-dim group-hover:text-text-muted'
                }`}
                size={20}
            />

            <span
                className={`text-sm font-medium transition-colors duration-300 ${
                    skill.core
                        ? 'text-text'
                        : 'text-text-muted group-hover:text-text'
                }`}
            >
                {skill.name}
            </span>
        </motion.div>
    );
}

export default function SkillsGrid() {
    const [activeTab, setActiveTab] = useState('Languages');

    const tabSkills = skills.filter((s) => s.category === activeTab);

    return (
        <section id="skills" className="w-full">
            <div className="w-full">
                <SectionHeading label="Toolkit" title="Skills & Technologies" />

                {/* ── Tab bar ── */}
                <div
                    className="flex overflow-x-auto mb-8 border-b border-white/[0.06]"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`relative flex-shrink-0 px-5 py-3 text-sm font-mono transition-colors duration-200 cursor-pointer ${
                                activeTab === cat
                                    ? 'text-text'
                                    : 'text-text-dim hover:text-text-muted'
                            }`}
                        >
                            {cat}
                            {activeTab === cat && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab content — exit left, enter right ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                    >
                        {tabSkills.map((skill, i) => (
                            <SkillCard key={skill.name} skill={skill} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
