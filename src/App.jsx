import { useState, useCallback } from 'react'
import Stars from './Stars.jsx'
import Carousel from './Carousel.jsx'
import Gallery from './Gallery.jsx'
import { CARDS, CATS, WA } from './data.js'

const TAB_LABELS = ['Todos', 'Colher', 'Corte', 'Trufada', 'Barra']

// WhatsApp SVG
const WAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ── Product Card (list view) ─────────────────────────────────
function ProductCard({ card, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12, overflow: 'hidden', display: 'flex',
        border: '1px solid rgba(255,255,255,.07)',
        cursor: 'pointer', background: card.bg,
        transition: 'transform .15s',
        activeTransform: 'scale(.98)',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(.98)'}
      onTouchEnd={e => e.currentTarget.style.transform = ''}
    >
      <div style={{ flexShrink: 0, width: 86, aspectRatio: '4/5', overflow: 'hidden' }}>
        <img src={card.imgs[0]} alt={card.signo} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1 }}>
            <span style={{ fontSize: '.72em', opacity: .5, marginRight: 3 }}>{card.glyph}</span>
            {card.signo}
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', flexShrink: 0 }}>{card.preco}</div>
        </div>
        <div style={{ fontStyle: 'italic', fontSize: 10.5, fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.3 }}>{card.sub}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{card.sabor}</div>
        <div style={{ fontSize: 8.5, fontWeight: 300, color: 'rgba(255,255,255,.25)', lineHeight: 1.55, marginTop: 2 }}>{card.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,.18)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{card.peso}</div>
          {card.imgs.length > 1 && (
            <div style={{ fontSize: 7, padding: '1px 5px', borderRadius: 6, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.3)' }}>
              {card.imgs.length} fotos
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Detail Screen ────────────────────────────────────────────
function DetailScreen({ card, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <Gallery imgs={card.imgs} />

        <div style={{ padding: '16px 18px 0', background: card.bg }}>
          <div style={{ fontSize: 8, letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>
            {card.cat} · {card.peso}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 'clamp(26px,7vw,40px)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{card.signo}</div>
            <div style={{ fontSize: 'clamp(20px,5vw,30px)', opacity: .55 }}>{card.glyph}</div>
          </div>
          <div style={{ fontSize: 'clamp(12px,3.2vw,14px)', color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{card.sabor}</div>
          <div style={{ fontStyle: 'italic', fontSize: 'clamp(12px,3.2vw,14px)', fontWeight: 300, color: 'rgba(255,255,255,.5)', marginBottom: 14, marginTop: 2 }}>{card.sub}</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.07)', marginBottom: 12 }} />
          <div style={{ fontSize: 'clamp(13px,3.5vw,15px)', fontWeight: 300, color: 'rgba(255,255,255,.65)', lineHeight: 1.85 }}>{card.desc}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, paddingBottom: 16 }}>
            <div style={{ fontSize: 'clamp(22px,6vw,30px)', fontWeight: 600, color: '#fff' }}>{card.preco}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,.25)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{card.peso}</div>
          </div>
        </div>

        <div style={{ padding: '4px 18px 28px', background: card.bg }}>
          <button onClick={onBack} style={{
            display: 'block', width: '100%', background: 'none',
            border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.38)',
            fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            padding: '10px 20px', borderRadius: 50, transition: 'color .2s,border-color .2s',
          }}>← voltar</button>
        </div>
      </div>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('carousel') // 'carousel' | 'list' | 'detail'
  const [activeTab, setActiveTab] = useState(0)
  const [listCat, setListCat] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [fromScreen, setFromScreen] = useState('carousel')

  const isTodos = activeTab === 0

  const goToTab = useCallback((i) => {
    setActiveTab(i)
    if (i === 0) {
      setScreen('carousel')
    } else {
      setListCat(CATS[i])
      setScreen('list')
    }
  }, [])

  const openDetail = useCallback((card, from) => {
    setSelectedCard(card)
    setFromScreen(from)
    // update tab to match category
    const ti = CATS.findIndex(c => c.l === card.cat)
    if (ti >= 0) setActiveTab(ti)
    setScreen('detail')
  }, [])

  const goBack = useCallback(() => {
    setScreen(fromScreen)
    if (fromScreen === 'carousel') setActiveTab(0)
  }, [fromScreen])

  const listCards = listCat ? CARDS.filter(c => c.cat === listCat.l) : []

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
      <Stars />

      {/* ── HEADER ── */}
      <div style={{ flexShrink: 0, zIndex: 10 }}>
        {/* Cover or Logo */}
        {isTodos && screen !== 'detail' ? (
          <div style={{ width: '100%', aspectRatio: '1200/350', overflow: 'hidden' }}>
            <img src="imgs/capa.jpg" alt="Páscoa Cosmos 2026" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 16px 4px', background: 'rgba(7,0,26,.97)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <img src="imgs/logo.png" alt="Páscoa Cosmos 2026" style={{ height: 'clamp(38px,8vw,60px)', width: 'auto' }} />
          </div>
        )}

        {/* Nav tabs */}
        <div style={{
          background: 'rgba(7,0,26,.97)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,.07)',
          display: 'flex', overflowX: 'auto', padding: '0 6px',
          scrollbarWidth: 'none',
        }}>
          <style>{`.ntab-btn:hover{color:rgba(255,255,255,.6)!important;}`}</style>
          {CATS.map((cat, i) => (
            <button
              key={i}
              className="ntab-btn"
              onClick={() => goToTab(i)}
              style={{
                flexShrink: 0, padding: '8px 12px 9px',
                fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                color: activeTab === i ? '#f5d080' : 'rgba(255,255,255,.3)',
                border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: activeTab === i ? '2px solid #f5d080' : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'color .2s,border-color .2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {TAB_LABELS[i]}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCREENS ── */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* Carousel */}
        {screen === 'carousel' && (
          <Carousel cards={CARDS} onSelect={card => openDetail(card, 'carousel')} />
        )}

        {/* Product List */}
        {screen === 'list' && listCat && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '8px 14px 7px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>{listCat.l}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.28)', marginLeft: 'auto', letterSpacing: '.04em' }}>{listCat.m}</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px 20px', display: 'flex', flexDirection: 'column', gap: 8, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.08) transparent' }}>
              {listCards.map(card => (
                <ProductCard key={card.key} card={card} onClick={() => openDetail(card, 'list')} />
              ))}
            </div>
          </div>
        )}

        {/* Detail */}
        {screen === 'detail' && selectedCard && (
          <DetailScreen card={selectedCard} onBack={goBack} />
        )}
      </div>

      {/* ── WHATSAPP BUTTON ── */}
      {screen === 'detail' && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: 'calc(10px + env(safe-area-inset-bottom)) 16px 12px',
          background: 'linear-gradient(to top, rgba(7,0,26,1) 55%, transparent)',
        }}>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#25D366', color: '#fff', textDecoration: 'none',
              fontSize: 14, fontWeight: 600, letterSpacing: '.04em',
              padding: '14px 24px', borderRadius: 50,
              boxShadow: '0 4px 24px rgba(37,211,102,.35)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <WAIcon />
            Compre aqui
          </a>
        </div>
      )}
    </div>
  )
}
