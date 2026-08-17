const ITEMS = [
    'Full-Stack', 'AI Agents', 'Systems', 'Product Sense',
    'Model Context Protocol', 'TypeScript', 'Python',
];

function Track({ duplicate }) {
    return (
        <div
            className="flex gap-11 shrink-0 whitespace-nowrap pr-11"
            aria-hidden={duplicate ? 'true' : undefined}
        >
            {ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-11">
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                        {item}
                    </span>
                    <span className="text-accent" aria-hidden="true">✦</span>
                </span>
            ))}
        </div>
    );
}

export default function Marquee() {
    return (
        <div
            className="pause-on-hover overflow-hidden border-t border-b border-border py-5"
            style={{
                // Fade the ends instead of slicing items off at the viewport edge.
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
            }}
        >
            <div
                data-marquee-track
                className="flex w-max text-text-muted"
                style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.3rem)',
                    animation: 'marquee 28s linear infinite',
                }}
            >
                {/* Doubled so the -50% translate loops seamlessly; the copy is
                    hidden from assistive tech to avoid reading the list twice. */}
                <Track />
                <Track duplicate />
            </div>
        </div>
    );
}
