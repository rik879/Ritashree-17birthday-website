// script.js - behavior: nav scrolling, reveal on scroll, hero floating randomization, simple particles

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('.section'));
  const revealTargets = document.querySelectorAll('.reveal');
  const galleryGrid = document.querySelector('.gallery-grid');

  // Generate gallery images (20)
  for (let i = 1; i <= 20; i++) {
    const img = document.createElement('img');
    img.src = `images/page-5-${i}.png`;
    img.alt = `Gallery ${i}`;
    img.className = 'reveal';
    galleryGrid.appendChild(img);
  }

  // Smooth fast scroll for nav clicks
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;
      // Fast smooth scroll with short duration
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // IntersectionObserver for reveal (fade in/out)
  const observerOpts = { root: null, rootMargin: '0px', threshold: [0, 0.12, 0.6] };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.12) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOpts);

  revealTargets.forEach(t => revealObserver.observe(t));
  // observe dynamically created gallery items
  const galleryObserver = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && n.classList.contains('reveal')) revealObserver.observe(n);
      });
    });
  });
  galleryObserver.observe(galleryGrid, { childList: true });

  // Wheel/keyboard snap to next/prev section (debounced)
  let wheelLock = false;
  function snapToIndex(i) {
    i = Math.max(0, Math.min(sections.length - 1, i));
    sections[i].scrollIntoView({behavior:'smooth', block:'start'});
  }
  window.addEventListener('wheel', e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (wheelLock) return;
    wheelLock = true;
    const dir = e.deltaY > 0 ? 1 : -1;
    const currentIndex = Math.round(sections.findIndex(s => {
      const rect = s.getBoundingClientRect();
      return rect.top >= -10 && rect.top < window.innerHeight/2;
    }));
    let idx = currentIndex;
    if (idx === -1) {
      // fallback: find first fully visible or 0
      idx = sections.findIndex(s => s.getBoundingClientRect().top >= 0) || 0;
    }
    snapToIndex(idx + dir);
    setTimeout(() => wheelLock = false, 600);
  }, {passive:true});

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const cur = sections.findIndex(s => s.getBoundingClientRect().top >= -10 && s.getBoundingClientRect().top < window.innerHeight/2);
      snapToIndex(Math.max(0, (cur === -1 ? 0 : cur) + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const cur = sections.findIndex(s => s.getBoundingClientRect().top >= -10 && s.getBoundingClientRect().top < window.innerHeight/2);
      snapToIndex(Math.max(0, (cur === -1 ? 0 : cur) - 1));
    }
  });

  // Slightly randomize floating animations for hero image
  document.querySelectorAll('.floating').forEach((el, i) => {
    el.style.setProperty('--i', (Math.random()*2).toFixed(2));
    el.style.animationDuration = `${5 + Math.random()*4}s`;
  });

  // Simple particle effect on home using canvas
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth;
    let H = canvas.height = innerHeight;
    const particles = [];
    const max = 60;

    function rand(min, max){ return Math.random()*(max-min)+min; }

    for (let i=0;i<max;i++){
      particles.push({
        x: rand(0, W),
        y: rand(H*0.2, H),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.4, -0.8),
        r: rand(0.6, 2.4),
        alpha: rand(0.05, 0.35)
      });
    }

    function resize(){
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    }
    addEventListener('resize', resize);

    function draw(){
      ctx.clearRect(0,0,W,H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0008;
        if (p.y < -10 || p.alpha <= 0) {
          p.x = rand(0, W);
          p.y = H + 10;
          p.vx = rand(-0.1, 0.1);
          p.vy = rand(-0.6, -0.2);
          p.r = rand(0.6, 2.4);
          p.alpha = rand(0.08, 0.45);
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
  }
});