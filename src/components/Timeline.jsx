import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Rocket } from 'lucide-react';
import SectionHeading from './SectionHeading';

const entries = [
    {
        icon: Rocket,
        title: 'Rocket Innovation Studio',
        subtitle: 'Incoming Software Engineer Intern',
        date: 'Summer 2026',
        description:
            'Joining Rocket Innovation Studio as a Software Engineer Intern to build scalable products and contribute to innovative engineering initiatives.',
        type: 'experience',
    },
    {
        icon: GraduationCap,
        title: 'University of Toronto, St. George',
        subtitle: "Dean's List Scholar",
        date: '2024 – 2025',
        description:
            'Computer Science Specialist program. Recognized on the Dean\'s List for academic excellence. Coursework includes advanced algorithms, systems programming, and software engineering.',
        type: 'education',
    },
    {
        icon: Award,
        title: 'UofTHacks Participant',
        subtitle: 'Hackathon',
        date: '2024',
        description:
            'Designed and developed an innovative solution in 36 hours. Collaborated with a cross-functional team under extreme time pressure.',
        type: 'achievement',
    },
    {
        icon: Briefcase,
        title: 'Full-Stack Developer',
        subtitle: 'Freelance & Personal Projects',
        date: '2024 – Present',
        description:
            'Building production-grade full-stack applications with the MERN stack. Focus on clean architecture, responsive design, and intuitive user experiences.',
        type: 'experience',
    },
];

/* Clip-path reveal: card expands from the timeline dot outward */
const cardVariants = {
    hidden: (isLeft) => ({
        opacity: 0,
        clipPath: isLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
    }),
    visible: {
        opacity: 1,
        clipPath: 'inset(0 0 0 0)',
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.15,
        },
    },
};

export default function Timeline() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end 60%'],
    });
    const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section id="timeline" className="w-full">
            <div className="max-w-5xl mx-auto w-full">
                <SectionHeading
                    label="Journey"
                    title="Experience & Education"
                    subtitle="Key milestones in my development as a software engineer."
                />

                <div ref={containerRef} className="relative w-full">
                    {/* Background line */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-white/[0.06]" />

                    {/* Typewriter line — draws itself downward */}
                    <motion.div
                        className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-accent origin-top"
                        style={{ scaleY: lineScale }}
                    />

                    <div className="space-y-12">
                        {entries.map((entry, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={i}
                                    className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline node */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 15,
                                                delay: 0.1 + i * 0.1,
                                            }}
                                            className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(0,229,255,0.4)] ring-4 ring-bg"
                                        />
                                    </div>

                                    {/* Content — clip-path reveal from the timeline dot */}
                                    <motion.div
                                        custom={isLeft}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-60px' }}
                                        className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'
                                            }`}
                                    >
                                        <div className="p-5 rounded-2xl border border-white/[0.08] bg-surface/60 backdrop-blur-sm shadow-lg shadow-black/20 hover:border-white/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
                                            <div
                                                className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''
                                                    }`}
                                            >
                                                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                                    <entry.icon size={18} />
                                                </div>
                                                <span className="text-xs font-mono text-accent tracking-wider">
                                                    {entry.date}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-text text-base mb-1">
                                                {entry.title}
                                            </h3>
                                            <p className="text-accent text-xs font-medium mb-2">
                                                {entry.subtitle}
                                            </p>
                                            <p className="text-text-muted text-sm leading-relaxed">
                                                {entry.description}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Spacer for other side */}
                                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
