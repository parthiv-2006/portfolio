import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Briefcase } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function About() {
    return (
        <section id="about" className="w-full">
            <div className="w-full">
                <SectionHeading label="About" title="Who I Am" />

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                    {/* Left: Monogram card + quick info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-[320px] shrink-0 lg:sticky lg:top-28"
                    >
                        {/* Monogram card with accent border glow */}
                        <div className="relative group/card mb-6">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-sm opacity-60 group-hover/card:opacity-100 transition-opacity duration-500" />

                            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-surface px-8 py-12 flex flex-col items-center text-center">
                                {/* Ambient corner glow */}
                                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

                                {/* Faint concentric ring behind the monogram */}
                                <div className="absolute w-36 h-36 rounded-full border border-accent/10" />
                                <div className="absolute w-28 h-28 rounded-full border border-accent/10" />

                                <span
                                    className="relative font-display italic text-accent leading-none"
                                    style={{ fontSize: 'clamp(3.4rem, 7vw, 4.6rem)' }}
                                >
                                    PP
                                </span>
                                <span className="relative mt-4 h-px w-10 bg-accent/40" />
                                <span className="relative mt-4 font-mono text-[11px] tracking-[0.28em] uppercase text-text-dim">
                                    Parthiv Paul
                                </span>
                            </div>
                        </div>

                        {/* Quick location & education badges */}
                        <div className="rounded-2xl border border-white/[0.08] bg-surface divide-y divide-white/[0.06]">
                            <div className="flex items-center gap-2.5 text-text-muted text-sm px-4 py-3">
                                <MapPin size={14} className="text-accent shrink-0" />
                                <span>Toronto, Canada</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-text-muted text-sm px-4 py-3">
                                <GraduationCap size={14} className="text-accent shrink-0" />
                                <span>CS Specialist @ University of Toronto</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-text-muted text-sm px-4 py-3">
                                <Briefcase size={14} className="text-accent shrink-0" />
                                <span>Software Engineer @ Velox Systems</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Story + facts */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-10 border-l-2 border-accent/20 pl-6 md:pl-8"
                        >
                            <p className="font-display italic text-text leading-snug mb-6" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.75rem)' }}>
                                I'm a <span className="text-accent">CS Specialist at the University of Toronto</span>. I care more about the problem than the tools, so I end up working on whatever it calls for.
                            </p>
                            <p className="text-text-muted text-base leading-relaxed mb-5">
                                Right now I'm a <span className="text-accent font-medium">software engineer at Velox Systems</span>, rebuilding a contractor's production workspace on FastAPI and Postgres. Before that I shipped a Stripe subscription system at Applied Optimal, a Stripe MCP server at GenLedge, and RAG pipelines at Outamation.
                            </p>
                            <p className="text-text-muted text-base leading-relaxed mb-5">
                                Looking for software engineering internships for{' '}
                                <span className="text-accent font-medium">Fall 2026</span> and{' '}
                                <span className="text-accent font-medium">Winter 2027</span>.
                                If you're building something worth working on, I'm open to a conversation.
                            </p>
                            <p className="text-text-muted text-base leading-relaxed">
                                Outside of code, I travel whenever I can, I'm really into fitness and hiking, play guitar, and read more than I probably should.
                            </p>
                        </motion.div>

                        <a
                            href="#lab"
                            onClick={(e) => { e.preventDefault(); document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="inline-flex items-center gap-2 px-4 py-3 border border-white/[0.06] rounded-xl bg-surface font-mono text-xs text-text-muted hover:border-accent/40 hover:text-text transition-all duration-250"
                        >
                            <span className="text-accent">✦</span>
                            fun facts live in the terminal · run <span className="text-accent ml-1">facts</span> ↓
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
