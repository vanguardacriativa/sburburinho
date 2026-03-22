/* Stars */
const se = document.getElementById('stars');
for (let i = 0; i < 90; i++) {
  const s = document.createElement('span');
  const z = Math.random() * 2 + 0.4;
  s.style.cssText = `width:${z}px;height:${z}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*5}s;--dl:-${Math.random()*6}s;--op:${.25+Math.random()*.6}`;
  se.appendChild(s);
}

function showScr(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  document.getElementById('wa').classList.toggle('on', id === 's3');
}

function updateHeader(isAll) {
  document.getElementById('top-cover').style.display = isAll ? 'block' : 'none';
  document.getElementById('top-logo').style.display  = isAll ? 'none'  : 'flex';
}

function setTab(i) {
  document.querySelectorAll('.ntab').forEach((b, j) => b.classList.toggle('on', j === i));
}

/* Nav tabs */
const navEl = document.getElementById('nav-tabs');
['Todos','Colher','Corte','Trufada','Barra'].forEach((lbl, i) => {
  const b = document.createElement('button');
  b.className = 'ntab' + (i === 0 ? ' on' : '');
  b.textContent = lbl;
  b.onclick = () => {
    setTab(i);
    if (i === 0) { updateHeader(true); showScr('s1'); }
    else { updateHeader(false); openList(K[i].l, K[i].m); }
  };
  navEl.appendChild(b);
});
updateHeader(true);

/* ── CAROUSEL ── */
let cur = 0, busy = false;

function renderCarousel() {
  const stage = document.getElementById('stage');
  const n = C.length;
  const pos = [
    { o: -2, x: -85, z: -180, sc: .58, op: .15, bl: 3 },
    { o: -1, x: -50, z:  -70, sc: .79, op: .58, bl: 0 },
    { o:  0, x:   0, z:    0, sc:  1,  op:  1,  bl: 0 },
    { o:  1, x:  50, z:  -70, sc: .79, op: .58, bl: 0 },
    { o:  2, x:  85, z: -180, sc: .58, op: .15, bl: 3 },
  ];

  const existing = {};
  stage.querySelectorAll('.ccard').forEach(el => { existing[el.dataset.offset] = el; });
  const seen = new Set();

  pos.forEach(p => {
    const idx = ((cur + p.o) % n + n) % n;
    const c = C[idx];
    const isC = p.o === 0;
    const ac = c.ac;
    const r = parseInt(ac.slice(1,3),16), g = parseInt(ac.slice(3,5),16), b = parseInt(ac.slice(5,7),16);
    const glow  = `rgba(${r},${g},${b},.78)`;
    const glow2 = `rgba(${r},${g},${b},.22)`;

    let el = existing[String(p.o)];
    if (!el) { el = document.createElement('div'); stage.appendChild(el); }
    seen.add(String(p.o));

    el.className = 'ccard' + (isC ? ' center' : '');
    el.dataset.offset = String(p.o);
    el.style.cssText = `--bg:${c.bg};--ac:${ac};--glow:${glow};--glow2:${glow2};--angle:0deg;transform:translateX(${p.x}%) scale(${p.sc}) translateZ(${p.z}px);opacity:${p.op};filter:blur(${p.bl}px) brightness(${isC?1:.70});z-index:${5-Math.abs(p.o)};pointer-events:${Math.abs(p.o)<=1?'all':'none'};`;
    el.innerHTML = `<img src="${c.imgs[0]}" loading="lazy" alt="${c.signo}">
      <div class="cov">
        <div class="cov-glyph">${c.glyph}</div>
        <div class="cov-name">${c.signo}</div>
        <div class="cov-sab">${c.subtitle}</div>
        <div class="cov-price">${c.preco}</div>
      </div>`;

    if (isC)        el.onclick = () => openDetail(c, 's1');
    else if (p.o === -1) el.onclick = () => nav(-1);
    else if (p.o ===  1) el.onclick = () => nav(1);
    else el.onclick = null;
  });

  stage.querySelectorAll('.ccard').forEach(el => {
    if (!seen.has(el.dataset.offset)) el.remove();
  });

  document.querySelectorAll('.cdot').forEach((d, i) => d.classList.toggle('on', i === cur));
}

function buildDots() {
  const dc = document.getElementById('cdots');
  dc.innerHTML = '';
  C.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'cdot' + (i === 0 ? ' on' : '');
    d.onclick = () => { cur = i; renderCarousel(); };
    dc.appendChild(d);
  });
}

function nav(dir) {
  if (busy) return; busy = true;
  cur = ((cur + dir) % C.length + C.length) % C.length;
  renderCarousel();
  setTimeout(() => busy = false, 520);
}

