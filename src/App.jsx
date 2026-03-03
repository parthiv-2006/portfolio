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
                <SkillsGrid />
                <Projects />
                <Timeline />
                <Terminal />
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-text-dim text-sm">
                        © {new Date().getFullYear()} Parthiv Paul. Built with React & Framer Motion.
                    </span>
                    <div className="flex items-center gap-6">
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
