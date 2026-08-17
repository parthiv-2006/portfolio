import { useState, useRef, useId } from 'react';
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
    SiDart,
    SiFlutter,
    SiSupabase,
    SiStripe,
    SiJira,
    SiAnthropic,
    SiPytest,
} from 'react-icons/si';
import { FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { VscDatabase } from 'react-icons/vsc';
import { Brain, Cpu, Zap, Shield, Code2, Plug, Search, KeyRound } from 'lucide-react';
import SectionHeading from './SectionHeading';

const skills = [
    // ── Languages ──
    { name: 'Python', icon: SiPython, category: 'Languages', core: true },
    { name: 'JavaScript', icon: SiJavascript, category: 'Languages', core: true },
    { name: 'TypeScript', icon: SiTypescript, category: 'Languages', core: true },
    { name: 'Dart', icon: SiDart, category: 'Languages', core: false },
    { name: 'Java', icon: FaJava, category: 'Languages', core: false },
    { name: 'C/C++', icon: SiCplusplus, category: 'Languages', core: false },
    { name: 'SQL', icon: VscDatabase, category: 'Languages', core: false },
    { name: 'HTML', icon: FaHtml5, category: 'Languages', core: false },
    { name: 'CSS', icon: FaCss3Alt, category: 'Languages', core: false },

    // ── Frameworks ──
    { name: 'Next.js', icon: SiNextdotjs, category: 'Frameworks', core: true },
    { name: 'React', icon: SiReact, category: 'Frameworks', core: true },
    { name: 'Node.js', icon: SiNodedotjs, category: 'Frameworks', core: true },
    { name: 'FastAPI', icon: SiFastapi, category: 'Frameworks', core: true },
    { name: 'Express.js', icon: SiExpress, category: 'Frameworks', core: false },
    { name: 'Flutter', icon: SiFlutter, category: 'Frameworks', core: true },
    { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frameworks', core: true },
    { name: 'LlamaIndex', icon: Brain, category: 'Frameworks', core: false },
    { name: 'Zustand', icon: SiReact, category: 'Frameworks', core: false },
    { name: 'Redux', icon: SiRedux, category: 'Frameworks', core: false },
    { name: 'Framer Motion', icon: SiFramer, category: 'Frameworks', core: false },
    { name: 'Vite', icon: SiVite, category: 'Frameworks', core: false },
    { name: 'pytest', icon: SiPytest, category: 'Frameworks', core: false },

    // ── AI Tools ──
    { name: 'Claude Code', icon: SiAnthropic, category: 'AI Tools', core: true },
    { name: 'Claude API', icon: SiAnthropic, category: 'AI Tools', core: true },
    { name: 'Model Context Protocol', icon: Plug, category: 'AI Tools', core: true },
    { name: 'RAG', icon: Search, category: 'AI Tools', core: true },
    { name: 'Google Gemini', icon: SiGoogle, category: 'AI Tools', core: true },
    { name: 'Cursor', icon: Cpu, category: 'AI Tools', core: true },
    { name: 'Antigravity', icon: SiGoogle, category: 'AI Tools', core: false },
    { name: 'OpenAI Codex', icon: SiOpenai, category: 'AI Tools', core: false },
    { name: 'VS Code', icon: Code2, category: 'AI Tools', core: false },

    // ── Dev Tools & Concepts ──
    { name: 'Git/GitHub', icon: SiGit, category: 'Dev Tools & Concepts', core: true },
    { name: 'PostgreSQL', icon: SiPostgresql, category: 'Dev Tools & Concepts', core: true },
    { name: 'Supabase', icon: SiSupabase, category: 'Dev Tools & Concepts', core: true },
    { name: 'REST APIs', icon: VscDatabase, category: 'Dev Tools & Concepts', core: true },
    { name: 'CI/CD', icon: SiGithubactions, category: 'Dev Tools & Concepts', core: true },
    { name: 'Docker', icon: SiDocker, category: 'Dev Tools & Concepts', core: false },
    { name: 'Stripe', icon: SiStripe, category: 'Dev Tools & Concepts', core: false },
    { name: 'MongoDB', icon: SiMongodb, category: 'Dev Tools & Concepts', core: false },
    { name: 'OAuth 2.0 / OIDC', icon: Shield, category: 'Dev Tools & Concepts', core: false },
    { name: 'WebAuthn', icon: SiWebauthn, category: 'Dev Tools & Concepts', core: false },
    { name: 'Zitadel', icon: KeyRound, category: 'Dev Tools & Concepts', core: false },
    { name: 'SSE', icon: Zap, category: 'Dev Tools & Concepts', core: false },
    { name: 'Jira', icon: SiJira, category: 'Dev Tools & Concepts', core: false },
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
        <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                // Capped so a long category (Frameworks has 13) still finishes fast.
                delay: Math.min(index, 10) * 0.035,
                type: 'spring',
                stiffness: 200,
                damping: 20,
            }}
            whileHover={{
                scale: 1.04,
                transition: { type: 'spring', stiffness: 400, damping: 15 },
            }}
            onHoverStart={handleHoverStart}
            className={`group relative flex items-center gap-2.5 sm:gap-3 px-3 py-3 sm:px-4 sm:py-3.5 rounded-xl border transition-colors duration-300 cursor-default overflow-hidden
                ${skill.core
                    ? 'bg-surface border-accent/20 hover:border-accent/50 hover:bg-surface-light'
                    : 'bg-surface border-white/[0.06] hover:border-white/[0.15] hover:bg-surface-light'
                }`}
        >
            {/* Amber glow pulse overlay — core skills only, triggered on hover via animate prop */}
            {skill.core && (
                <motion.div
                    animate={glowControls}
                    initial={{ opacity: 0 }}
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, var(--color-accent-dim) 0%, transparent 70%)',
                    }}
                />
            )}

            {/* Core stack indicator dot — the legend above the grid explains it
                visually; the sr-only text carries the same meaning non-visually. */}
            {skill.core && (
                <>
                    <span
                        aria-hidden="true"
                        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent"
                    />
                    <span className="sr-only">Core stack:</span>
                </>
            )}

            <Icon
                aria-hidden="true"
                focusable="false"
                className={`shrink-0 transition-colors duration-300 ${
                    skill.core
                        ? 'text-accent'
                        : 'text-text-dim group-hover:text-text-muted'
                }`}
                size={20}
            />

            <span
                className={`min-w-0 break-words text-[13px] sm:text-sm font-medium leading-tight transition-colors duration-300 ${
                    skill.core
                        ? 'text-text'
                        : 'text-text-muted group-hover:text-text'
                }`}
            >
                {skill.name}
            </span>
        </motion.li>
    );
}

