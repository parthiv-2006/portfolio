import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '#hero' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#timeline' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-surface/70 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#hero" className="text-xl font-bold tracking-tighter text-accent">
                    PP<span className="text-text">.</span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-text-muted hover:text-accent transition-colors duration-200 tracking-wide"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="text-sm px-8 py-2 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-200"
                    >
                        Get in Touch
                    </a>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-text-muted hover:text-accent transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-border"
                >
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-text-muted hover:text-accent transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
