import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';

export default function ContactSection() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [status, setStatus] = useState('idle');

    const handleOpen = () => {
        setStatus('idle');
        setForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setOpen(true);
    };

    return (
        <section id="contact" className="w-full">
            <SectionHeading label="Contact" title="Get in Touch" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center gap-6"
            >
                <p className="text-text-muted text-base max-w-lg leading-relaxed">
                    Actively looking for software engineering internships for{' '}
                    <span className="text-accent font-medium">Fall 2026</span> and{' '}
                    <span className="text-accent font-medium">Winter 2027</span>.
                    If you're hiring or just want to connect, reach out — I reply fast.
                </p>

                <button
                    onClick={handleOpen}
                    aria-haspopup="dialog"
                    className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-medium text-accent border border-accent/25 bg-accent/[0.07] hover:bg-accent/15 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_24px_rgba(226,160,78,0.18)] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                    {/* Subtle pulse ring */}
                    <span className="absolute inset-0 rounded-full border border-accent/10 animate-[pulse_3s_ease-in-out_infinite]" />
                    <Mail size={15} />
                    Send me a message
                </button>
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
