/**
 * adventureEngine.js
 * ──────────────────
 * Pure-logic text-adventure engine. No React dependency.
 * Each room maps to a real portfolio section, surfacing data through narrative.
 *
 * Commands: look, go, interact, take, inventory, map, help, exit
 */

/* ── ASCII Art ── */

const LOBBY_ART = [
    '          ╔══════════════════════════╗',
    '          ║   ⚔  THE PORTFOLIO REALM  ║',
    '          ║      ~ enter at will ~    ║',
    '          ╚══════════════════════════╝',
];

const MAP_TEMPLATE = [
    '                ┌─────────┐',
    '                │  Tower   │',
    '                └────┬────┘',
    '                     │',
    '  ┌─────────┐  ┌────┴─────┐  ┌──────────┐',
    '  │ Library  ├──┤  Lobby   ├──┤ Workshop  │',
    '  └─────────┘  └────┬─────┘  └──────────┘',
    '                     │',
    '                ┌────┴────┐',
    '                │  Forge   │',
    '                └────┬────┘',
    '                     │',
    '                ┌────┴────┐',
    '                │  Tavern  │',
    '                └─────────┘',
];

const CONGRATS_ART = [
    '',
    '  ★ ═══════════════════════════════════ ★',
    '  ║                                      ║',
    '  ║   🏆  ALL ARTIFACTS COLLECTED!  🏆    ║',
    '  ║                                      ║',
    '  ║   You have explored every corner     ║',
    '  ║   of Parthiv\'s world. You are now    ║',
    '  ║   officially a Portfolio Sage.        ║',
    '  ║                                      ║',
    '  ║   Secret code: HIRE_ME_2026          ║',
    '  ║                                      ║',
    '  ★ ═══════════════════════════════════ ★',
    '',
];

/* ── Room Definitions ── */

