import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Coffee, Code2, Gamepad2, Music } from 'lucide-react';
import SectionHeading from './SectionHeading';

const funFacts = [
    { icon: Coffee, label: 'Fueled by', value: 'Cold Brew & Lo-fi' },
    { icon: Code2, label: 'First language', value: 'Python (age 14)' },
    { icon: Gamepad2, label: 'Side quest', value: 'Game dev with Unity' },
    { icon: Music, label: 'Coding playlist', value: 'Synthwave & Jazz' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: 0.2 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

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
                            {/* Glow ring behind photo */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-sm opacity-60 group-hover/photo:opacity-100 transition-opacity duration-500" />

                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] bg-surface">
                                {/* Placeholder headshot — replace /headshot.jpg with your real photo */}
                                <img
                                    src="/headshot.jpg"
                                    alt="Parthiv Paul"
                                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700 ease-out"
                                    onError={(e) => {
                                        // Fallback to gradient avatar if image not found
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                {/* Fallback avatar */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-surface-light items-center justify-center hidden"
                                >
                                    <div className="text-center">
                                        <span className="text-6xl font-display italic text-accent/60">PP</span>
                                        <p className="text-text-dim text-xs font-mono mt-2">your photo here</p>
                                    </div>
                                </div>

                                {/* Gradient overlay at bottom */}
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

                    {/* Right: Story + fun facts */}
                    <div className="flex-1 min-w-0">
                        {/* The story */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-10"
                        >
                            <p className="text-text text-base md:text-lg leading-relaxed mb-5">
                                I got into programming when I was 14 — built a janky Python calculator and
                                thought I was basically a hacker. That spark turned into an obsession with
                                building things that{' '}
                                <span className="text-accent font-medium">actually work</span> and{' '}
                                <span className="text-accent font-medium">feel good to use</span>.
                            </p>
                            <p className="text-text-muted text-base leading-relaxed mb-5">
                                Now I'm a Computer Science Specialist at the University of Toronto,
                                where I've been lucky enough to dive deep into algorithms, systems design,
                                and the stuff that makes software tick under the hood. But what really
                                gets me going is the intersection of{' '}
                                <em className="text-text not-italic font-medium">engineering and design</em>
                                {' '}— making complex systems feel effortless.
                            </p>
                            <p className="text-text-muted text-base leading-relaxed">
                                When I'm not coding, you'll find me exploring new coffee spots around
                                Toronto, tinkering with game dev side projects, or dissecting the UI of
                                apps I admire. I believe the best software is built by people who care
                                about every pixel <em>and</em> every millisecond.
                            </p>
                        </motion.div>

                        {/* Fun facts grid */}
                        <div>
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-4"
                            >
                                Quick Facts
                            </motion.h3>
                            <div className="grid grid-cols-2 gap-3">
                                {funFacts.map((fact, i) => (
                                    <motion.div
                                        key={fact.label}
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        className="group/fact rounded-xl border border-white/[0.06] bg-surface/40 p-4 hover:border-accent/20 hover:bg-surface transition-all duration-300"
                                    >
                                        <fact.icon
                                            size={16}
                                            className="text-accent mb-2 group-hover/fact:scale-110 transition-transform duration-300"
                                        />
                                        <p className="text-text-dim text-[10px] font-mono uppercase tracking-wider mb-0.5">
                                            {fact.label}
                                        </p>
                                        <p className="text-text text-sm font-medium">
                                            {fact.value}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
