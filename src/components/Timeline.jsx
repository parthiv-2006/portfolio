import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Code2 } from 'lucide-react';
import SectionHeading from './SectionHeading';

const entries = [
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
        icon: Code2,
        title: 'Full-Stack Developer',
        subtitle: 'Freelance & Personal Projects',
        date: '2024 – Present',
        description:
            'Building production-grade full-stack applications with the MERN stack. Focus on clean architecture, responsive design, and intuitive user experiences.',
        type: 'experience',
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
        title: 'Open Source Contributor',
        subtitle: 'Community',
        date: '2023 – Present',
        description:
            'Contributing to open-source projects and building tools that solve real problems for developers worldwide.',
        type: 'experience',
    },
];

export default function Timeline() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end 60%'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="timeline" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <SectionHeading
                    label="Journey"
                    title="Experience & Education"
                    subtitle="Key milestones in my development as a software engineer."
                />

                <div ref={containerRef} className="relative">
                    {/* Background line */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

                    {/* Filling line */}
                    <motion.div
                        className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 w-0.5 bg-accent origin-top"
                        style={{ height: lineHeight }}
                    />

                    <div className="space-y-12">
                        {entries.map((entry, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline node */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                                        <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(0,229,255,0.4)] ring-4 ring-bg" />
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'
                                            }`}
                                    >
                                        <div className="p-5 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm hover:border-border-hover transition-colors duration-300">
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
                                            <p className="text-text-dim text-sm leading-relaxed">
                                                {entry.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Spacer for other side */}
                                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