const ROOMS = {
    lobby: {
        id: 'lobby',
        name: 'The Lobby',
        description: [
            '> You stand in a grand atrium bathed in soft amber light.',
            '> A holographic directory floats before you, listing the wings of this realm.',
            '> Corridors branch in every direction — each humming with a different energy.',
            '',
            '  Exits: workshop (east) · library (west) · forge (south) · tower (north)',
            '',
            '  💡 Tip: Type "go workshop" to move, "look" to re-read, or "map" to see the layout.',
        ],
        exits: { workshop: 'workshop', library: 'library', forge: 'forge', tower: 'tower' },
        objects: {
            directory: [
                '> The holographic directory flickers as you touch it.',
                '> It reads:',
                '',
                '  "Welcome, traveler. This realm was constructed by Parthiv Paul,',
                '   a full-stack engineer who believes the best software feels',
                '   like magic. Explore each wing to learn more."',
            ],
        },
        item: {
            id: 'compass',
            name: '🧭 Enchanted Compass',
            found: false,
            hint: '> You notice a faint glimmer behind the directory...',
            description: [
                '> You reach behind the holographic directory and find an old compass.',
                '> Its needle doesn\'t point north — it points toward interesting code.',
                '',
                '  ✦ Acquired: 🧭 Enchanted Compass',
            ],
        },
    },

    workshop: {
        id: 'workshop',
        name: 'The Workshop',
        description: [
            '> You enter a sprawling workshop. Workbenches line the walls,',
            '> each holding a different project in various stages of completion.',
            '> Three projects glow under spotlights, clearly the pride of this space.',
            '',
            '  Objects: anima · macromatch · uofthacks',
            '  Exits: lobby (west)',
        ],
        exits: { lobby: 'lobby' },
        objects: {
            anima: [
                '> You approach the workbench labeled "Anima".',
                '> A gamified habit-tracking app hums on the screen — characters level up,',
                '> XP bars fill, and leaderboards update in real-time.',
                '',
                '  📋 Stack: React · Node.js · Express · MongoDB · Framer Motion · JWT Auth',
                '  🎯 Role: Full-Stack · 2025',
                '',
                '  "Transforms daily routines into engaging RPG quests.',
                '   Users earn XP, level up avatars, and compete on leaderboards."',
            ],
            macromatch: [
                '> The "MacroMatch" workbench displays a sleek nutrition dashboard.',
                '> Charts flow with macro data, and an AI engine suggests meals.',
                '',
                '  📋 Stack: React · Python · Flask · PostgreSQL · REST API · Chart.js',
                '  🎯 Role: Full-Stack · 2025',
                '',
                '  "An intelligent nutrition platform with AI-powered meal suggestions',
                '   based on user preferences and fitness objectives."',
            ],
            uofthacks: [
                '> A chaotic but brilliant setup — sticky notes, energy drinks, and a timer',
                '> frozen at 35:59:59. The UofTHacks submission station.',
                '',
                '  📋 Stack: React · Node.js · Socket.io · MongoDB · Tailwind CSS',
                '  🎯 Role: Frontend Lead · 2025',
                '',
                '  "Built in 36 hours. Rapid prototyping under extreme time pressure',
                '   with a cross-functional team of talented engineers."',
            ],
        },
        item: {
            id: 'blueprint',
            name: '📜 Architect\'s Blueprint',
            found: false,
            hint: '> A rolled-up scroll peeks out from under the Anima workbench...',
            description: [
                '> You pull the scroll free. It\'s a detailed system architecture diagram',
                '> showing clean separation of concerns — controllers, services, models.',
                '> Elegant.',
                '',
                '  ✦ Acquired: 📜 Architect\'s Blueprint',
            ],
        },
    },

    library: {
        id: 'library',
        name: 'The Library',
        description: [
            '> Towering shelves of knowledge surround you. Academic scrolls and',
            '> achievement certificates hang in gilded frames along the walls.',
            '> A large desk in the center holds records of the journey so far.',
            '',
            '  Objects: degree · awards · saf-competition',
            '  Exits: lobby (east)',
        ],
        exits: { lobby: 'lobby' },
        objects: {
            degree: [
                '> A glowing scroll on the main desk reads:',
                '',
                '  🎓 Computer Science Specialist Co-op Program',
                '     University of Toronto, St. George',
                '     2024 – 2028',
                '',
                '  "Advanced coursework in Data Structures & Analysis, Software Design,',
                '   Systems Programming, and Theory of Computation. CGPA: 3.70/4.00"',
            ],
            awards: [
                '> Gilded certificates on the wall catch your eye:',
                '',
                '  🏅 Dean\'s List Scholar — 2024-2025',
                '  🏅 J.S. Mclean Scholarship',
                '     "Recognized for academic excellence at the University of Toronto."',
            ],
            'saf-competition': [
                '> A silver trophy sits proudly on a pedestal.',
                '',
                '  🏆 2nd Place - National Waterloo SAF Financial Literacy Competition — 2023',
                '     "Demonstrated exceptional financial acumen on a national stage."',
            ],
        },
        item: {
            id: 'quill',
            name: '🪶 Scholar\'s Quill',
            found: false,
            hint: '> A feathered quill rests in an ornate inkwell on the desk...',
            description: [
                '> You pick up the quill. It\'s surprisingly light — as if it\'s written',
                '> a thousand algorithms and still has stories left to tell.',
                '',
                '  ✦ Acquired: 🪶 Scholar\'s Quill',
            ],
        },
    },

    forge: {
        id: 'forge',
        name: 'The Forge',
        description: [
            '> Heat radiates from this room. The walls are lined with tools',
            '> and weapons of the trade — programming languages and frameworks',
            '> forged into gleaming instruments, each battle-tested.',
            '',
            '  Objects: languages · frameworks · databases · devtools',
            '  Exits: lobby (north) · tavern (south)',
        ],
        exits: { lobby: 'lobby', tavern: 'tavern' },
        objects: {
            languages: [
                '> You examine the language rack. The primary instruments gleam:',
                '',
                '  ⚡ Python               — the first language, learned at 14',
                '  ⚡ TypeScript / JS      — the web\'s backbone',
                '  ⚡ Java                 — enterprise-grade stability',
                '  ⚡ C/C++                — systems-level power',
                '  ⚡ HTML/CSS/SQL         — the essential foundations',
            ],
            frameworks: [
                '> The framework forge glows white-hot:',
                '',
                '  🔨 Next.js / React   ★ core   — UI architecture of choice',
                '  🔨 Node.js / Express ★ core   — server-side backbone',
                '  🔨 Tailwind CSS               — rapid styling',
                '  🔨 Redux / Zustand            — state management',
            ],
            databases: [
                '> Crystalline data structures float in suspension:',
                '',
                '  💎 MongoDB     ★ core   — document store of choice',
                '  💎 PostgreSQL           — relational powerhouse',
            ],
            devtools: [
                '> A workbench of well-worn tools:',
                '',
                '  🔧 Git & GitHub         — version control mastery',
                '  🔧 Docker & CI/CD       — containerized automated deployments',
                '  🔧 WebAuthn             — passkey implementations',
                '  🔧 REST APIs & Agile    — architecture and workflow',
                '  🔧 PyMuPDF              — document processing',
            ],
        },
        item: {
            id: 'hammer',
            name: '🔨 Code Hammer',
            found: false,
            hint: '> A miniature golden hammer sits atop the framework forge...',
            description: [
                '> You lift the Code Hammer. It vibrates with the energy of',
                '> a thousand successful builds. +10 to debugging.',
                '',
                '  ✦ Acquired: 🔨 Code Hammer',
            ],
        },
    },

    tavern: {
        id: 'tavern',
        name: 'The Tavern',
        description: [
            '> The air smells like cold brew and vinyl. Lo-fi beats drift',
            '> from somewhere. A cozy space where the code stops and the',
            '> human behind the screen lives.',
            '',
            '  Objects: barkeep · jukebox · arcade · bulletin-board',
            '  Exits: forge (north)',
        ],
        exits: { forge: 'forge' },
        objects: {
            barkeep: [
                '> The barkeep slides you a cold brew and leans in:',
                '',
                '  "Parthiv? Great kid. Started coding at 14 — built a janky',
                '   Python calculator and thought he was basically a hacker.',
                '   Now he\'s a CS Specialist at UofT. Still fueled by cold brew.',
                '   Kid cares about every pixel AND every millisecond."',
            ],
            jukebox: [
                '> You flip through the jukebox selections:',
                '',
                '  🎵 Now Playing: Synthwave & Jazz',
                '  🎵 Coding Playlist: Lo-fi Beats',
                '  🎵 Late Night: Ambient Electronica',
                '',
                '  The perfect soundtrack for a 2 AM coding session.',
            ],
            arcade: [
                '> An old arcade cabinet glows in the corner:',
                '',
                '  🕹️  Side Quest: Game dev with Unity',
                '     "When the web stack gets boring, there\'s always',
                '      a game prototype waiting to be built."',
            ],
            'bulletin-board': [
                '> A cork bulletin board with pinned notes:',
                '',
                '  📌 Currently exploring: New coffee spots around Toronto',
                '  📌 Guilty pleasure: Dissecting the UI of apps I admire',
                '  📌 Philosophy: "The best software is built by people',
                '     who care about every pixel and every millisecond."',
            ],
        },
        item: {
            id: 'mug',
            name: '☕ Bottomless Coffee Mug',
            found: false,
            hint: '> A mug behind the counter has your name on it... literally.',
            description: [
                '> The mug reads "Visitor #∞ — Thanks for exploring."',
                '> It never seems to empty. Infinite caffeine. Infinite curiosity.',
                '',
                '  ✦ Acquired: ☕ Bottomless Coffee Mug',
            ],
        },
    },

    tower: {
        id: 'tower',
        name: 'The Tower',
        description: [
            '> You climb the spiral staircase to a room at the top.',
            '> A raven perches by the window, a scroll tied to its leg.',
            '> This is where messages are sent — the communication tower.',
            '',
            '  Objects: raven · scroll · mirror',
            '  Exits: lobby (south)',
        ],
        exits: { lobby: 'lobby' },
        objects: {
            raven: [
                '> The raven caws and unfurls the scroll on its leg:',
                '',
                '  📧 Email: parthiv.paul@mail.utoronto.ca',
                '  🔗 GitHub: github.com/parthiv-2006',
                '  🔗 LinkedIn: linkedin.com/in/parthiv-paul',
                '',
                '  "Send a raven. Or, you know, an email. Both work."',
            ],
            scroll: [
                '> A resume scroll sits on the desk, ready for download:',
                '',
                '  📄 Parthiv_Paul_Resume.pdf',
                '     "Full-stack engineer · CS @ UofT · Dean\'s List"',
                '',
                '  💡 Type "exit" to return to the terminal and run "resume" to download it.',
            ],
            mirror: [
                '> You gaze into the mirror. It ripples and shows... you.',
                '> Below your reflection, text appears:',
                '',
                '  "Thanks for visiting. If you\'ve made it this far,',
                '   you\'re exactly the kind of curious person I\'d love',
                '   to work with. Let\'s build something great."',
                '',
                '                              — Parthiv',
            ],
        },
        item: null, // Tower has no collectible — the mirror message IS the reward
    },
};

