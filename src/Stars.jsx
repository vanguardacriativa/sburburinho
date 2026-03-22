import { useMemo } from 'react'

export default function Stars() {
  const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.2 + 0.4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    d: 2 + Math.random() * 5,
    dl: -(Math.random() * 6),
    op: 0.2 + Math.random() * 0.65,
  })), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes tw {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50% { opacity: var(--op); transform: scale(1); }
        }
      `}</style>
      {stars.map(s => (
        <span key={s.id} style={{
          position: 'absolute',
          borderRadius: '50%',
          background: '#fff',
          width: s.size,
          height: s.size,
          left: `${s.left}%`,
          top: `${s.top}%`,
          '--op': s.op,
          animation: `tw ${s.d}s ${s.dl}s infinite`,
        }} />
      ))}
    </div>
  )
}
