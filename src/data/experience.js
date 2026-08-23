import { Briefcase } from 'lucide-react';

// `skills` entries are canonical names from `./skills.js` — used to cross-link
// this timeline with the Toolkit grid. `stack` stays free-text for display.
export const experience = [
    {
        icon: Briefcase,
        title: 'Velox Systems',
        subtitle: 'Software Engineer',
        date: 'Jul 2026 – Present',
        location: 'Toronto, ON',
        current: true,
        description:
            "Sole developer on the rebuild of a landscaping contractor's production workspace — migrating a live safety-compliance app onto a FastAPI/Postgres backend and cutting authentication from Supabase over to Zitadel OIDC, all behind a zero-error type and lint gate. Also shipped a route-planning module that turns a 4,756-tree municipal registry into truck-days in driving order and syncs offline crew completions back to the office, retiring a 95-file legacy planner.",
        stack: ['FastAPI', 'PostgreSQL', 'Zitadel OIDC', 'TypeScript'],
        skills: ['FastAPI', 'PostgreSQL', 'Zitadel', 'TypeScript', 'OAuth 2.0 / OIDC', 'Supabase'],
        type: 'experience',
    },
];