export default function SkillsGrid() {
    const [activeTab, setActiveTab] = useState('Languages');
    const tabRefs = useRef([]);
    const uid = useId();

    const tabSkills = skills.filter((s) => s.category === activeTab);
    const coreCount = tabSkills.filter((s) => s.core).length;

    const tabId = (cat) => `${uid}-tab-${cat.replace(/\W+/g, '-')}`;
    const panelId = (cat) => `${uid}-panel-${cat.replace(/\W+/g, '-')}`;

    // Arrow/Home/End move between tabs, per the ARIA tabs pattern. Without this
    // the roving tabindex below would leave the other tabs unreachable.
    const handleTabKeyDown = (e) => {
        const current = categories.indexOf(activeTab);
        let next = null;
        if (e.key === 'ArrowRight') next = (current + 1) % categories.length;
        else if (e.key === 'ArrowLeft') next = (current - 1 + categories.length) % categories.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = categories.length - 1;
        if (next === null) return;

        e.preventDefault();
        setActiveTab(categories[next]);
        tabRefs.current[next]?.focus();
    };

    return (
        <section id="skills" className="w-full">
            <div className="w-full">
                <SectionHeading label="Toolkit" title="What I work with" />

                {/* ── Tab bar ── */}
                <div
                    role="tablist"
                    aria-label="Skill categories"
                    onKeyDown={handleTabKeyDown}
                    className="flex overflow-x-auto mb-4 border-b border-white/[0.06]"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {categories.map((cat, i) => {
                        const isActive = activeTab === cat;
                        const count = skills.filter((s) => s.category === cat).length;
                        return (
                            <button
                                key={cat}
                                ref={(el) => { tabRefs.current[i] = el; }}
                                type="button"
                                role="tab"
                                id={tabId(cat)}
                                aria-selected={isActive}
                                aria-controls={panelId(cat)}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => setActiveTab(cat)}
                                className={`relative flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-mono transition-colors duration-200 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded-t ${
                                    isActive
                                        ? 'text-text'
                                        : 'text-text-dim hover:text-text-muted'
                                }`}
                            >
                                {cat}
                                <span
                                    aria-hidden="true"
                                    className={`font-mono text-[10px] tabular-nums transition-colors duration-200 ${
                                        isActive ? 'text-accent' : 'text-text-dim/70'
                                    }`}
                                >
                                    {count}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend for the amber dot — carries the meaning without a hover-only tooltip */}
                <p className="flex items-center gap-2 mb-6 font-mono text-[11px] tracking-[0.1em] uppercase text-text-dim">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    Core stack · {coreCount} of {tabSkills.length} in {activeTab}
                </p>

                {/* ── Tab content — exit left, enter right ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        role="tabpanel"
                        id={panelId(activeTab)}
                        aria-labelledby={tabId(activeTab)}
                        tabIndex={0}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="rounded-xl"
                    >
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                            {tabSkills.map((skill, i) => (
                                <SkillCard key={skill.name} skill={skill} index={i} />
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
