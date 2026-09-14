import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiCplusplus,
    SiReact,
    SiNodedotjs,
    SiExpress,
    SiNextdotjs,
    SiMongodb,
    SiPostgresql,
    SiRedux,
    SiTailwindcss,
    SiGit,
    SiDocker,
    SiGithubactions,
    SiWebauthn,
    SiFastapi,
    SiFramer,
    SiVite,
    SiOpenai,
    SiGoogle,
    SiDart,
    SiFlutter,
    SiSupabase,
    SiStripe,
    SiJira,
    SiAnthropic,
    SiPytest,
} from 'react-icons/si';
import { FaJava, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { VscDatabase } from 'react-icons/vsc';
import { Brain, Cpu, Zap, Shield, Code2, Plug, Search, KeyRound } from 'lucide-react';

export const skills = [
    // ── Languages ──
    { name: 'Python', icon: SiPython, category: 'Languages' },
    { name: 'JavaScript', icon: SiJavascript, category: 'Languages' },
    { name: 'TypeScript', icon: SiTypescript, category: 'Languages' },
    { name: 'Dart', icon: SiDart, category: 'Languages' },
    { name: 'Java', icon: FaJava, category: 'Languages' },
    { name: 'C/C++', icon: SiCplusplus, category: 'Languages' },
    { name: 'SQL', icon: VscDatabase, category: 'Languages' },
    { name: 'HTML', icon: FaHtml5, category: 'Languages' },
    { name: 'CSS', icon: FaCss3Alt, category: 'Languages' },

    // ── Frameworks ──
    { name: 'Next.js', icon: SiNextdotjs, category: 'Frameworks' },
    { name: 'React', icon: SiReact, category: 'Frameworks' },
    { name: 'Node.js', icon: SiNodedotjs, category: 'Frameworks' },
    { name: 'FastAPI', icon: SiFastapi, category: 'Frameworks' },
    { name: 'Express.js', icon: SiExpress, category: 'Frameworks' },
    { name: 'Flutter', icon: SiFlutter, category: 'Frameworks' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'Frameworks' },
    { name: 'LlamaIndex', icon: Brain, category: 'Frameworks' },
    { name: 'Zustand', icon: SiReact, category: 'Frameworks' },
    { name: 'Redux', icon: SiRedux, category: 'Frameworks' },
    { name: 'Framer Motion', icon: SiFramer, category: 'Frameworks' },
    { name: 'Vite', icon: SiVite, category: 'Frameworks' },
    { name: 'pytest', icon: SiPytest, category: 'Frameworks' },

    // ── AI Tools ──
    { name: 'Claude Code', icon: SiAnthropic, category: 'AI Tools' },
    { name: 'Claude API', icon: SiAnthropic, category: 'AI Tools' },
    { name: 'Model Context Protocol', icon: Plug, category: 'AI Tools' },
    { name: 'RAG', icon: Search, category: 'AI Tools' },
    { name: 'Google Gemini', icon: SiGoogle, category: 'AI Tools' },
    { name: 'Cursor', icon: Cpu, category: 'AI Tools' },
    { name: 'Antigravity', icon: SiGoogle, category: 'AI Tools' },
    { name: 'OpenAI Codex', icon: SiOpenai, category: 'AI Tools' },
    { name: 'VS Code', icon: Code2, category: 'AI Tools' },

    // ── Dev Tools & Concepts ──
    { name: 'Git/GitHub', icon: SiGit, category: 'Dev Tools & Concepts' },
    { name: 'PostgreSQL', icon: SiPostgresql, category: 'Dev Tools & Concepts' },
    { name: 'Supabase', icon: SiSupabase, category: 'Dev Tools & Concepts' },
    { name: 'REST APIs', icon: VscDatabase, category: 'Dev Tools & Concepts' },
    { name: 'CI/CD', icon: SiGithubactions, category: 'Dev Tools & Concepts' },
    { name: 'Docker', icon: SiDocker, category: 'Dev Tools & Concepts' },
    { name: 'Stripe', icon: SiStripe, category: 'Dev Tools & Concepts' },
    { name: 'MongoDB', icon: SiMongodb, category: 'Dev Tools & Concepts' },
    { name: 'OAuth 2.0 / OIDC', icon: Shield, category: 'Dev Tools & Concepts' },
    { name: 'WebAuthn', icon: SiWebauthn, category: 'Dev Tools & Concepts' },
    { name: 'Zitadel', icon: KeyRound, category: 'Dev Tools & Concepts' },
    { name: 'SSE', icon: Zap, category: 'Dev Tools & Concepts' },
    { name: 'Jira', icon: SiJira, category: 'Dev Tools & Concepts' },
];

export const skillCategories = ['Languages', 'Frameworks', 'AI Tools', 'Dev Tools & Concepts'];
