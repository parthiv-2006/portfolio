import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsGrid from './components/SkillsGrid';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Terminal from './components/Terminal';

export default function App() {
    return (
        <div className="min-h-screen bg-bg text-text">
            <Navbar />
            <main>
                <Hero />
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <SkillsGrid />
                    <Projects />
                    <Timeline />
                    <Terminal />
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 border-t border-white/[0.06] py-10 px-6">
                <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
                    <span className="text-text-dim text-sm">
                        © {new Date().getFullYear()} Parthiv Paul. Built with React & Framer Motion.
                    </span>
                    <div className="flex items-center gap-6 flex-wrap">
                        <a
                            href="https://github.com/parthiv-2006"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-dim text-sm hover:text-accent transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com/in/parthiv-paul"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-dim text-sm hover:text-accent transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="mailto:parthiv.paul@mail.utoronto.ca"
                            className="text-text-dim text-sm hover:text-accent transition-colors"
                        >
                            Email
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
