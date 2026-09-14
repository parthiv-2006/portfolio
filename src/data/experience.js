import { GraduationCap, Briefcase, Award, Rocket, Code2, Terminal as TerminalIcon } from 'lucide-react';

// `skills` entries are canonical names from `./skills.js` — used to cross-link
// this timeline with the Toolkit grid. `stack` stays free-text for display.
export const experience = [
    {
        icon: Briefcase,
        title: 'Velox Systems',
        subtitle: 'Software Engineer',
        date: 'Jul 2026 – Sep 2026',
        location: 'Toronto, ON',
        description:
            "Sole developer on the rebuild of a landscaping contractor's production workspace — migrated a live safety-compliance app onto a FastAPI/Postgres backend and cut authentication over from Supabase to Zitadel OIDC, all behind a zero-error type and lint gate. Also shipped a route-planning module that turns a 4,756-tree municipal registry into truck-days in driving order and syncs offline crew completions back to the office, retiring a 95-file legacy planner.",
        stack: ['FastAPI', 'PostgreSQL', 'Zitadel OIDC', 'TypeScript'],
        skills: ['FastAPI', 'PostgreSQL', 'Zitadel', 'TypeScript', 'OAuth 2.0 / OIDC', 'Supabase'],
        type: 'experience',
    },
    {
        icon: Code2,
        title: 'Applied Optimal Inc.',
        subtitle: 'Full-Stack Developer, Contract',
        date: 'Jul 2026 – Sep 2026',
        location: 'Remote',
        description:
            'Built a 7-day trial to paid subscription system with member-count fee tiers, checkout, a reminder job, and server-side route lockout — 4 migrations and 130 automated tests. Worked a Jira ticket and peer-review loop on a 3-developer team, resolving spec gaps with a non-technical client across twice-weekly syncs, restoring blocking flake8 and black CI, and clearing 77 Flutter analyzer warnings.',
        stack: ['FastAPI', 'PostgreSQL', 'Stripe', 'Flutter Web', 'Jira'],
        skills: ['FastAPI', 'PostgreSQL', 'Stripe', 'Flutter', 'Jira'],
        type: 'experience',
    },
    {
        icon: TerminalIcon,
        title: 'GenLedge',
        subtitle: 'Software Developer, Contract',
        date: 'Mar 2026 – May 2026',
        location: 'Remote',
        description:
            'Built a Stripe MCP server (TypeScript, 12 tools) covering charges, invoices, subscriptions, and disputes, enabling AI accounting agents to query live payment data via the Model Context Protocol. Also built a Stripe webhook handler that verified event authenticity and routed 12 event types to specialized AI employee roles, generating real-time general-ledger entries automatically.',
        stack: ['TypeScript', 'MCP', 'Stripe', 'Webhooks'],
        skills: ['TypeScript', 'Model Context Protocol', 'Stripe'],
        type: 'experience',
    },
    {
        icon: Rocket,
        title: 'Outamation',
        subtitle: 'AI and Automation Extern',
        date: 'May 2025 – Aug 2025',
        location: 'Remote',
        description:
            'Built NLP and Computer Vision (OCR) pipelines to classify and extract fields from mortgage documents, replacing a manual data-entry step on the program’s sample document set. Improved retrieval relevance by ~25% on a benchmark query set by tuning a Retrieval-Augmented Generation (RAG) system in LlamaIndex, iterating on chunking strategy and custom vector embeddings.',
        stack: ['Python', 'LlamaIndex', 'RAG', 'OCR'],
        skills: ['Python', 'LlamaIndex', 'RAG'],
        type: 'experience',
    },
    {
        icon: GraduationCap,
        title: 'University of Toronto, St. George',
        subtitle: 'Computer Science Specialist, Co-op',
        date: 'Sept 2024 – Apr 2028',
        location: 'Toronto, ON · CGPA 3.6/4.0',
        description:
            "Pursuing a Bachelor of Computer Science. Dean's List Scholar in 2024-25 and 2025-26. Coursework includes Data Structures & Analysis, Software Design, Systems Programming, Computer Organization, Theory of Computation, and Linear Algebra.",
        skills: [],
        type: 'education',
    },
    {
        icon: Briefcase,
        title: 'Chester-Hill Solutions',
        subtitle: 'Software QA Tester, Intern',
        date: 'June 2024 – Nov 2024',
        location: 'Remote',
        description:
            'Wrote automated test scripts covering 50+ user flows across multiple environments, cutting the repetitive manual regression passes the team ran each release cycle. Investigated and documented defects through API response analysis and root-cause write-ups, giving developers clearer repro steps to turn around fixes faster.',
        stack: ['Test Automation', 'REST APIs'],
        skills: ['REST APIs'],
        type: 'experience',
    },
    {
        icon: Award,
        title: 'Ontario Liberal Party',
        subtitle: 'Frontend Developer',
        date: 'May 2023 – Sept 2023',
        location: 'Toronto, ON',
        description:
            'Built React components and optimized Redux state management. Refactored legacy CSS into modular Sass and enforced WCAG 2.1 compliance, improving page performance and accessibility scores.',
        stack: ['React', 'Redux', 'Sass', 'WCAG 2.1'],
        skills: ['React', 'Redux'],
        type: 'experience',
    },
];
