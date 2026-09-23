(function() {
    'use strict';
  
    // ---------- THEME TOGGLE ----------
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
  
    function applyTheme(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  
    // Sync toggle with system preference if no saved preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  
    // ---------- NAVBAR SCROLL EFFECT ----------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  
    // ---------- HAMBURGER MENU ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  
    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  
    // ---------- ACTIVE NAV LINK ----------
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
  
    function setActiveLink() {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) {
          a.classList.add('active');
        }
      });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  
    // ---------- REVEAL ANIMATIONS ----------
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => observer.observe(el));
  
    // ---------- GRAPHIC DESIGN FILTER ----------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
  
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        masonryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (item.dataset.category !== filter && filter !== 'all') {
                item.style.display = 'none';
              }
            }, 200);
          }
        });
      });
    });
  
    // ---------- LIGHTBOX ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
  
    masonryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  
    // ---------- CONTACT FORM VALIDATION ----------
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
  
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
  
      const nameGroup = form.querySelector('#name').closest('.form-group');
      const nameVal = form.querySelector('#name').value.trim();
      if (!nameVal) {
        nameGroup.classList.add('error');
        isValid = false;
      } else {
        nameGroup.classList.remove('error');
      }
  
      const emailGroup = form.querySelector('#email').closest('.form-group');
      const emailVal = form.querySelector('#email').value.trim();
      if (!emailVal || !validateEmail(emailVal)) {
        emailGroup.classList.add('error');
        isValid = false;
      } else {
        emailGroup.classList.remove('error');
      }
  
      const msgGroup = form.querySelector('#message').closest('.form-group');
      const msgVal = form.querySelector('#message').value.trim();
      if (!msgVal) {
        msgGroup.classList.add('error');
        isValid = false;
      } else {
        msgGroup.classList.remove('error');
      }
  
      if (isValid) {
        form.querySelectorAll('.form-group, button[type="submit"]').forEach(el => {
          el.style.display = 'none';
        });
        formSuccess.classList.add('show');
        setTimeout(() => {
          form.reset();
          form.querySelectorAll('.form-group, button[type="submit"]').forEach(el => {
            el.style.display = '';
          });
          formSuccess.classList.remove('show');
        }, 4000);
      }
    });
  
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('error');
      });
    });
  
    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  
    // ---------- PARALLAX (subtle) ----------
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroBubbles = document.querySelectorAll('.hero-bubble');
      heroBubbles.forEach((bubble, i) => {
        const speed = 0.03 + (i * 0.01);
        bubble.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  
  })();


    // ============================================
  // CLIENT WORK FILTER (NEW)
  // ============================================
  const clientFilterBtns = document.querySelectorAll('[data-client-filter]');
  const clientSections = document.querySelectorAll('[data-client-section]');
  const clientCards = document.querySelectorAll('[data-client-category]');

  clientFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clientFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.clientFilter;

      // Toggle subsections
      clientSections.forEach(section => {
        const key = section.dataset.clientSection;
        if (filter === 'all' || key === filter) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });

      // Animate cards
      clientCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.clientCategory === filter;
        if (matches) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ============================================
  // CLIENT WORK LIGHTBOX WITH NAVIGATION (NEW)
  // ============================================
  const clientSocialItems = document.querySelectorAll('.client-social-item');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbCat = document.getElementById('lightboxCat');
  let currentIndex = -1;

  const galleryItems = Array.from(clientSocialItems);

  function openLightboxAt(index) {
    if (index < 0 || index >= galleryItems.length) return;
    currentIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const titleEl = item.querySelector('.title');
    const catEl = item.querySelector('.cat');

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lbTitle.textContent = titleEl ? titleEl.textContent : '';
      lbCat.textContent = catEl ? catEl.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  clientSocialItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightboxAt(i);
    });
  });

  lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightboxAt(newIndex);
  });

  lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % galleryItems.length;
    openLightboxAt(newIndex);
  });

  // Keyboard nav for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') {
      const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightboxAt(newIndex);
    } else if (e.key === 'ArrowRight') {
      const newIndex = (currentIndex + 1) % galleryItems.length;
      openLightboxAt(newIndex);
    }
  });


  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear caption for next open
    const lbTitle = document.getElementById('lightboxTitle');
    const lbCat = document.getElementById('lightboxCat');
    if (lbTitle) lbTitle.textContent = '';
    if (lbCat) lbCat.textContent = '';
    currentIndex = -1; // Reset gallery index
  }