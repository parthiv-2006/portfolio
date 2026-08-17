import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';

const EMAIL = 'parthiv.paul@mail.utoronto.ca';

/**
 * navigator.clipboard is undefined on insecure origins and its promise can
 * reject when the permission is denied, so fall back to the legacy
 * execCommand path before giving up. Resolves to true when the copy landed.
 */
async function copyText(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // fall through to the legacy path
    }
    try {
        const scratch = document.createElement('textarea');
        scratch.value = text;
        scratch.setAttribute('readonly', '');
        scratch.style.position = 'fixed';
        scratch.style.top = '0';
        scratch.style.opacity = '0';
        document.body.appendChild(scratch);
        scratch.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(scratch);
        return ok;
    } catch {
        return false;
    }
}

export default function ContactSection() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [status, setStatus] = useState('idle');
    // 'idle' | 'copied' | 'failed'
    const [copyState, setCopyState] = useState('idle');
    const [copyAnnouncement, setCopyAnnouncement] = useState('');

    const handleOpen = () => {
        setStatus('idle');
        setForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setOpen(true);
    };

    const handleCopyEmail = async () => {
        const ok = await copyText(EMAIL);
        setCopyState(ok ? 'copied' : 'failed');
        setCopyAnnouncement(
            ok
                ? `Email address copied to clipboard: ${EMAIL}`
                : `Could not copy automatically. Email address is ${EMAIL}`
        );
        setTimeout(() => {
            setCopyState('idle');
            setCopyAnnouncement('');
        }, 4000);
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

                {/* Three weights: one filled primary, two outlined secondaries, two quiet links. */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <button
                        type="button"
                        onClick={handleOpen}
                        aria-haspopup="dialog"
                        className="relative inline-flex w-full max-w-[320px] sm:w-auto items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-[15px] bg-accent text-bg border-none cursor-pointer transition-all duration-300 shadow-[0_0_28px_rgba(226,160,78,0.18)] hover:shadow-[0_0_40px_rgba(226,160,78,0.45)]"
                    >
                        <span
                            className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]"
                            aria-hidden="true"
                        />
                        <span aria-hidden="true">✉</span>
                        Send me a message
                    </button>

                    <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center items-center">
                        <button
                            type="button"
                            onClick={handleCopyEmail}
                            aria-label={`Copy email address ${EMAIL}`}
                            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-[13px] sm:text-sm border cursor-pointer transition-all duration-250 min-h-[44px] max-w-full ${
                                copyState === 'copied'
                                    ? 'border-accent/40 text-accent bg-accent/[0.07]'
                                    : 'border-accent/25 text-text-muted hover:text-accent hover:border-accent/45 bg-transparent'
                            }`}
                        >
                            <span className="truncate">
                                {copyState === 'copied' ? '✓ Copied!' : EMAIL}
                            </span>
                        </button>

                        <a
                            href="parthiv_paul_swe.pdf"
                            download="parthiv_paul_swe.pdf"
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-[13px] sm:text-sm border border-accent/25 text-accent hover:bg-accent/10 hover:border-accent/45 transition-all duration-250 min-h-[44px]"
                        >
                            <span aria-hidden="true">↓</span> Resume
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center items-center">
                        <a
                            href="https://github.com/parthiv-2006"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-text-muted border border-transparent hover:text-accent hover:border-accent/20 transition-all duration-250 min-h-[44px]"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/parthiv-paul"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-text-muted border border-transparent hover:text-accent hover:border-accent/20 transition-all duration-250 min-h-[44px]"
                        >
                            LinkedIn
                        </a>
                    </div>

                    {/* Clipboard result is announced here, not just shown on the button. */}
                    <p aria-live="polite" className="sr-only">
                        {copyAnnouncement}
                    </p>
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