/* ── Total collectible count (rooms that have items) ── */
const TOTAL_ITEMS = Object.values(ROOMS).filter((r) => r.item).length;

/* ── State Factory ── */

export function createGameState() {
    return {
        currentRoom: 'lobby',
        inventory: [],
        visited: new Set(['lobby']),
        itemsFound: {},
    };
}

/* ── Command Processor (pure function) ── */

export function processCommand(state, rawInput) {
    const input = rawInput.trim().toLowerCase();
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(' ');
    const room = ROOMS[state.currentRoom];

    // Clone state for immutability
    const newState = {
        ...state,
        visited: new Set(state.visited),
        inventory: [...state.inventory],
        itemsFound: { ...state.itemsFound },
    };

    let output = [];
    let shouldExit = false;

    switch (cmd) {
        /* ── LOOK ── */
        case 'look':
        case 'l': {
            output = [
                { type: 'system', text: `━━ ${room.name} ━━` },
                ...room.description.map((t) => ({ type: t.startsWith('>') ? 'info' : 'dim', text: t })),
            ];

            // Show item hint if present and not yet taken
            if (room.item && !newState.itemsFound[room.item.id]) {
                output.push({ type: 'dim', text: '' });
                output.push({ type: 'success', text: room.item.hint });
            }
            break;
        }

        /* ── GO ── */
        case 'go':
        case 'move':
        case 'walk': {
            if (!arg) {
                output = [{ type: 'error', text: '> Go where? Try: go <room name>' }];
                const exitNames = Object.keys(room.exits).join(', ');
                output.push({ type: 'dim', text: `  Available exits: ${exitNames}` });
                break;
            }

            const targetKey = Object.keys(room.exits).find(
                (k) => k === arg || ROOMS[room.exits[k]]?.name.toLowerCase().includes(arg)
            );

            if (!targetKey) {
                output = [{ type: 'error', text: `> There's no path to "${arg}" from here.` }];
                const exitNames = Object.keys(room.exits).join(', ');
                output.push({ type: 'dim', text: `  Available exits: ${exitNames}` });
                break;
            }

            const destId = room.exits[targetKey];
            const dest = ROOMS[destId];
            newState.currentRoom = destId;
            const firstVisit = !newState.visited.has(destId);
            newState.visited.add(destId);

            output = [
                { type: 'dim', text: `> You walk toward the ${dest.name}...` },
                { type: 'dim', text: '' },
                { type: 'system', text: `━━ ${dest.name} ${firstVisit ? '(new!)' : ''} ━━` },
                ...dest.description.map((t) => ({ type: t.startsWith('>') ? 'info' : 'dim', text: t })),
            ];

            // Show item hint on first visit
            if (firstVisit && dest.item && !newState.itemsFound[dest.item.id]) {
                output.push({ type: 'dim', text: '' });
                output.push({ type: 'success', text: dest.item.hint });
            }
            break;
        }

        /* ── INTERACT ── */
        case 'interact':
        case 'examine':
        case 'inspect':
        case 'use': {
            if (!arg) {
                const objectNames = Object.keys(room.objects).join(', ');
                output = [
                    { type: 'dim', text: '> You look around for something to interact with.' },
                    { type: 'info', text: `  Objects here: ${objectNames}` },
                    { type: 'dim', text: '  Try: interact <object name>' },
                ];
                break;
            }

            const objKey = Object.keys(room.objects).find(
                (k) => k === arg || k.includes(arg)
            );

            if (!objKey) {
                output = [{ type: 'error', text: `> You don't see "${arg}" here.` }];
                const objectNames = Object.keys(room.objects).join(', ');
                output.push({ type: 'dim', text: `  Objects here: ${objectNames}` });
                break;
            }

            output = room.objects[objKey].map((t) => ({
                type: t.startsWith('>') ? 'info' : t.startsWith('  ✦') ? 'success' : 'dim',
                text: t,
            }));
            break;
        }

        /* ── TAKE ── */
        case 'take':
        case 'grab':
        case 'pickup':
        case 'pick': {
            if (!room.item) {
                output = [{ type: 'dim', text: '> There\'s nothing to pick up here.' }];
                break;
            }

            if (newState.itemsFound[room.item.id]) {
                output = [{ type: 'dim', text: `> You already picked up the ${room.item.name}.` }];
                break;
            }

            // Take the item
            newState.itemsFound[room.item.id] = true;
            newState.inventory.push(room.item);

            output = room.item.description.map((t) => ({
                type: t.startsWith('  ✦') ? 'success' : t.startsWith('>') ? 'info' : 'dim',
                text: t,
            }));

            // Check if all items collected
            const collectedCount = Object.keys(newState.itemsFound).length;
            if (collectedCount >= TOTAL_ITEMS) {
                output.push({ type: 'dim', text: '' });
                output.push(...CONGRATS_ART.map((t) => ({ type: 'success', text: t })));
            } else {
                output.push({ type: 'dim', text: '' });
                output.push({
                    type: 'dim',
                    text: `  Artifacts: ${collectedCount}/${TOTAL_ITEMS} collected`,
                });
            }
            break;
        }

        /* ── INVENTORY ── */
        case 'inventory':
        case 'inv':
        case 'i': {
            if (newState.inventory.length === 0) {
                output = [
                    { type: 'dim', text: '> Your bag is empty. Explore rooms and "take" items you find.' },
                ];
            } else {
                output = [
                    { type: 'system', text: '━━ Inventory ━━' },
                    ...newState.inventory.map((item) => ({
                        type: 'info',
                        text: `  ${item.name}`,
                    })),
                    { type: 'dim', text: '' },
                    {
                        type: 'dim',
                        text: `  ${newState.inventory.length}/${TOTAL_ITEMS} artifacts collected`,
                    },
                ];
            }
            break;
        }

        /* ── MAP ── */
        case 'map':
        case 'm': {
            const currentName = room.name;
            const mapLines = MAP_TEMPLATE.map((line) => {
                // Highlight current room with markers
                for (const [, r] of Object.entries(ROOMS)) {
                    // Extract the short name from the room's map label
                    const shortName = r.id.charAt(0).toUpperCase() + r.id.slice(1);
                    // Capitalize for matching ("Lobby", "Workshop", etc.)
                    const capitalName =
                        shortName === 'Lobby'
                            ? 'Lobby'
                            : shortName.charAt(0).toUpperCase() + shortName.slice(1);

                    if (line.includes(capitalName) && r.name === currentName) {
                        return line.replace(capitalName, `»${capitalName}«`);
                    }
                }
                return line;
            });

            output = [
                { type: 'system', text: '━━ Realm Map ━━' },
                ...mapLines.map((t) => ({
                    type: t.includes('»') ? 'success' : 'dim',
                    text: t,
                })),
                { type: 'dim', text: '' },
                {
                    type: 'dim',
                    text: `  You are in: ${room.name}  ·  Rooms visited: ${newState.visited.size}/${Object.keys(ROOMS).length}`,
                },
            ];
            break;
        }

        /* ── HELP ── */
        case 'help':
        case 'h':
        case '?': {
            output = [
                { type: 'system', text: '━━ Adventure Commands ━━' },
                { type: 'info', text: '  look             Describe the current room' },
                { type: 'info', text: '  go <room>        Move to an adjacent room' },
                { type: 'info', text: '  interact <obj>   Examine an object' },
                { type: 'info', text: '  take             Pick up the room\'s artifact' },
                { type: 'info', text: '  inventory        View collected artifacts' },
                { type: 'info', text: '  map              Show the realm map' },
                { type: 'info', text: '  exit             Return to normal terminal' },
                { type: 'info', text: '  help             Show this menu' },
                { type: 'dim', text: '' },
                { type: 'dim', text: '  Aliases: l=look, m=map, i=inventory, h=help' },
            ];
            break;
        }

        /* ── EXIT ── */
        case 'exit':
        case 'quit':
        case 'q': {
            const collected = Object.keys(newState.itemsFound).length;
            output = [
                { type: 'dim', text: '' },
                { type: 'system', text: '> You step back through the portal into the terminal.' },
                {
                    type: 'dim',
                    text: `  Artifacts collected: ${collected}/${TOTAL_ITEMS}`,
                },
                { type: 'dim', text: '  Type "explore" to return anytime.' },
                { type: 'dim', text: '' },
            ];
            shouldExit = true;
            break;
        }

        /* ── UNKNOWN ── */
        default: {
            output = [
                { type: 'error', text: `> Unknown command: "${cmd}"` },
                { type: 'dim', text: '  Type "help" for available commands.' },
            ];
        }
    }

    return { newState, output, shouldExit };
}

/* ── Entry Message (shown when "explore" is first typed) ── */

export function getEntryMessage() {
    return [
        ...LOBBY_ART.map((t) => ({ type: 'success', text: t })),
        { type: 'dim', text: '' },
        { type: 'system', text: '━━ The Lobby ━━' },
        ...ROOMS.lobby.description.map((t) => ({
            type: t.startsWith('>') ? 'info' : 'dim',
            text: t,
        })),
        { type: 'dim', text: '' },
        { type: 'success', text: ROOMS.lobby.item.hint },
    ];
}
