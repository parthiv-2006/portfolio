import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, useInView } from 'framer-motion';
import { TerminalIcon, Compass } from 'lucide-react';
import SectionHeading from './SectionHeading';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { createGameState, processCommand, getEntryMessage } from '../adventureEngine';

/* ── Resume download helper ── */
const downloadResume = () => {
    const link = document.createElement('a');
    link.href = 'parthiv_paul_swe.pdf';
    link.download = 'parthiv_paul_swe.pdf';
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
        { type: 'info', text: '  experience          Where I have worked' },
        { type: 'info', text: '  awards              Awards & certifications' },
        { type: 'info', text: '  facts               Random facts' },
        { type: 'info', text: '  skills              List skills' },
        { type: 'info', text: '  explore             🗺️  Enter the Portfolio Realm' },
        { type: 'info', text: '  clear               Clear terminal' },
        { type: 'info', text: '  help                Show this menu' },
    ],
    'contact --email': () => [
        { type: 'success', text: '📧 parthiv.paul@mail.utoronto.ca', action: 'copy', value: 'parthiv.paul@mail.utoronto.ca' },
    ],
    'contact --github': () => [
        { type: 'success', text: '🔗 github.com/parthiv-2006', href: 'https://github.com/parthiv-2006' },
    ],
    'contact --linkedin': () => [
        { type: 'success', text: '🔗 linkedin.com/in/parthiv-paul', href: 'https://www.linkedin.com/in/parthiv-paul' },
    ],
    resume: () => {
        downloadResume();
        return [
            { type: 'success', text: '📄 Downloading resume...' },
            { type: 'info', text: '   → parthiv_paul_swe.pdf' },
        ];
    },
    about: () => [
        {
            type: 'system',
            text: "Hi! I'm Parthiv, a CS Specialist at UofT.",
        },
        {
            type: 'info',
            text: 'Software Engineer @ Velox Systems. I build full-stack apps and AI agents.',
        },
        {
            type: 'info',
            text: 'TypeScript + Python. FastAPI, Next.js, Postgres, MCP.',
        },
        {
            type: 'info',
            text: "Dean's List 2024-25 and 2025-26. I care about code that actually ships.",
        },
    ],
    facts: () => [
        { type: 'system', text: 'Random facts about me:' },
        { type: 'info', text: '  Avg 12k+ steps/day for the past 2 years' },
        { type: 'info', text: '  15+ cities visited' },
        { type: 'info', text: '  Red Rising series is unmatched' },
        { type: 'info', text: '  Combined squat/bench/deadlift over 1,000 lbs' },
    ],
    skills: () => [
        { type: 'system', text: '⚡ Core Stack:' },
        { type: 'info', text: '   TypeScript · Python · React · Next.js' },
        { type: 'info', text: '   FastAPI · Node.js · PostgreSQL · Supabase' },
        { type: 'system', text: '🤖 AI:' },
        { type: 'info', text: '   Claude Code · Claude API · Gemini' },
        { type: 'info', text: '   Model Context Protocol (MCP) · RAG · LlamaIndex' },
        { type: 'system', text: '🧠 Focus Areas:' },
        { type: 'info', text: '   Data Structures & Algorithms' },
        { type: 'info', text: '   System Design · REST APIs · CI/CD' },
    ],
    awards: () => [
        { type: 'system', text: '🏅 Awards:' },
        { type: 'info', text: "   UofT Dean's List — 2024-25, 2025-26" },
        { type: 'info', text: '   J.S. McLean Scholarship (UofT)' },
        { type: 'info', text: '   2nd — Waterloo SAF Financial Literacy (2023)' },
        { type: 'system', text: '📜 Certifications:' },
        { type: 'info', text: '   Claude Code in Action (Anthropic)' },
        { type: 'info', text: '   Building with the Claude API (Anthropic)' },
        { type: 'info', text: '   AI Agents Intensive Course (Google & Kaggle)' },
        { type: 'info', text: '   ChatGPT Prompt Engineering for Devs (DeepLearning.AI)' },
    ],
    experience: () => [
        { type: 'system', text: '💼 Experience:' },
        { type: 'info', text: '   Velox Systems — Software Engineer          Jul 2026 – Present' },
        { type: 'info', text: '   Applied Optimal — Full-Stack Dev, Contract  Jul 2026 – Sep 2026' },
        { type: 'info', text: '   GenLedge — Software Dev, Contract           Mar 2026 – May 2026' },
        { type: 'info', text: '   Outamation — AI & Automation Extern         May 2025 – Aug 2025' },
        { type: 'info', text: '   Chester-Hill — Software QA Tester, Intern   Jun 2024 – Nov 2024' },
        { type: 'info', text: '   Ontario Liberal Party — Frontend Dev        May 2023 – Sep 2023' },
        { type: 'dim', text: '   (full detail in the journey section ↑)' },
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
    const [copiedIndex, setCopiedIndex] = useState(null);

    /* ── Adventure mode state ── */
    const [adventureMode, setAdventureMode] = useState(false);
    const [gameState, setGameState] = useState(null);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const terminalRef = useRef(null);
    // False once the reader scrolls up — new output must not yank them back down.
    const stickToBottomRef = useRef(true);
    const isInView = useInView(terminalRef, { once: true, margin: '-100px' });
    const reducedMotion = usePrefersReducedMotion();
    const baseId = useId();
    const inputId = `${baseId}-cmd`;
    const hintId = `${baseId}-hint`;

    /* ── Boot-up typing sequence ── */
    useEffect(() => {
        if (!isInView || booted) return;

        const finish = () => {
            setLines([
                { type: 'system', text: WELCOME_TEXT },
                { type: 'dim', text: '—' },
            ]);
            setBooted(true);
        };

        // setInterval isn't covered by <MotionConfig reducedMotion="user">.
        if (reducedMotion) {
            setBootText(WELCOME_TEXT);
            finish();
            return;
        }

        let charIndex = 0;
        const interval = setInterval(() => {
            if (charIndex <= WELCOME_TEXT.length) {
                setBootText(WELCOME_TEXT.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(interval);
                finish();
            }
        }, 25);

        return () => clearInterval(interval);
    }, [isInView, booted, reducedMotion]);

    /* ── Auto-scroll on new content, unless the reader scrolled up ── */
    useEffect(() => {
        if (stickToBottomRef.current && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, bootText]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    }, []);

    /* Clicking the terminal body focuses the prompt — the expected shell
       affordance — without stealing clicks on links, buttons or selections. */
    const focusPrompt = useCallback((e) => {
        if (e.target.closest('a, button')) return;
        if (window.getSelection()?.toString()) return;
        inputRef.current?.focus();
    }, []);

    const copyTimerRef = useRef(null);
    const copyValue = useCallback((value, index) => {
        navigator.clipboard?.writeText(value).catch(() => { /* clipboard blocked — the text is still on screen */ });
        setCopiedIndex(index);
        clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopiedIndex(null), 2000);
    }, []);

    useEffect(() => () => clearTimeout(copyTimerRef.current), []);

    /* Any command the visitor runs should scroll its own output into view. */
    const runCommand = useCallback((cmd) => {
        if (!booted) return;
        stickToBottomRef.current = true;
        setLines((prev) => [
            ...prev,
            { type: 'input', text: `$ ${cmd}` },
            ...COMMANDS[cmd](),
        ]);
    }, [booted]);

    /* ── Enter adventure mode ── */
    const enterAdventure = () => {
        const state = createGameState();
        stickToBottomRef.current = true;
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

        stickToBottomRef.current = true;

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
        <section id="lab" className="w-full">
            <div className="max-w-3xl mx-auto w-full" ref={terminalRef}>
                <SectionHeading
                    label="The Lab"
                    title="Talk to the Terminal"
                    subtitle="Find my contact info, or type explore to enter a text adventure built into this site."
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
                        onScroll={handleScroll}
                        className="p-5 h-80 overflow-y-auto overflow-x-hidden font-mono text-sm space-y-1"
                        onClick={focusPrompt}
                    >
                        {/* Output region — announced as it grows */}
                        <div
                            role="log"
                            aria-live="polite"
                            aria-relevant="additions text"
                            aria-label="Terminal output"
                            className="space-y-1"
                        >
                        {/* Boot-up typing animation */}
                        {!booted && bootText && (
                            <div className="text-accent">
                                {bootText}
                                <motion.span
                                    aria-hidden="true"
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
                                    {line.href ? (
                                        <a
                                            href={line.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline underline-offset-2 hover:opacity-80 transition-opacity duration-150 cursor-pointer"
                                        >
                                            {line.text}
                                        </a>
                                    ) : line.action === 'copy' ? (
                                        <button
                                            type="button"
                                            onClick={() => copyValue(line.value, i)}
                                            className="underline underline-offset-2 hover:opacity-80 transition-opacity duration-150 cursor-pointer text-left"
                                        >
                                            {line.text}
                                            {copiedIndex === i && (
                                                <span className="ml-2 text-accent text-xs no-underline">✓ copied</span>
                                            )}
                                        </button>
                                    ) : (
                                        line.text
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Input line — only show after boot */}
                        {booted && (
                            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                                <span aria-hidden="true" className={adventureMode ? 'text-emerald-400' : 'text-accent'}>
                                    {promptChar}
                                </span>
                                <label htmlFor={inputId} className="sr-only">
                                    {adventureMode
                                        ? 'Adventure command — try look, go, take, map or help'
                                        : "Terminal command — type help to list commands"}
                                </label>
                                <input
                                    id={inputId}
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent outline-none text-text caret-accent font-mono text-sm"
                                    placeholder={
                                        adventureMode
                                            ? 'look, go, interact, take, map, help...'
                                            : "Type a command (try 'help')"
                                    }
                                    autoComplete="off"
                                    spellCheck={false}
                                    aria-describedby={hintId}
                                />
                                <motion.span
                                    aria-hidden="true"
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

                {/* Discoverability hint — the command list isn't obvious otherwise */}
                <p id={hintId} className="mt-4 text-center text-[11px] font-mono text-text-dim">
                    {adventureMode
                        ? 'Try look, go <direction>, take, map, or help. Type exit to leave.'
                        : <>Type <span className="text-accent">help</span> for every command, or use a shortcut below.</>}
                </p>

                {/* Quick actions below terminal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex flex-wrap justify-center gap-3"
                >
                    {!adventureMode && (
                        <>
                            <button
                                type="button"
                                onClick={() => runCommand('help')}
                                className="px-3 py-1.5 rounded-lg bg-surface-light border border-border text-text-dim text-xs font-mono hover:border-accent/30 hover:text-accent transition-all duration-200 min-h-[44px]"
                            >
                                help
                            </button>
                            {['contact --email', 'contact --github', 'contact --linkedin'].map(
                                (cmd) => (
                                    <button
                                        key={cmd}
                                        type="button"
                                        onClick={() => runCommand(cmd)}
                                        className="px-3 py-1.5 rounded-lg bg-surface-light border border-border text-text-dim text-xs font-mono hover:border-accent/30 hover:text-accent transition-all duration-200 min-h-[44px]"
                                    >
                                        {cmd}
                                    </button>
                                )
                            )}
                            <button
                                type="button"
                                onClick={() => runCommand('resume')}
                                className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/25 text-accent text-xs font-mono hover:bg-accent/20 hover:border-accent/40 transition-all duration-200 min-h-[44px]"
                            >
                                resume
                            </button>
                        </>
                    )}

                    {/* Explore / adventure button — always visible */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!booted) return;
                            if (adventureMode) {
                                // Already in adventure mode — run 'map'
                                if (gameState) {
                                    stickToBottomRef.current = true;
                                    const inputLine = { type: 'input', text: '⚔ map' };
                                    const { newState, output } = processCommand(gameState, 'map');
                                    setGameState(newState);
                                    setLines((prev) => [...prev, inputLine, ...output]);
                                }
                            } else {
                                enterAdventure();
                            }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 flex items-center gap-1.5 min-h-[44px] ${adventureMode
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
