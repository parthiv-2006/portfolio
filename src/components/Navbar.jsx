import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '#hero', id: 'hero' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#timeline', id: 'timeline' },
    { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar({ activeSection }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const container = document.querySelector('.snap-container');
        const target = container || window;
        const onScroll = () => {
            const scrollTop = container ? container.scrollTop : window.scrollY;
            setScrolled(scrollTop > 50);
        };
        target.addEventListener('scroll', onScroll);
        return () => target.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileOpen(false);
    };

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'border-b border-white/[0.06]'
                : 'border-b border-transparent'
                }`}
            style={{ backgroundColor: scrolled ? 'rgba(17,17,16,0.85)' : 'transparent' }}
        >
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <a
                    href="#hero"
                    onClick={(e) => handleNavClick(e, '#hero')}
                    className="font-display text-lg text-text hover:text-accent transition-colors duration-300"
                    style={{ fontStyle: 'italic' }}
                >
                    Parthiv Paul
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${isActive
                                    ? 'text-text'
                                    : 'text-text-dim hover:text-text-muted'
                                    }`}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-text-muted hover:text-accent transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden overflow-hidden border-b border-white/[0.06]"
                        style={{ backgroundColor: 'rgba(17,17,16,0.95)' }}
                    >
                        <div className="px-6 py-6 flex flex-col gap-5">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${activeSection === link.id
                                        ? 'text-text'
                                        : 'text-text-dim hover:text-text-muted'
                                        }`}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
