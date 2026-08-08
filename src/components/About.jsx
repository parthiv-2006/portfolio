import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Briefcase } from 'lucide-react';
import SectionHeading from './SectionHeading';

export default function About() {
    return (
        <section id="about" className="w-full">
            <div className="w-full">
                <SectionHeading label="About" title="Who I Am" />

                {/* Byline: name mark + quick facts, no boxed frame */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-10 pb-8 border-b border-white/[0.06]"
                >
                    <span className="font-display italic text-accent leading-none text-3xl sm:text-4xl">
                        P.
                    </span>
                    <span className="hidden sm:block w-px h-6 bg-white/[0.08]" />
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <MapPin size={14} className="text-accent shrink-0" />
                        <span>Toronto, Canada</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <GraduationCap size={14} className="text-accent shrink-0" />
                        <span>CS Specialist @ University of Toronto</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Briefcase size={14} className="text-accent shrink-0" />
                        <span>Software Engineer @ Velox Systems</span>
                    </div>
                </motion.div>

                {/* Story + facts */}
                <div className="relative max-w-[720px]">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute -top-6 -left-1 sm:-top-10 sm:-left-6 font-display text-accent/[0.09] leading-none"
                        style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                    >
                        &ldquo;
                    </span>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative mb-10"
                    >
                        <p className="font-display italic text-text leading-snug mb-6" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)' }}>
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
                        className="relative inline-flex items-center gap-2 px-4 py-3 border border-white/[0.06] rounded-xl bg-surface font-mono text-xs text-text-muted hover:border-accent/40 hover:text-text transition-all duration-250"
                    >
                        <span className="text-accent">✦</span>
                        fun facts live in the terminal · run <span className="text-accent ml-1">facts</span> ↓
                    </a>
                </div>
            </div>
        </section>
    );
}
