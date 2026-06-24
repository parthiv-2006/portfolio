import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';

const navLinks = [
    { label: 'about',    href: '#about',    id: 'about' },
    { label: 'activity', href: '#activity', id: 'activity' },
    { label: 'work',     href: '#work',     id: 'work' },
    { label: 'journey',  href: '#journey',  id: 'journey' },
    { label: 'terminal', href: '#lab',      id: 'lab' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

function useTextScramble(text) {
    const [display, setDisplay] = useState(text);
    const intervalRef = useRef(null);
    const frameRef = useRef(0);

    const scramble = useCallback(() => {
        frameRef.current = 0;
        const totalFrames = text.length + 8;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            frameRef.current++;
            const progress = frameRef.current / totalFrames;
            const result = text
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    const charProgress = i / text.length;
                    if (progress > charProgress + 0.3) return char;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');
            setDisplay(result);
            if (frameRef.current >= totalFrames) {
                clearInterval(intervalRef.current);
                setDisplay(text);
            }
        }, 30);
    }, [text]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        setDisplay(text);
    }, [text]);

    useEffect(() => () => clearInterval(intervalRef.current), []);
    return { display, scramble, reset };
}

function ScrambleLink({ label, href, isActive, onClick }) {
    const { display, scramble, reset } = useTextScramble(label);
    return (
        <a
            href={href}
            onClick={onClick}
            onMouseEnter={scramble}
            onMouseLeave={reset}
            className={`relative font-mono text-[12px] tracking-[0.04em] px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? 'text-text' : 'text-text-muted hover:text-text'
            }`}
        >
            {display}
            {isActive && (
                <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-px bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </a>
    );
}

export default function Navbar({ activeSection, theme, toggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [form, setForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [status, setStatus] = useState('idle');

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    const handleContactOpen = () => {
        setStatus('idle');
        setForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setContactOpen(true);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
                style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
            >
                <div className="flex items-center justify-between gap-4 w-full max-w-[1120px] px-4 sm:px-5 py-2.5 rounded-full border border-border bg-nav-bg backdrop-blur-xl shadow-lg shadow-black/20">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => handleNavClick(e, '#hero')}
                        className="font-display text-text hover:text-accent transition-colors duration-300 text-xl shrink-0"
                        style={{ fontStyle: 'italic' }}
                    >
                        Parthiv<span className="text-accent">.</span>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1 font-mono text-sm flex-wrap justify-end">
                        {navLinks.map((link) => (
                            <ScrambleLink
                                key={link.id}
                                label={link.label}
                                href={link.href}
                                isActive={activeSection === link.id}
                                onClick={(e) => handleNavClick(e, link.href)}
                            />
                        ))}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="w-[38px] h-[38px] flex items-center justify-center rounded-full border border-border text-accent bg-transparent cursor-pointer transition-[border-color,transform] duration-300 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>
                        <button
                            onClick={handleContactOpen}
                            className="ml-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-bg font-sans font-semibold text-[13px] border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(226,160,78,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            Get in touch
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 overflow-y-auto py-16"
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.id}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className={`font-mono text-lg tracking-[0.15em] transition-colors ${
                                    activeSection === link.id ? 'text-accent' : 'text-text-dim hover:text-text'
                                }`}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <motion.button
                            onClick={() => { handleContactOpen(); setMobileOpen(false); }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: navLinks.length * 0.06, duration: 0.4 }}
                            className="px-6 py-3 rounded-full bg-accent text-bg font-semibold text-sm"
                        >
                            Get in touch
                        </motion.button>
                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: (navLinks.length + 1) * 0.06, duration: 0.4 }}
                            className="w-9.5 h-9.5 flex items-center justify-center rounded-full border border-border text-accent bg-transparent"
                        >
                            {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContactModal
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                form={form}
                setForm={setForm}
                status={status}
                setStatus={setStatus}
            />
        </>
    );
}
