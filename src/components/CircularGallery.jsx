import React, { useState, useEffect, useRef } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const CircularGallery = React.forwardRef(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, onItemClick, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
      const autoRotate = () => {
        setRotation(prev => prev + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.id}
                role="button"
                aria-label={item.title}
                tabIndex={0}
                onClick={() => onItemClick?.(item.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemClick?.(item.id)}
                className="absolute w-[360px] h-[220px] cursor-pointer"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-180px',
                  marginTop: '-110px',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden group border border-white/10 bg-[#0d0d0c] hover:border-accent/40 transition-colors duration-300">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full px-4 py-3">
                    <h2 className="text-base font-bold text-white leading-tight">{item.title}</h2>
                    <p className="text-xs text-white/70 mt-0.5 leading-snug">{item.tagline}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
