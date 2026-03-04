import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TerminalIcon } from 'lucide-react';
import SectionHeading from './SectionHeading';

const COMMANDS = {
    help: () => [
        { type: 'system', text: 'Available commands:' },
        { type: 'info', text: '  contact --email     Show email address' },
        { type: 'info', text: '  contact --github    Show GitHub profile' },
        { type: 'info', text: '  contact --linkedin  Show LinkedIn profile' },
        { type: 'info', text: '  about               About me' },
        { type: 'info', text: '  skills              List skills' },
        { type: 'info', text: '  clear               Clear terminal' },
        { type: 'info', text: '  help                Show this menu' },
    ],
    'contact --email': () => [
        { type: 'success', text: '📧 parthiv.paul@mail.utoronto.ca' },
    ],
    'contact --github': () => [
        { type: 'success', text: '🔗 github.com/parthiv-2006' },
    ],
    'contact --linkedin': () => [
        { type: 'success', text: '🔗 linkedin.com/in/parthiv-paul' },
    ],
    about: () => [
        {
            type: 'system',
            text: "Hi! I'm Parthiv — a Computer Science Specialist at UofT.",
        },
        {
            type: 'info',
            text: 'I build full-stack systems with the MERN stack and Python.',
        },
        {
            type: 'info',
            text: "Dean's List 2024-2025. Passionate about clean code & great UX.",
        },
    ],
    skills: () => [
        { type: 'system', text: '⚡ Core Stack:' },
        { type: 'info', text: '   React · Node.js · Express · MongoDB' },
        { type: 'info', text: '   Python · TypeScript · Tailwind CSS' },
        { type: 'system', text: '🧠 Focus Areas:' },
        { type: 'info', text: '   Data Structures & Algorithms' },
        { type: 'info', text: '   System Design · REST APIs' },
    ],
};

const WELCOME_LINES = [
    { type: 'system', text: "Welcome to Parthiv's terminal. Type 'help' for commands." },
    { type: 'dim', text: '—' },
];

export default function Terminal() {
    const [lines, setLines] = useState(WELCOME_LINES);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim().toLowerCase();
        if (!trimmed) return;

        const newLines = [
            ...lines,
            { type: 'input', text: `$ ${trimmed}` },
        ];

        if (trimmed === 'clear') {
            setLines(WELCOME_LINES);
        } else if (COMMANDS[trimmed]) {
            setLines([...newLines, ...COMMANDS[trimmed]()]);
        } else {
            setLines([
                ...newLines,
                { type: 'error', text: `Command not found: ${trimmed}. Type 'help' for commands.` },
            ]);
        }

        setHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newIndex = historyIndex + 1;
            if (newIndex < history.length) {
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = historyIndex - 1;
            if (newIndex >= 0) {
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const lineColors = {
        system: 'text-accent',
        info: 'text-text-muted',
        success: 'text-emerald-400',
        error: 'text-red-400',
        input: 'text-text',
        dim: 'text-text-dim',
    };

    return (
        <section id="contact" className="py-32 w-full">
            <div className="max-w-3xl mx-auto w-full">
                <SectionHeading
                    label="Connect"
                    title="Get in Touch"
                    subtitle="Use the terminal below to find my contact info, or just say hi."
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/30"
                >
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface-light border-b border-border">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="flex-1 text-center">
                            <span className="text-text-dim text-xs font-mono flex items-center justify-center gap-1.5">
                                <TerminalIcon size={12} />
                                parthiv@portfolio ~ %
                            </span>
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* Terminal content */}
                    <div
                        ref={scrollRef}
                        className="p-5 h-72 overflow-y-auto font-mono text-sm space-y-1"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {lines.map((line, i) => (
                            <div key={i} className={lineColors[line.type] || 'text-text'}>
                                {line.text}
                            </div>
                        ))}

                        {/* Input line */}
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                            <span className="text-accent">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent outline-none text-text caret-accent font-mono text-sm"
                                placeholder="Type a command..."
                                autoComplete="off"
                                spellCheck={false}
                            />
                            <motion.span
                                className="inline-block w-2 h-4 bg-accent"
                                animate={{ opacity: [1, 1, 0, 0] }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'steps(1)',
                                    times: [0, 0.5, 0.5, 1],
                                }}
                            />
                        </form>
                    </div>
                </motion.div>

                {/* Quick actions below terminal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex flex-wrap justify-center gap-3"
                >
                    {['contact --email', 'contact --github', 'contact --linkedin'].map(
                        (cmd) => (
                            <button
                                key={cmd}
                                onClick={() => {
                                    const newLines = [
                                        ...lines,
                                        { type: 'input', text: `$ ${cmd}` },
                                        ...COMMANDS[cmd](),
                                    ];
                                    setLines(newLines);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-surface-light border border-border text-text-dim text-xs font-mono hover:border-accent/30 hover:text-accent transition-all duration-200"
                            >
                                {cmd}
                            </button>
                        )
                    )}
                </motion.div>
            </div>
        </section>
    );
}