document.getElementById('prev').onclick = () => nav(-1);
document.getElementById('next').onclick = () => nav(1);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') nav(-1);
  if (e.key === 'ArrowRight') nav(1);
});

let tx = 0, mv = false;
document.getElementById('s1').addEventListener('touchstart', e => { tx = e.touches[0].clientX; mv = false; }, { passive: true });
document.getElementById('s1').addEventListener('touchmove',  e => { if (Math.abs(e.touches[0].clientX - tx) > 10) mv = true; }, { passive: true });
document.getElementById('s1').addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (mv && Math.abs(dx) > 40) nav(dx < 0 ? 1 : -1);
}, { passive: true });

renderCarousel();
buildDots();

/* ── PRODUCT LIST ── */
function openList(catLabel, catMeta) {
  document.getElementById('s2-name').textContent = catLabel;
  document.getElementById('s2-meta').textContent = catMeta;
  const pl = document.getElementById('plist');
  pl.innerHTML = '';
  C.filter(c => c.cat === catLabel).forEach(c => {
    const el = document.createElement('div');
    el.className = 'pcard';
    el.style.background = c.bg;
    const bdg = c.imgs.length > 1 ? `<span class="pbadge">${c.imgs.length} fotos</span>` : '';
    el.innerHTML = `
      <div class="pi"><img src="${c.imgs[0]}" loading="lazy" alt="${c.signo}"></div>
      <div class="pb">
        <div class="pt">
          <div class="psig"><span class="pgl">${c.glyph}</span>${c.signo}</div>
          <div class="ppr">${c.preco}</div>
        </div>
        <div class="psub">${c.subtitle}</div>
        <div class="psab">${c.sabor}</div>
        <div class="pdes">${c.desc}</div>
        <div class="pfoot"><div class="ppe">${c.peso}</div>${bdg}</div>
      </div>`;
    el.onclick = () => openDetail(c, 's2');
    pl.appendChild(el);
  });
  showScr('s2');
}

/* ── DETAIL ── */
let dFrom = 's1';

function openDetail(c, from) {
  dFrom = from;
  const ti = K.findIndex(k => k.l === c.cat);
  if (ti >= 0) setTab(ti);
  updateHeader(ti === 0);

  const ds = document.getElementById('dscroll');
  const n = c.imgs.length; let idx = 0;

  const slides = c.imgs.map(im => `<div class="gslide"><img src="${im}" loading="lazy"></div>`).join('');
  const dots = n > 1 ? `<div class="gdots">${c.imgs.map((_, i) => `<div class="gdot${i===0?' on':''}"></div>`).join('')}</div>` : '';
  const hint = n > 1 ? `<div class="ghint">deslize ›</div>` : '';

  ds.innerHTML = `
    <div class="detail-topbar">
      <button class="bback-d" onclick="goBack()">← voltar</button>
    </div>
    <div class="detail-inner">
      <div class="gal-col">
        <div class="gal" id="gal">
          <div class="gtrack" id="gtr">${slides}</div>
          ${dots}${hint}
        </div>
      </div>
      <div class="info-col">
        <div class="dbody" style="background:${c.bg}">
          <div class="dcat">${c.cat} · ${c.peso}</div>
          <div class="dsig-row">
            <div class="dsig">${c.signo}</div>
            <div class="dgl">${c.glyph}</div>
          </div>
          <div class="dsab">${c.sabor}</div>
          <div class="dsub">${c.subtitle}</div>
          <div class="dhr"></div>
          <div class="ddesc">${c.desc}</div>
          <div class="dfoot">
            <div class="dpr">${c.preco}</div>
            <div class="dpe">${c.peso}</div>
          </div>
        </div>
      </div>
    </div>`;
  ds.scrollTop = 0;

  if (n > 1) {
    const tr = document.getElementById('gtr');
    const allD = ds.querySelectorAll('.gdot');
    function go(ni) {
      idx = ((ni % n) + n) % n;
      tr.style.transform = `translateX(${-idx * 100}%)`;
      allD.forEach((d, i) => d.classList.toggle('on', i === idx));
    }
    let stx = 0, sm = false;
    let tmr = setInterval(() => go(idx + 1), 3500);
    const gal = document.getElementById('gal');
    gal.addEventListener('touchstart', e => { stx = e.touches[0].clientX; sm = false; }, { passive: true });
    gal.addEventListener('touchmove',  e => { if (Math.abs(e.touches[0].clientX - stx) > 8) sm = true; }, { passive: true });
    gal.addEventListener('touchend',   e => {
      clearInterval(tmr);
      const dx = e.changedTouches[0].clientX - stx;
      if (sm && Math.abs(dx) > 30) go(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });
  }

  showScr('s3');
}
  if (dFrom === 's1') { setTab(0); updateHeader(true); showScr('s1'); }
  else showScr('s2');
}
