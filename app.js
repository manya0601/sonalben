/* ============================================================
   SONALBEN KHAKHRAWALA — V4 Heritage Web Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLoader();
  initNavigation();
  initHeroParallax();
  initScrapbookTimeline();
  initPantryShelf();
  initCookbook();
  initAddToCart();
});

/* ============================================================
   1. LOADING SCREEN & HERO ENTRANCE
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.style.overflow = '';
      animateHeroEntrance();
    }, 1200);
  });
  document.body.style.overflow = 'hidden';
}

function animateHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
    .from('.hero-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-subtitle', { y: 25, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.15 }, '-=0.4')
    .from('.food-img', { scale: 0, opacity: 0, duration: 0.8, stagger: { amount: 0.6, from: 'random' }, ease: 'back.out(1.5)' }, '-=0.6')
    .from('.sketch-img', { scale: 0, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.2)' }, '-=0.5')
    .from('.scroll-indicator', { opacity: 0, y: -20, duration: 0.6 }, '-=0.3');
}

/* ============================================================
   2. NAVIGATION
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-menu-toggle');
  const links = document.getElementById('nav-links');
  if (!nav) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '0.7rem 0';
      nav.style.boxShadow = '0 4px 20px rgba(46,37,32,0.06)';
    } else {
      nav.style.padding = '1.2rem 0';
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Mobile menu drawer
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = nav.offsetHeight + 10;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================================
   3. HERO PARALLAX (Mouse move floating snacks & sketches)
   ============================================================ */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const foodItems = document.querySelectorAll('.food-img');
  const sketchItems = document.querySelectorAll('.sketch-img');
  const heroBg = document.querySelector('.hero-bg img');
  if (!hero || (foodItems.length === 0 && sketchItems.length === 0) || typeof gsap === 'undefined') return;

  hero.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) / cx;
    const my = (e.clientY - cy) / cy;

    foodItems.forEach((item, i) => {
      const speed = parseFloat(item.dataset.speed) || (1 + i * 0.2);
      gsap.to(item, {
        x: mx * speed * 25,
        y: my * speed * 18,
        rotation: mx * speed * 4,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    sketchItems.forEach((item, i) => {
      const speed = parseFloat(item.dataset.speed) || (1 + i * 0.15);
      gsap.to(item, {
        x: mx * speed * 15,
        y: my * speed * 12,
        rotation: mx * speed * 2,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    if (heroBg) {
      gsap.to(heroBg, { x: mx * 10, y: my * 10, duration: 1, ease: 'power2.out' });
    }
  });

  // Scroll fade-out for hero contents
  gsap.to('.hero-content', {
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
    y: 80, opacity: 0
  });
  gsap.to('.floating-foods', {
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
    y: -50, opacity: 0.1
  });
}

/* ============================================================
   4. SCRAPBOOK TIMELINE (Timeline reveals)
   ============================================================ */
function initScrapbookTimeline() {
  const milestones = document.querySelectorAll('.scrapbook-milestone');
  if (milestones.length === 0 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Staggered reveal for milestones
  milestones.forEach((ms, i) => {
    const polaroid = ms.querySelector('.scrapbook-polaroid-card');
    const content = ms.querySelector('.milestone-content');
    const pin = ms.querySelector('.milestone-pin');
    const postit = ms.querySelector('.postit-note');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ms,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    if (pin) {
      tl.from(pin, { scale: 0, duration: 0.4, ease: 'back.out(2)' }, 0);
    }
    if (polaroid) {
      const rotationAngle = i % 2 === 0 ? -12 : 12;
      tl.from(polaroid, {
        x: i % 2 === 0 ? -45 : 45,
        rotation: rotationAngle,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.1);
    }
    if (content) {
      tl.from(content, {
        x: i % 2 === 0 ? 45 : -45,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.1);
    }
    if (postit) {
      tl.from(postit, {
        scale: 0,
        rotation: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.5)',
        delay: 0.3
      }, 0.2);
    }
  });
}

/* ============================================================
   5. PANTRY SHELF (Filter product cards)
   ============================================================ */
function initPantryShelf() {
  const filterBtns = document.querySelectorAll('.product-filters .filter-btn');
  const cards = document.querySelectorAll('#product-grid-main .product-card');
  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.96, y: 10 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   6. COOKBOOK (Recipe Category Filters & Accordion Toggles)
   ============================================================ */
function initCookbook() {
  const filters = document.querySelectorAll('.recipe-filters .recipe-filter-btn');
  const cards = document.querySelectorAll('#recipe-grid-main .recipe-card');
  if (cards.length === 0) return;

  // Recipe categories filter
  if (filters.length > 0) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.recipeFilter;
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        cards.forEach(card => {
          const category = card.dataset.recipeCategory;
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
              );
            } else {
              card.style.opacity = '1';
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Accordion toggle steps
  document.querySelectorAll('.btn-toggle-recipe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.recipe-card');
      const accordion = card.querySelector('.recipe-directions-accordion');
      if (!accordion) return;

      const isVisible = accordion.classList.contains('is-visible');
      if (isVisible) {
        accordion.classList.remove('is-visible');
        btn.textContent = 'View Full Recipe →';
      } else {
        accordion.classList.add('is-visible');
        btn.textContent = 'Hide Recipe Steps ↑';
        if (typeof gsap !== 'undefined') {
          gsap.from(accordion, { opacity: 0, y: -6, duration: 0.35, ease: 'power2.out' });
        }
      }
    });
  });
}

/* ============================================================
   7. ADD TO CART Animation
   ============================================================ */
function initAddToCart() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    if (!addBtn) return;
    e.preventDefault();
    e.stopPropagation();

    // Button feedback
    if (typeof gsap !== 'undefined') {
      gsap.to(addBtn, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    }

    // Increment count
    const cartCount = document.querySelector('.nav-cart-count');
    if (cartCount) {
      const cur = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = cur + 1;
      
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(cartCount, 
          { scale: 1.5 },
          { scale: 1, duration: 0.3, ease: 'back.out(2)' }
        );
      }
    }

    // Flying dot to cart icon
    const cart = document.querySelector('.nav-cart');
    if (cart && typeof gsap !== 'undefined') {
      const btnRect = addBtn.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();

      const dot = document.createElement('div');
      dot.style.cssText = `
        position:fixed; width:12px; height:12px; border-radius:50%;
        background:var(--saffron); z-index:9999; pointer-events:none;
        left:${btnRect.left + btnRect.width / 2 - 6}px;
        top:${btnRect.top + btnRect.height / 2 - 6}px;
      `;
      document.body.appendChild(dot);

      gsap.to(dot, {
        left: cartRect.left + cartRect.width / 2 - 6,
        top: cartRect.top + cartRect.height / 2 - 6,
        scale: 0.3,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => dot.remove()
      });
    }
  });
}
