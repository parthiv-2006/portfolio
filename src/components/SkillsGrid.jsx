import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { skills, skillCategories as categories } from '../data/skills';
import { usageCountForSkill } from '../lib/skillLinks';

function SkillCard({ skill, index, isActive, onToggle }) {
    const Icon = skill.icon;
    const usedCount = usageCountForSkill(skill.name);

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
        >
            <motion.button
                type="button"
                aria-pressed={isActive}
                aria-label={
                    usedCount > 0
                        ? `${skill.name} — used in ${usedCount} role${usedCount === 1 ? '' : 's'}. ${isActive ? 'Selected — click to clear filter.' : 'Click to filter Journey.'}`
                        : skill.name
                }
                onClick={() => onToggle(skill.name)}
                whileHover={{
                    scale: 1.04,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
                className={`group relative flex w-full items-center gap-2.5 sm:gap-3 px-3 py-3 sm:px-4 sm:py-3.5 rounded-xl border transition-colors duration-300 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                    ${isActive
                        ? 'bg-surface-light border-accent shadow-[0_0_0_1px_var(--color-accent)]'
                        : 'bg-surface border-white/[0.06] hover:border-white/[0.15] hover:bg-surface-light'
                    }`}
            >
                <Icon
                    aria-hidden="true"
                    focusable="false"
                    className="shrink-0 text-accent"
                    size={20}
                />

                <span className="min-w-0 flex-1">
                    <span className="block break-words text-[13px] sm:text-sm font-medium leading-tight text-text transition-colors duration-300 group-hover:text-accent">
                        {skill.name}
                    </span>
                    {usedCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="mt-0.5 block font-mono text-[10px] tracking-[0.06em] text-text-dim"
                        >
                            used in {usedCount} role{usedCount === 1 ? '' : 's'}
                        </span>
                    )}
                </span>
            </motion.button>
        </motion.li>
    );
}

export default function SkillsGrid({ activeSkill = null, onSelectSkill = () => {} } = {}) {
    const [activeTab, setActiveTab] = useState('Languages');
    const tabRefs = useRef([]);
    const uid = useId();

    const tabSkills = skills.filter((s) => s.category === activeTab);

    const tabId = (cat) => `${uid}-tab-${cat.replace(/\W+/g, '-')}`;
    const panelId = (cat) => `${uid}-panel-${cat.replace(/\W+/g, '-')}`;

    const handleToggleSkill = (name) => {
        const turningOn = activeSkill !== name;
        onSelectSkill(turningOn ? name : null);
        // Only jump on select — clearing should leave the visitor where they are.
        if (turningOn && usageCountForSkill(name) > 0) {
            document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

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
                                <SkillCard
                                    key={skill.name}
                                    skill={skill}
                                    index={i}
                                    isActive={activeSkill === skill.name}
                                    onToggle={handleToggleSkill}
                                />
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
