import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Footprints, Globe, BookOpen, Dumbbell } from 'lucide-react';
import SectionHeading from './SectionHeading';

const funFacts = [
    { icon: Footprints, value: 'Avg 12k+ steps/day for the past 2 years' },
    { icon: Globe, value: '15+ cities visited across the world' },
    { icon: BookOpen, value: 'Red Rising series is unmatched' },
    { icon: Dumbbell, value: 'Combined squat/bench/deadlift over 1,000 lbs' },
];

export default function About() {
    return (
        <section id="about" className="w-full">
            <div className="w-full">
                <SectionHeading label="About" title="Who I Am" />

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                    {/* Left: Photo + quick info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:w-[320px] shrink-0"
                    >
                        {/* Headshot with accent border glow */}
                        <div className="relative group/photo mb-6">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-sm opacity-60 group-hover/photo:opacity-100 transition-opacity duration-500" />

                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] bg-surface">
                                <img
                                    src="/headshot.png"
                                    alt="Parthiv Paul"
                                    className="w-full h-full object-cover scale-[1.12] group-hover/photo:scale-[1.18] transition-transform duration-700 ease-out"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-surface-light items-center justify-center hidden">
                                    <div className="text-center">
                                        <span className="text-6xl font-display italic text-accent/60">PP</span>
                                        <p className="text-text-dim text-xs font-mono mt-2">your photo here</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-surface/80 to-transparent" />
                            </div>
                        </div>

                        {/* Quick location & education badges */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5 text-text-muted text-sm">
                                <MapPin size={14} className="text-accent shrink-0" />
                                <span>Toronto, Canada</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-text-muted text-sm">
                                <GraduationCap size={14} className="text-accent shrink-0" />
                                <span>CS Specialist @ University of Toronto</span>
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
                            className="mb-10"
                        >
                            <p className="text-text text-base md:text-lg leading-relaxed mb-5">
                                I'm a <span className="text-accent font-medium">CS Specialist at the University of Toronto</span>. I care more about the problem than the tools, so I end up working on whatever it calls for.
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

                        {/* Fun facts — compact, low-key */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col gap-2 mb-2"
                        >
                            {funFacts.map((fact) => (
                                <div key={fact.value} className="flex items-center gap-2.5 text-text-dim text-sm">
                                    <fact.icon size={13} className="text-accent/50 shrink-0" />
                                    <span>{fact.value}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Activity lives in the dedicated Activity section below */}
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
