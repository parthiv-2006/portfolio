const ITEMS = [
    'Full-Stack', 'AI Agents', 'Systems', 'Product Sense',
    'Model Context Protocol', 'TypeScript', 'Python',
];

export default function Marquee() {
    const content = ITEMS.flatMap((item) => [
        <span key={`t-${item}`} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>{item}</span>,
        <span key={`s-${item}`} className="text-accent">✦</span>,
    ]);

    return (
        <div
            className="overflow-hidden border-t border-b border-white/[0.06] py-5"
            style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
            }}
        >
            <div
                className="flex gap-11 w-max text-text-muted whitespace-nowrap"
                style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.3rem)',
                    animation: 'marquee 28s linear infinite',
                }}
            >
                {/* doubled for seamless loop */}
                {content}
                {content}
            </div>
        </div>
    );
}
