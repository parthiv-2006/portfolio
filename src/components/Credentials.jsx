import { motion } from 'framer-motion';
import { Trophy, Medal, Sparkles, BadgeCheck } from 'lucide-react';

const awards = [
    {
        icon: Trophy,
        title: "Dean's List",
        issuer: 'University of Toronto',
        meta: '2024-25 · 2025-26',
        note: 'Awarded in both completed years of the Computer Science Specialist program.',
    },
    {
        icon: Medal,
        title: 'J.S. McLean Scholarship',
        issuer: 'University of Toronto',
        meta: 'Academic excellence',
        note: 'Merit scholarship recognizing sustained academic standing.',
    },
    {
        icon: Sparkles,
        title: '2nd Place, National Financial Literacy Competition',
        issuer: 'Waterloo School of Accounting & Finance',
        meta: '2023',
        note: 'Placed second nationally in the SAF financial literacy competition.',
    },
];

const certifications = [
    { title: 'Claude Code in Action', issuer: 'Anthropic' },
    { title: 'Building with the Claude API', issuer: 'Anthropic' },
    { title: 'AI Agents Intensive Course', issuer: 'Google & Kaggle' },
    { title: 'ChatGPT Prompt Engineering for Developers', issuer: 'DeepLearning.AI' },
];

export default function Credentials() {
    return (
        <div className="w-full mt-24">
            {/* Sub-heading — lighter than a full SectionHeading, stays inside #journey */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8"
            >
                <p className="font-mono text-xs tracking-[0.28em] uppercase text-accent mb-3">
                    Recognition
                </p>
                <h3
                    className="font-display text-text leading-[1.05] tracking-tight"
                    style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontStyle: 'italic' }}
                >
                    Awards &amp; certifications<span className="text-accent">.</span>
                </h3>
            </motion.div>

            {/* ── Awards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-10">
                {awards.map((award, i) => {
                    const Icon = award.icon;
                    return (
                        <motion.div
                            key={award.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex flex-col border border-white/[0.06] rounded-2xl bg-surface p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/35"
                        >
                            {/* Warm corner wash on hover */}
                            <span
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background:
                                        'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(226,160,78,0.10) 0%, transparent 70%)',
                                }}
                                aria-hidden="true"
                            />

                            <div className="relative z-[1] flex items-center justify-between gap-3 mb-4">
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/20">
                                    <Icon size={16} className="text-accent" />
                                </span>
                                <span className="font-mono text-[11px] text-text-dim text-right">
                                    {award.meta}
                                </span>
                            </div>

                            <h4 className="relative z-[1] text-[15px] font-semibold text-text leading-snug mb-1">
                                {award.title}
                            </h4>
                            <p className="relative z-[1] text-[13px] text-accent mb-3">{award.issuer}</p>
                            <p className="relative z-[1] text-[13px] text-text-muted leading-relaxed mt-auto">
                                {award.note}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Certifications ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="border border-white/[0.06] rounded-2xl bg-surface/60 p-5 sm:p-6"
            >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim mb-4">
                    Certifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {certifications.map((cert) => (
                        <div
                            key={cert.title}
                            className="group flex items-start gap-3 py-1.5 border-b border-white/[0.04] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                        >
                            <BadgeCheck
                                size={15}
                                className="text-accent shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="min-w-0">
                                <p className="text-[13.5px] text-text leading-snug">{cert.title}</p>
                                <p className="font-mono text-[11px] text-text-dim mt-0.5">{cert.issuer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
