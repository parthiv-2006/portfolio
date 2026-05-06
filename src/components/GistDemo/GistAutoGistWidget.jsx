import React from 'react';

// Ghost UI ambient reading assistant — shows 3 key takeaways from the current viewport.
// Nearly invisible at rest; reveals on hover.

const ACCENT = '#10b981';

export function GistAutoGistWidget({ state, takeaways, onDismiss }) {
  const isPulsing = state === 'loading';

  return (
    <>
      <style>{`
        @keyframes agWidgetPulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px rgba(16,185,129,0.5); }
          50%       { opacity: 0.4; transform: scale(0.8); box-shadow: 0 0 2px rgba(16,185,129,0.2); }
        }
        @keyframes agWidgetShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes agTakeawayIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ag-widget {
          opacity: 0.22;
          transform: scale(0.96) translateY(4px);
          transition: opacity 350ms cubic-bezier(0.4,0,0.2,1), transform 350ms cubic-bezier(0.4,0,0.2,1);
        }
        .ag-widget:hover {
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
        }
        .ag-close:hover { color: #707070 !important; }
        .ag-widget, .ag-widget * { cursor: default !important; }
        .ag-widget button { cursor: pointer !important; }
      `}</style>

      <div
        className="ag-widget"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '228px',
          pointerEvents: 'auto',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          userSelect: 'none',
          zIndex: 58,
          opacity: state === 'loading' ? 0.22 : 0.2,
          transform: state === 'loading' ? 'scale(0.97) translateY(2px)' : 'scale(0.96) translateY(4px)',
        }}
      >
        <div style={{
          background: 'rgba(10, 10, 10, 0.96)',
          border: '1px solid rgba(32, 32, 32, 0.98)',
          borderRadius: '10px',
          padding: '10px 13px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 10px 36px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.035) inset',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: ACCENT,
                boxShadow: '0 0 6px rgba(16,185,129,0.5)',
                flexShrink: 0,
                animation: isPulsing ? 'agWidgetPulse 1.3s ease-in-out infinite' : 'none',
              }} />
              <span style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: ACCENT,
              }}>AutoGist</span>
            </div>
            <button
              className="ag-close"
              onClick={onDismiss}
              title="Dismiss AutoGist"
              aria-label="Dismiss AutoGist"
              style={{
                background: 'none', border: 'none',
                color: '#404040', padding: 0,
                display: 'flex', alignItems: 'center', lineHeight: 1,
                transition: 'color 150ms ease',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          {state === 'idle' && (
            <p style={{ margin: 0, fontSize: '10px', color: '#606060', textAlign: 'center', padding: '2px 0 1px', lineHeight: 1.4 }}>
              Scroll to auto-summarize
            </p>
          )}

          {state === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '2px 0 1px' }}>
              {[88, 68, 78].map((w, i) => (
                <div key={i} style={{
                  height: '8px', borderRadius: '3px',
                  width: `${w}%`,
                  background: 'linear-gradient(90deg, #161616 25%, #262626 50%, #161616 75%)',
                  backgroundSize: '200% 100%',
                  animation: `agWidgetShimmer ${1.4 + i * 0.1}s linear infinite`,
                }} />
              ))}
            </div>
          )}

          {state === 'ready' && takeaways.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {takeaways.map((point, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                  animation: `agTakeawayIn 220ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
                }}>
                  <div style={{
                    width: '3px', height: '3px', borderRadius: '50%',
                    background: ACCENT, flexShrink: 0, marginTop: '5.5px',
                  }} />
                  <p style={{ fontSize: '10.5px', color: '#b8b8b8', lineHeight: 1.55, margin: 0 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
