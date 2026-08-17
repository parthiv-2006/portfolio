import { useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';

const DIRECT_EMAIL = 'parthiv.paul@mail.utoronto.ca';

const DEFAULT_MESSAGE = '';

export { DEFAULT_MESSAGE };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible, focus-trapped contact modal wired to EmailJS.
 * Props:
 *   open       — boolean
 *   onClose    — () => void
 *   form       — { email, message, _hp }
 *   setForm    — React setter
 *   status     — 'idle' | 'sending' | 'success' | 'error' | 'no-email' | 'bad-email'
 *   setStatus  — React setter
 */
export default function ContactModal({ open, onClose, form, setForm, status, setStatus }) {
    const dialogRef = useRef(null);
    const firstFocusRef = useRef(null);
    const successCloseRef = useRef(null);
    const returnFocusRef = useRef(null);

    const uid = useId();
    const titleId = `contact-title-${uid}`;
    const descId = `contact-desc-${uid}`;
    const emailId = `contact-email-${uid}`;
    const emailErrorId = `contact-email-error-${uid}`;
    const messageId = `contact-message-${uid}`;

    const emailInvalid = status === 'no-email' || status === 'bad-email';

    /* ── Focus: move in on open, hand it back to the opener on close ── */
    useEffect(() => {
        if (!open) return;
        returnFocusRef.current = document.activeElement;
        // Slight delay so AnimatePresence finishes mounting
        const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
        return () => {
            clearTimeout(t);
            const opener = returnFocusRef.current;
            if (opener && document.contains(opener) && typeof opener.focus === 'function') {
                opener.focus();
            }
        };
    }, [open]);

    /* ── The success view swaps out the input, so re-anchor focus inside the trap ── */
    useEffect(() => {
        if (open && status === 'success') successCloseRef.current?.focus();
    }, [open, status]);

    /* ── Lock body scroll while open; restore on close, Escape or backdrop click ── */
    useEffect(() => {
        if (!open) return;
        const { body, documentElement } = document;
        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;
        // Compensate for the scrollbar we are about to remove so the page doesn't shift.
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPaddingRight;
        };
    }, [open]);

    /* ── Keyboard: Escape to close, Tab trap ── */
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            // Skip anything off-screen or opted out of the tab order (e.g. the honeypot).
            const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
                (el) =>
                    el.tabIndex >= 0 &&
                    !el.getAttribute('aria-hidden') &&
                    el.getClientRects().length > 0
            );
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            // Focus escaped the dialog (success view swap, stray click) — pull it back.
            if (!dialog.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
                return;
            }

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    const handleEmailBlur = (e) => {
        const value = e.target.value.trim();
        if (value && !EMAIL_PATTERN.test(value)) setStatus('bad-email');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form._hp) return; // honeypot — silently drop
        if (status === 'sending') return;

        // Read directly from DOM to catch browser autofill (autofill bypasses onChange)
        const emailValue = (firstFocusRef.current?.value || form.email || '').trim();

        if (!emailValue) {
            setStatus('no-email');
            firstFocusRef.current?.focus();
            return;
        }
        if (!EMAIL_PATTERN.test(emailValue)) {
            setStatus('bad-email');
            firstFocusRef.current?.focus();
            return;
        }

        setStatus('sending');
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_email: emailValue,
                    reply_to: emailValue,
                    message: form.message,
                },
                { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
            );
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    const liveMessage =
        status === 'sending'
            ? 'Sending your message.'
            : status === 'success'
              ? 'Message sent. I will be in touch.'
              : status === 'error'
                ? `Message could not be sent. You can email ${DIRECT_EMAIL} directly.`
                : '';

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
                        aria-hidden="true"
                    />

                    {/* Scroll container — clicking the empty area around the panel closes */}
                    <motion.div
                        key="contact-dialog"
                        className="fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain p-4 sm:p-6"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) onClose();
                        }}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div
                            ref={dialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={titleId}
                            aria-describedby={descId}
                            className="relative my-auto w-full max-w-lg bg-surface border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
                        >
                            {/* Close */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-3 right-3 p-2 text-text-dim hover:text-text transition-colors rounded-lg hover:bg-white/[0.05]"
                                aria-label="Close dialog"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>

                            <h3 id={titleId} className="text-text text-lg font-medium mb-1 pr-10">
                                Say hello
                            </h3>
                            <p id={descId} className="text-text-muted text-sm mb-6">
                                Fill in your email so I can reply directly.
                            </p>

                            {/* Every submit state reaches assistive tech, not just the visuals. */}
                            <p role="status" aria-live="polite" className="sr-only">
                                {liveMessage}
                            </p>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-3 py-8 text-center"
                                >
                                    <CheckCircle size={36} className="text-accent" aria-hidden="true" />
                                    <p className="text-text font-medium">Message sent!</p>
                                    <p className="text-text-muted text-sm">I'll be in touch.</p>
                                    <button
                                        type="button"
                                        ref={successCloseRef}
                                        onClick={onClose}
                                        className="mt-4 px-5 py-2.5 rounded-full text-sm border border-white/[0.08] text-text-muted hover:text-text hover:border-white/[0.15] transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate aria-busy={status === 'sending'}>
                                    {/* Honeypot — hidden from real users, screen readers and the tab order */}
                                    <input
                                        type="text"
                                        name="_hp"
                                        value={form._hp}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, _hp: e.target.value }))
                                        }
                                        aria-hidden="true"
                                        tabIndex={-1}
                                        autoComplete="off"
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
                                            htmlFor={emailId}
                                            className="block text-xs font-mono text-text-muted uppercase tracking-[0.12em] mb-1.5"
                                        >
                                            Your email{' '}
                                            <span className="text-accent" aria-hidden="true">
                                                *
                                            </span>
                                            <span className="sr-only">(required)</span>
                                        </label>
                                        <input
                                            ref={firstFocusRef}
                                            id={emailId}
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="you@company.com"
                                            value={form.email}
                                            onChange={(e) => {
                                                if (emailInvalid) setStatus('idle');
                                                setForm((f) => ({ ...f, email: e.target.value }));
                                            }}
                                            onBlur={handleEmailBlur}
                                            className={`w-full px-4 py-2.5 rounded-xl bg-bg border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all duration-200 ${
                                                emailInvalid
                                                    ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                                                    : 'border-white/[0.08] focus:ring-accent/40 focus:border-accent/40'
                                            }`}
                                            aria-required="true"
                                            aria-invalid={emailInvalid}
                                            aria-describedby={emailInvalid ? emailErrorId : undefined}
                                        />
                                        <AnimatePresence>
                                            {emailInvalid && (
                                                <motion.p
                                                    id={emailErrorId}
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    className="mt-1.5 text-xs text-red-400"
                                                    role="alert"
                                                >
                                                    {status === 'no-email'
                                                        ? 'Please enter your email so I can reply.'
                                                        : 'That email address looks incomplete — check it and try again.'}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-6">
                                        <label
                                            htmlFor={messageId}
                                            className="block text-xs font-mono text-text-muted uppercase tracking-[0.12em] mb-1.5"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id={messageId}
                                            name="message"
                                            rows={6}
                                            placeholder="Say hi/send me a message"
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, message: e.target.value }))
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl bg-bg border border-white/[0.08] text-text text-sm leading-relaxed placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 resize-y transition-all duration-200"
                                        />
                                    </div>

                                    {/* Error state */}
                                    <AnimatePresence>
                                        {status === 'error' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                className="flex items-start gap-2.5 mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-sm text-red-400"
                                                role="alert"
                                            >
                                                <AlertCircle
                                                    size={15}
                                                    className="shrink-0 mt-0.5"
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    Something went wrong — email me directly at{' '}
                                                    <a
                                                        href={`mailto:${DIRECT_EMAIL}`}
                                                        className="underline underline-offset-2 hover:text-red-300 transition-colors break-all"
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
                                        disabled={status === 'sending'}
                                        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium bg-accent text-bg hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(226,160,78,0.2)] hover:shadow-[0_0_28px_rgba(226,160,78,0.3)]"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <span
                                                    className="w-3.5 h-3.5 rounded-full border-2 border-bg/30 border-t-bg animate-spin"
                                                    aria-hidden="true"
                                                />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} aria-hidden="true" />
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
