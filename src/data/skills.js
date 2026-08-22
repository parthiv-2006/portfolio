import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiCplusplus,
    SiReact,
    SiNodedotjs,
    SiExpress,
    SiNextdotjs,
    SiRedux,
    SiTailwindcss,
    SiFramer,
    SiVite,
    SiDart,
    SiFlutter,
    SiPytest,
    SiFastapi,
    SiOpenai,
    SiGoogle,
    SiAnthropic,
} from 'react-icons/si';
import { FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { VscDatabase } from 'react-icons/vsc';
import { Brain, Cpu, Zap, Shield, Code2, Plug, Search, KeyRound } from 'lucide-react';

export const skills = [
    // ── Languages ──
    { name: 'Python', icon: SiPython, category: 'Languages', core: true },
    { name: 'JavaScript', icon: SiJavascript, category: 'Languages', core: true },
    { name: 'TypeScript', icon: SiTypescript, category: 'Languages', core: true },
    { name: 'Dart', icon: SiDart, category: 'Languages', core: false },
    { name: 'Java', icon: FaJava, category: 'Languages', core: false },
    { name: 'C/C++', icon: SiCplusplus, category: 'Languages', core: false },
    { name: 'SQL', icon: VscDatabase, category: 'Languages', core: false },
    { name: 'HTML', icon: FaHtml5, category: 'Languages', core: false },
    { name: 'CSS', icon: FaCss3Alt, category: 'Languages', core: false },

    // ── Frameworks ──
    { name: 'Next.js', icon: SiNextdotjs, category: 'Frameworks', core: true },
    { name: 'React', icon: SiReact, category: 'Frameworks', core: true },
    { name: 'Node.js', icon: SiNodedotjs, category: 'Frameworks', core: true },
    { name: 'FastAPI', icon: SiFastapi, category: 'Frameworks', core: true },
    { name: 'Express.js', icon: SiExpress, category: 'Frameworks', core: false },
    { name: 'Flutter', icon: SiFlutter, category: 'Frameworks', core: true },
    { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frameworks', core: true },
    { name: 'LlamaIndex', icon: Brain, category: 'Frameworks', core: false },
    { name: 'Zustand', icon: SiReact, category: 'Frameworks', core: false },
    { name: 'Redux', icon: SiRedux, category: 'Frameworks', core: false },
    { name: 'Framer Motion', icon: SiFramer, category: 'Frameworks', core: false },
    { name: 'Vite', icon: SiVite, category: 'Frameworks', core: false },
    { name: 'pytest', icon: SiPytest, category: 'Frameworks', core: false },

    // ── AI Tools ──
    { name: 'Claude Code', icon: SiAnthropic, category: 'AI Tools', core: true },
    { name: 'Claude API', icon: SiAnthropic, category: 'AI Tools', core: true },
    { name: 'Model Context Protocol', icon: Plug, category: 'AI Tools', core: true },
    { name: 'RAG', icon: Search, category: 'AI Tools', core: true },
    { name: 'Google Gemini', icon: SiGoogle, category: 'AI Tools', core: true },
    { name: 'Cursor', icon: Cpu, category: 'AI Tools', core: true },
    { name: 'Antigravity', icon: SiGoogle, category: 'AI Tools', core: false },
    { name: 'OpenAI Codex', icon: SiOpenai, category: 'AI Tools', core: false },
    { name: 'VS Code', icon: Code2, category: 'AI Tools', core: false },
];

export const skillCategories = ['Languages', 'Frameworks', 'AI Tools', 'Dev Tools & Concepts'];
