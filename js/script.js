  // ─── TOUCH DETECTION ───
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch');
  }

  // ─── NAV SCROLL ───
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ─── COUNT UP ───
  function countUp(el, target, dur = 2000) {
    let start = 0;
    const step = target / (dur / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start);
      if (start >= target) clearInterval(t);
    }, 16);
  }
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat-number[data-count]').forEach(el => {
          countUp(el, parseInt(el.dataset.count));
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) statsObs.observe(statsSection);

  // ─── FORM ───
  document.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
    input.addEventListener('focus', () => {});
    input.addEventListener('blur', () => {});
  });

  // ─── MOBILE MENU ───
  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('open');
    hamburger.classList.toggle('active');
  }
  function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  }

  // ─── PARALLAX ───
  const heroBg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
    }
  });

  // ─── PARTICLES ───
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) { /* skip if no canvas */ }
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 10 : 30;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H * -1;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = Math.random() * 0.25 + 0.08;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * 0.25 + 0.05;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.type = Math.random() > 0.5 ? 'petal' : 'sparkle';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.type === 'petal') {
        this.x += Math.sin(this.y * 0.005) * 0.2;
      }
      if (this.y > H + 20 || this.x < -20 || this.x > W + 20) {
        this.reset();
        this.y = -20;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      if (this.type === 'petal') {
        ctx.fillStyle = '#DC2F3B';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.2, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#D4A23A';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * H;
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();