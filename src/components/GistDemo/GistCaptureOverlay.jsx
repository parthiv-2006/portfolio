import React, { useEffect, useRef, useState } from 'react';

export function GistCaptureOverlay({ onCapture, onCancel }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const pos = { x: e.clientX, y: e.clientY };
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(startPos.x - currentPos.x);
    const height = Math.abs(startPos.y - currentPos.y);
    if (width > 5 && height > 5) onCapture({ x, y, width, height });
    else onCancel();
  };

  const selRect = {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(startPos.x - currentPos.x),
    height: Math.abs(startPos.y - currentPos.y),
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'oklch(0 0 0 / 0.55)',
        cursor: 'crosshair',
        zIndex: 40,
        userSelect: 'none',
      }}
    >
      {/* Instruction */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: isDragging ? 0 : 1,
        transition: 'opacity 150ms ease',
      }}>
        <div style={{
          background: 'oklch(0.16 0.004 120 / 0.92)',
          border: '1px solid oklch(0.75 0.11 150 / 0.35)',
          borderRadius: '10px',
          padding: '12px 20px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: 'oklch(0.95 0.005 95)', fontFamily: '"Inter", sans-serif' }}>
            Drag to select an area
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: 'oklch(0.42 0.008 95)', fontFamily: '"JetBrains Mono", monospace' }}>
            Esc to cancel
          </p>
        </div>
      </div>

      {/* Selection rectangle */}
      {isDragging && selRect.width > 2 && selRect.height > 2 && (
        <div
          style={{
            position: 'fixed',
            left: selRect.left,
            top: selRect.top,
            width: selRect.width,
            height: selRect.height,
            border: '2px solid oklch(0.75 0.11 150)',
            boxShadow: '0 0 0 1px oklch(0 0 0 / 0.5), inset 0 0 0 1px oklch(0 0 0 / 0.3)',
            background: 'oklch(0.75 0.11 150 / 0.08)',
            pointerEvents: 'none',
          }}
        >
          {/* Corner indicators */}
          {[['0%','0%'], ['100%','0%'], ['0%','100%'], ['100%','100%']].map(([l, t], i) => (
            <div key={i} style={{
              position: 'absolute', left: l, top: t,
              width: '6px', height: '6px',
              background: 'oklch(0.75 0.11 150)',
              transform: 'translate(-50%, -50%)',
              borderRadius: '1px',
            }} />
          ))}
          {/* Size label */}
          <div style={{
            position: 'absolute', bottom: '-22px', right: 0,
            fontSize: '10px', fontFamily: '"JetBrains Mono", monospace',
            color: 'oklch(0.75 0.11 150)',
            background: 'oklch(0.16 0.004 120 / 0.85)',
            padding: '1px 5px', borderRadius: '3px',
            whiteSpace: 'nowrap',
          }}>
            {Math.round(selRect.width)} × {Math.round(selRect.height)}
          </div>
        </div>
      )}
    </div>
  );
}
