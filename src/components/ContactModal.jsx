import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';

const DIRECT_EMAIL = 'parthiv.paul@mail.utoronto.ca';

const DEFAULT_MESSAGE = `Hi Parthiv,

I came across your portfolio and was impressed by your work. I'd love to connect about a potential opportunity at [Company Name].

Looking forward to hearing from you.

[Recruiter Name]`;

export { DEFAULT_MESSAGE };

/**
 * Accessible, focus-trapped contact modal wired to EmailJS.
 * Props:
 *   open       — boolean
 *   onClose    — () => void
 *   form       — { email, message, _hp }
 *   setForm    — React setter
 *   status     — 'idle' | 'sending' | 'success' | 'error'
 *   setStatus  — React setter
 */
export default function ContactModal({ open, onClose, form, setForm, status, setStatus }) {
    const dialogRef = useRef(null);
    const firstFocusRef = useRef(null);

    /* ── Focus management ── */
    useEffect(() => {
        if (!open) return;
        // Slight delay so AnimatePresence finishes mounting
        const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
        return () => clearTimeout(t);
    }, [open]);

    /* ── Keyboard: Escape to close, Tab trap ── */
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const focusable = dialogRef.current?.querySelectorAll(
                'button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable?.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form._hp) return; // honeypot — silently drop
        if (status === 'sending') return;

        setStatus('sending');
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_email: form.email,
                    email: form.email,
                    message: form.message,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="contact-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <motion.div
                        key="contact-dialog"
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="contact-dialog-title"
                            className="relative w-full max-w-lg bg-surface border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
                        >
                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 text-text-dim hover:text-text transition-colors rounded-lg hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                                aria-label="Close dialog"
                            >
                                <X size={16} />
                            </button>

                            <h3
                                id="contact-dialog-title"
                                className="text-text text-lg font-medium mb-1"
                            >
                                Say hello
                            </h3>
                            <p className="text-text-dim text-sm mb-6">
                                Fill in your email so I can reply directly.
                            </p>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-3 py-8 text-center"
                                >
                                    <CheckCircle size={36} className="text-accent" />
                                    <p className="text-text font-medium">Message sent!</p>
                                    <p className="text-text-muted text-sm">I'll be in touch.</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-5 py-2 rounded-full text-sm border border-white/[0.08] text-text-muted hover:text-text hover:border-white/[0.15] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Honeypot — hidden from real users */}
                                    <input
                                        type="text"
                                        name="_hp"
                                        value={form._hp}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, _hp: e.target.value }))
                                        }
                                        aria-hidden="true"
                                        tabIndex={-1}
                                        style={{
                                            position: 'absolute',
                                            left: '-9999px',
                                            width: '1px',
                                            height: '1px',
                                            opacity: 0,
                                        }}
                                    />

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="contact-email"
                                            className="block text-xs font-mono text-text-dim uppercase tracking-[0.12em] mb-1.5"
                                        >
                                            Your email{' '}
                                            <span className="text-accent" aria-hidden="true">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            ref={firstFocusRef}
                                            id="contact-email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="you@company.com"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, email: e.target.value }))
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl bg-bg border border-white/[0.08] text-text text-sm placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all duration-200"
                                            aria-required="true"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="mb-6">
                                        <label
                                            htmlFor="contact-message"
                                            className="block text-xs font-mono text-text-dim uppercase tracking-[0.12em] mb-1.5"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            rows={7}
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, message: e.target.value }))
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl bg-bg border border-white/[0.08] text-text text-sm leading-relaxed placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 resize-none transition-all duration-200"
                                        />
                                    </div>

                                    {/* Error state */}
                                    <AnimatePresence>
                                        {status === 'error' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                className="flex items-start gap-2.5 mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/[0.05] text-sm text-red-400"
                                                role="alert"
                                            >
                                                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                                <span>
                                                    Something went wrong — email me directly at{' '}
                                                    <a
                                                        href={`mailto:${DIRECT_EMAIL}`}
                                                        className="underline underline-offset-2 hover:text-red-300 transition-colors"
                                                    >
                                                        {DIRECT_EMAIL}
                                                    </a>
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={status === 'sending' || !form.email}
                                        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium bg-accent text-bg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(226,160,78,0.2)] hover:shadow-[0_0_28px_rgba(226,160,78,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <span className="w-3.5 h-3.5 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                Send message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
