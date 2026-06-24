import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';

const EMAIL = 'parthiv.paul@mail.utoronto.ca';

export default function ContactSection() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [status, setStatus] = useState('idle');
    const [emailCopied, setEmailCopied] = useState(false);

    const handleOpen = () => {
        setStatus('idle');
        setForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setOpen(true);
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(EMAIL);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    return (
        <section id="contact" className="w-full text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <p className="font-mono text-xs tracking-[0.28em] uppercase text-accent mb-6">
                    Let's connect
                </p>
                <h2
                    className="font-display text-text leading-[0.98] tracking-tight mb-8"
                    style={{
                        fontSize: 'clamp(2.8rem, 7vw, 5.4rem)',
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Let's build something
                    <br />
                    great together<span className="text-accent">.</span>
                </h2>

                <div className="flex flex-wrap gap-3 justify-center items-center mt-8">
                    <button
                        onClick={handleOpen}
                        aria-haspopup="dialog"
                        className="relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm bg-accent text-bg border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(226,160,78,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <span className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]" />
                        ✉ Send me a message
                    </button>

                    <button
                        onClick={handleCopyEmail}
                        className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm border cursor-pointer transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                            emailCopied
                                ? 'border-accent/40 text-accent bg-accent/[0.07]'
                                : 'border-white/[0.12] text-text-muted hover:text-accent hover:border-accent/40 bg-transparent'
                        }`}
                    >
                        {emailCopied ? '✓ Copied!' : EMAIL}
                    </button>

                    <a
                        href="https://github.com/parthiv-2006"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-white/[0.12] text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/parthiv-paul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-white/[0.12] text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="parthiv_paul_swe.pdf"
                        download="parthiv_paul_swe.pdf"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-accent/25 bg-accent/[0.07] text-accent hover:bg-accent/15 transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        ↓ Résumé
                    </a>
                </div>
            </motion.div>

            <ContactModal
                open={open}
                onClose={() => setOpen(false)}
                form={form}
                setForm={setForm}
                status={status}
                setStatus={setStatus}
            />
        </section>
    );
}
