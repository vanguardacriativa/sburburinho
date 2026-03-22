import { useState, useCallback, useEffect, useRef } from 'react'

const POSITIONS = [
  { o: -2, tx: -86, tz: -185, sc: 0.57, op: 0.14, bl: 3 },
  { o: -1, tx: -50, tz: -70,  sc: 0.79, op: 0.56, bl: 0 },
  { o:  0, tx:   0, tz:   0,  sc: 1,    op: 1,    bl: 0 },
  { o:  1, tx:  50, tz: -70,  sc: 0.79, op: 0.56, bl: 0 },
  { o:  2, tx:  86, tz: -185, sc: 0.57, op: 0.14, bl: 3 },
]

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}

export default function Carousel({ cards, onSelect }) {
  const [cur, setCur] = useState(0)
  const [busy, setBusy] = useState(false)
  const txRef = useRef(0)
  const movedRef = useRef(false)
  const n = cards.length

  const step = useCallback((dir) => {
    if (busy) return
    setBusy(true)
    setCur(c => ((c + dir) % n + n) % n)
    setTimeout(() => setBusy(false), 500)
  }, [busy, n])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step])

  const onTouchStart = e => { txRef.current = e.touches[0].clientX; movedRef.current = false }
  const onTouchMove  = e => { if (Math.abs(e.touches[0].clientX - txRef.current) > 12) movedRef.current = true }
  const onTouchEnd   = e => {
    const dx = e.changedTouches[0].clientX - txRef.current
    if (movedRef.current && Math.abs(dx) > 45) step(dx < 0 ? 1 : -1)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @property --ang { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes spinB { to { --ang: 360deg; } }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 10px 2px var(--g1), 0 0 30px 5px var(--g2), 0 16px 40px rgba(0,0,0,.5); }
          50%      { box-shadow: 0 0 22px 8px var(--g1), 0 0 55px 16px var(--g2), 0 16px 40px rgba(0,0,0,.5); }
        }
        .cc-active { animation: pulse 2.5s ease-in-out infinite; border-color: transparent !important; }
        .cc-active::before {
          content: '';
          position: absolute; inset: -2px; z-index: -1; border-radius: 18px;
          background: conic-gradient(from var(--ang),
            transparent 0deg, var(--g1) 50deg, rgba(255,255,255,.9) 88deg,
            transparent 145deg, var(--g2) 205deg, rgba(255,255,255,.55) 248deg,
            transparent 325deg, var(--g1) 360deg);
          animation: spinB 2.8s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out; mask-composite: exclude;
          padding: 2px;
        }
        .cc-arr:hover { background: rgba(255,255,255,.16) !important; }
        .cc-dot-btn { width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.22);border:none;padding:0;cursor:pointer;transition:all .22s; }
        .cc-dot-btn.on { background:#f5d080;width:16px;border-radius:3px; }
      `}</style>

      {/* Stage */}
      <div
        style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '900px', overflow: 'visible' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {POSITIONS.map(p => {
          const idx = ((cur + p.o) % n + n) % n
          const c = cards[idx]
          const isC = p.o === 0
          const g1 = hexToRgba(c.ac, 0.8)
          const g2 = hexToRgba(c.ac, 0.22)

          return (
            <div
              key={p.o}
              className={isC ? 'cc-active' : ''}
              onClick={() => {
                if (isC) onSelect(c)
                else if (p.o === -1) step(-1)
                else if (p.o === 1) step(1)
              }}
              style={{
                position: 'absolute',
                width: 'clamp(160px,42vw,220px)',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,.1)',
                boxShadow: '0 8px 30px rgba(0,0,0,.5)',
                transform: `translateX(${p.tx}%) scale(${p.sc}) translateZ(${p.tz}px)`,
                opacity: p.op,
                filter: `blur(${p.bl}px) brightness(${isC ? 1 : 0.68})`,
                zIndex: 5 - Math.abs(p.o),
                pointerEvents: Math.abs(p.o) <= 1 ? 'all' : 'none',
                transition: 'transform .48s cubic-bezier(.4,0,.2,1), opacity .48s cubic-bezier(.4,0,.2,1), filter .48s cubic-bezier(.4,0,.2,1), box-shadow .48s cubic-bezier(.4,0,.2,1)',
                willChange: 'transform,opacity',
                touchAction: 'pan-y',
                '--g1': g1, '--g2': g2, '--ang': '0deg',
              }}
            >
              <img src={c.imgs[0]} alt={c.signo} loading="lazy" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 13px 13px', background: c.bg }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 3 }}>{c.glyph}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>{c.signo}</div>
                <div style={{ fontStyle: 'italic', fontSize: 10.5, fontWeight: 300, color: 'rgba(255,255,255,.42)', marginTop: 3, lineHeight: 1.3 }}>{c.sub}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginTop: 8 }}>{c.preco}</div>
              </div>
            </div>
          )
        })}

        {/* Arrows */}
        {[-1, 1].map(dir => (
          <button key={dir} className="cc-arr" onClick={() => step(dir)} style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [dir === -1 ? 'left' : 'right']: 6,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
            color: 'rgba(255,255,255,.75)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10, transition: 'background .18s',
          }}>
            {dir === -1 ? '‹' : '›'}
          </button>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '8px 0 5px', flexShrink: 0 }}>
        {cards.map((_, i) => (
          <button key={i} className={`cc-dot-btn${i === cur ? ' on' : ''}`} onClick={() => { if (!busy) setCur(i) }} />
        ))}
      </div>
    </div>
  )
}
