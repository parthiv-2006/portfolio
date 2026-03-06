import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TerminalIcon, Compass } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { createGameState, processCommand, getEntryMessage } from '../adventureEngine';

/* ── Resume download helper ── */
const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Parthiv_Paul_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* ── Standard Terminal Commands ── */
const COMMANDS = {
    help: () => [
        { type: 'system', text: 'Available commands:' },
        { type: 'info', text: '  contact --email     Show email address' },
        { type: 'info', text: '  contact --github    Show GitHub profile' },
        { type: 'info', text: '  contact --linkedin  Show LinkedIn profile' },
        { type: 'info', text: '  resume              Download my resume' },
        { type: 'info', text: '  about               About me' },
        { type: 'info', text: '  skills              List skills' },
        { type: 'info', text: '  explore             🗺️  Enter the Portfolio Realm' },
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
    resume: () => {
        downloadResume();
        return [
            { type: 'success', text: '📄 Downloading resume...' },
            { type: 'info', text: '   → Parthiv_Paul_Resume.pdf' },
        ];
    },
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

const WELCOME_TEXT = "Welcome to Parthiv's terminal. Type 'help' for commands.";

export default function Terminal() {
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [booted, setBooted] = useState(false);
    const [bootText, setBootText] = useState('');

    /* ── Adventure mode state ── */
    const [adventureMode, setAdventureMode] = useState(false);
    const [gameState, setGameState] = useState(null);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const terminalRef = useRef(null);
    const isInView = useInView(terminalRef, { once: true, margin: '-100px' });

    /* ── Boot-up typing sequence ── */
    useEffect(() => {
        if (!isInView || booted) return;

        let charIndex = 0;
        const interval = setInterval(() => {
            if (charIndex <= WELCOME_TEXT.length) {
                setBootText(WELCOME_TEXT.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(interval);
                setLines([
                    { type: 'system', text: WELCOME_TEXT },
                    { type: 'dim', text: '—' },
                ]);
                setBooted(true);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [isInView, booted]);

    /* ── Auto-scroll on new content ── */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, bootText]);

    /* ── Enter adventure mode ── */
    const enterAdventure = () => {
        const state = createGameState();
        setGameState(state);
        setAdventureMode(true);

        const entryLines = getEntryMessage();
        setLines((prev) => [
            ...prev,
            { type: 'input', text: '$ explore' },
            { type: 'dim', text: '' },
            ...entryLines,
        ]);
    };

    /* ── Handle command submission ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim().toLowerCase();
        if (!trimmed) return;

        /* ── Adventure Mode ── */
        if (adventureMode && gameState) {
            const inputLine = { type: 'input', text: `⚔ ${trimmed}` };
            const { newState, output, shouldExit } = processCommand(gameState, trimmed);

            setGameState(newState);
            setLines((prev) => [...prev, inputLine, ...output]);

            if (shouldExit) {
                setAdventureMode(false);
            }

            setHistory((prev) => [...prev, trimmed]);
            setHistoryIndex(-1);
            setInput('');
            return;
        }

        /* ── Normal Mode ── */
        const newLines = [
            ...lines,
            { type: 'input', text: `$ ${trimmed}` },
        ];

        if (trimmed === 'clear') {
            setLines([
                { type: 'system', text: WELCOME_TEXT },
                { type: 'dim', text: '—' },
            ]);
        } else if (trimmed === 'explore') {
            enterAdventure();
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

    /* ── Arrow key history navigation ── */
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

    /* ── Title bar text ── */
    const titleBarText = adventureMode ? 'parthiv@adventure ~ ⚔' : 'parthiv@portfolio ~ %';
    const promptChar = adventureMode ? '⚔' : '$';

    return (
        <section id="contact" className="w-full">
            <div className="max-w-3xl mx-auto w-full" ref={terminalRef}>
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
                    className={`rounded-2xl border overflow-hidden shadow-2xl shadow-black/30 transition-all duration-500 ${adventureMode
                            ? 'border-emerald-500/30 bg-surface/80 backdrop-blur-sm'
                            : 'border-border bg-surface/80 backdrop-blur-sm'
                        } ${isInView && !booted ? 'glitch-enter' : ''}`}
                >
                    {/* Title bar */}
                    <div
                        className={`flex items-center gap-2 px-4 py-3 border-b transition-all duration-500 ${adventureMode
                                ? 'bg-emerald-950/40 border-emerald-500/20'
                                : 'bg-surface-light border-border'
                            }`}
                    >
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="flex-1 text-center">
                            <span
                                className={`text-xs font-mono flex items-center justify-center gap-1.5 transition-colors duration-500 ${adventureMode ? 'text-emerald-400' : 'text-text-dim'
                                    }`}
                            >
                                {adventureMode ? (
                                    <Compass size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
                                ) : (
                                    <TerminalIcon size={12} />
                                )}
                                {titleBarText}
                            </span>
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* Terminal content */}
                    <div
                        ref={scrollRef}
                        className="p-5 h-80 overflow-y-auto font-mono text-sm space-y-1"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Boot-up typing animation */}
                        {!booted && bootText && (
                            <div className="text-accent">
                                {bootText}
                                <motion.span
                                    className="inline-block w-2 h-4 bg-accent ml-0.5 align-middle"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                                />
                            </div>
                        )}

                        {/* Regular lines after boot */}
                        {booted &&
                            lines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15, delay: i < 2 ? i * 0.05 : 0 }}
                                    className={lineColors[line.type] || 'text-text'}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {line.text}
                                </motion.div>
                            ))}

                        {/* Input line — only show after boot */}
                        {booted && (
                            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                                <span className={adventureMode ? 'text-emerald-400' : 'text-accent'}>
                                    {promptChar}
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent outline-none text-text caret-accent font-mono text-sm"
                                    placeholder={
                                        adventureMode
                                            ? 'look, go, interact, take, map, help...'
                                            : 'Type a command...'
                                    }
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                <motion.span
                                    className={`inline-block w-2 h-4 ${adventureMode ? 'bg-emerald-400' : 'bg-accent'
                                        }`}
                                    animate={{ opacity: [1, 1, 0, 0] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'steps(1)',
                                        times: [0, 0.5, 0.5, 1],
                                    }}
                                />
                            </form>
                        )}
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
                    {!adventureMode && (
                        <>
                            {['contact --email', 'contact --github', 'contact --linkedin'].map(
                                (cmd) => (
                                    <button
                                        key={cmd}
                                        onClick={() => {
                                            if (!booted) return;
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
                            <button
                                onClick={() => {
                                    if (!booted) return;
                                    const newLines = [
                                        ...lines,
                                        { type: 'input', text: '$ resume' },
                                        ...COMMANDS.resume(),
                                    ];
                                    setLines(newLines);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/25 text-accent text-xs font-mono hover:bg-accent/20 hover:border-accent/40 transition-all duration-200"
                            >
                                resume
                            </button>
                        </>
                    )}

                    {/* Explore / adventure button — always visible */}
                    <button
                        onClick={() => {
                            if (!booted) return;
                            if (adventureMode) {
                                // Already in adventure mode — run 'map'
                                if (gameState) {
                                    const inputLine = { type: 'input', text: '⚔ map' };
                                    const { newState, output } = processCommand(gameState, 'map');
                                    setGameState(newState);
                                    setLines((prev) => [...prev, inputLine, ...output]);
                                }
                            } else {
                                enterAdventure();
                            }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 flex items-center gap-1.5 ${adventureMode
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40'
                            }`}
                    >
                        <Compass size={12} />
                        {adventureMode ? 'map' : 'explore'}
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
