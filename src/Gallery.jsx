import { useState, useRef } from 'react'

export default function Gallery({ imgs }) {
  const [idx, setIdx] = useState(0)
  const txRef = useRef(0)
  const movedRef = useRef(false)
  const n = imgs.length

  const go = (ni) => setIdx(((ni % n) + n) % n)

  const onTouchStart = e => { txRef.current = e.touches[0].clientX; movedRef.current = false }
  const onTouchMove  = e => { if (Math.abs(e.touches[0].clientX - txRef.current) > 8) movedRef.current = true }
  const onTouchEnd   = e => {
    const dx = e.changedTouches[0].clientX - txRef.current
    if (movedRef.current && Math.abs(dx) > 30) go(idx + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: '#000', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Track */}
      <div style={{
        display: 'flex', height: '100%',
        transform: `translateX(${-idx * 100}%)`,
        transition: 'transform .32s cubic-bezier(.4,0,.2,1)',
        willChange: 'transform',
      }}>
        {imgs.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%' }}>
            <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>

      {/* Dots */}
      {n > 1 && (
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2, pointerEvents: 'none' }}>
          {imgs.map((_, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 3,
              width: i === idx ? 13 : 5,
              background: i === idx ? '#fff' : 'rgba(255,255,255,.3)',
              transition: 'all .22s',
            }} />
          ))}
        </div>
      )}

      {/* Hint */}
      {n > 1 && (
        <div style={{ position: 'absolute', bottom: 28, right: 12, fontSize: 8, color: 'rgba(255,255,255,.3)', letterSpacing: '.08em', pointerEvents: 'none' }}>
          deslize ›
        </div>
      )}
    </div>
  )
}
