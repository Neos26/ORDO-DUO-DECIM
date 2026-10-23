document.addEventListener('DOMContentLoaded', () => {
  const organizationStats = {
    members: 11,
    projects: 3,
    events: 1,
    years: 1
  };

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (finePointer && !prefersReducedMotion) {
    const aura = document.createElement('div');
    const ring = document.createElement('div');
    aura.className = 'cursor-aura';
    ring.className = 'cursor-ring';
    document.body.append(aura, ring);

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let frameId;
    const renderCursor = () => {
      auraX += (mouseX - auraX) * 0.11;
      auraY += (mouseY - auraY) * 0.11;
      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      frameId = requestAnimationFrame(renderCursor);
    };
    frameId = requestAnimationFrame(renderCursor);

    window.addEventListener('mousemove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      document.body.classList.add('cursor-visible');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-visible'));

    document.querySelectorAll('a, button, input, select, textarea, .project-card, .portrait-card').forEach(element => {
      element.addEventListener('mouseenter', () => document.body.classList.add('cursor-interactive'));
      element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-interactive'));
    });

    document.querySelectorAll('.hero-main img, .featured-image img, .page-hero-image:not(.logo-plain) img').forEach(image => {
      const frame = image.closest('figure');
      frame?.addEventListener('mousemove', event => {
        const rect = frame.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
        image.style.transform = `scale(1.035) translate3d(${x}px, ${y}px, 0)`;
      });
      frame?.addEventListener('mouseleave', () => { image.style.transform = ''; });
    });

    // about-page logo — glides left/right following the cursor across
    // the whole viewport (eased, x-axis only); parks centred when idle
    document.querySelectorAll('.page-hero-image.logo-plain img').forEach(logo => {
      let targetX = 0;
      let currentX = 0;
      let running = false;
      const range = 30;
      const follow = () => {
        currentX += (targetX - currentX) * 0.07;
        if (Math.abs(targetX - currentX) > 0.1) {
          logo.style.transform = `translate3d(${currentX}px,0,0)`;
          requestAnimationFrame(follow);
        } else {
          currentX = targetX;
          logo.style.transform = currentX ? `translate3d(${currentX}px,0,0)` : '';
          running = false;
        }
      };
      window.addEventListener('mousemove', event => {
        targetX = ((event.clientX / window.innerWidth) - 0.5) * range * 2;
        if (!running) { running = true; requestAnimationFrame(follow); }
      });
    });

    window.addEventListener('pagehide', () => cancelAnimationFrame(frameId), { once: true });
  }

  document.title = document.title.replace('Asteria Collective', 'Ordo Duo Decim');
  document.querySelectorAll('.brand').forEach(brand => {
    brand.innerHTML = '<img class="brand-logo" src="assets/logo-hd.png" alt="" aria-hidden="true"><span>ORDO DUO DECIM</span>';
    brand.setAttribute('aria-label', 'Ordo Duo Decim home');
  });
  // the HTML nav is already balanced (Home/About/Activities — Events/Members/Contact);
  // only the Activities→Services label swap still runs here
  document.querySelectorAll('a[href="activities.html"]').forEach(link => { link.textContent = 'Services'; });
  document.querySelectorAll('.site-footer').forEach(footer => {
    const statement = footer.querySelector(':scope > .shell > blockquote');
    if (statement) statement.innerHTML = 'ORDO DUO DECIM — Together We <em>Plan, Create, and Celebrate.</em>';
    const details = footer.querySelector('.footer-grid > div:first-child p');
    if (details) details.innerHTML = 'Address: Arayat Boulevard, Brgy. Pampang, Angeles City, 2009<br>Email: <a href="mailto:jdbonon23-1329@cca.edu.ph">jdbonon23-1329@cca.edu.ph</a><br>Phone: <a href="tel:+639941810919">0994 181 0919</a><br>Hours: Monday–Friday, 8:00 AM–5:00 PM';
    const copyright = footer.querySelector('.footer-bottom span:first-child');
    if (copyright) copyright.textContent = '© 2025 Ordo Duo Decim';
    const footerGrid = footer.querySelector('.footer-grid');
    if (footerGrid && !footer.querySelector('.education-disclaimer')) {
      footerGrid.insertAdjacentHTML('afterend', '<p class="education-disclaimer">THIS WEBSITE IS FOR EDUCATIONAL PURPOSES ONLY</p>');
    }
    const footerBottom = footer.querySelector('.footer-bottom');
    if (footerBottom && !footerBottom.querySelector('.legal-links')) {
      footerBottom.insertAdjacentHTML('afterbegin', '<span class="legal-links"><a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms & Conditions</a></span>');
    }
    const socialColumn = [...footer.querySelectorAll('.footer-grid > div')].find(column => column.querySelector('h4')?.textContent.trim().toLowerCase() === 'follow us');
    if (socialColumn) socialColumn.innerHTML = '<h4>Follow us</h4><a href="https://www.facebook.com/share/19VWYMyxks/" target="_blank" rel="noopener noreferrer">Ordo Duo Decim ↗</a>';
  });

  const faqQuestions = [
    { question: 'How far in advance should I book?', answer: 'We recommend booking at least 1–3 months in advance to secure your preferred date, suppliers, and services. For large or special events, earlier booking is encouraged.' },
    { question: 'Do you provide event venues?', answer: 'Yes. We can recommend and coordinate with suitable venues based on your event type, number of guests, budget, and location.' },
    { question: 'Can I customize a package?', answer: 'Yes. Our packages can be customized according to your needs, preferences, and budget.' },
    { question: 'Do you require a reservation fee?', answer: 'Yes. A reservation fee is required to secure your event date. The amount will depend on the selected package and will be discussed before confirmation.' },
    { question: 'What happens after I submit my booking request?', answer: 'We will review your request, check the availability of your preferred date, and contact you to discuss the event details, package options, and next steps.' },
    { question: 'Can you organize events outside our area?', answer: 'Yes. We can accommodate events outside our usual service area, subject to availability and additional transportation or logistical charges.' },
    { question: 'Can we request changes to the proposal?', answer: 'Absolutely. We can revise the proposal based on your preferred services, theme, guest count, and budget.' },
    { question: 'What is your cancellation policy?', answer: 'Cancellation terms depend on the package and booking agreement. Reservation fees may be non-refundable, while other payments will be handled according to the agreed cancellation policy.' },
    { question: 'What types of events do you organize?', answer: 'We organize various events, including birthdays, weddings, debuts, corporate events, seminars, parties, school events, and other special occasions.' },
    { question: 'Do you offer different event packages?', answer: 'Yes. We offer different packages designed for various event sizes, needs, and budgets. Packages may also be customized upon request.' },
    { question: 'Can I choose my preferred theme and color scheme?', answer: 'Yes. You may choose your preferred theme, colors, and overall event style. We can also provide suggestions based on your concept.' },
    { question: 'Do you provide decorations and styling?', answer: 'Yes. Depending on your chosen package, we can provide decorations, styling, backdrops, tablescapes, and other event design elements.' },
    { question: 'Do you offer catering services?', answer: 'Yes. Catering services may be included in selected packages or arranged separately through our partner suppliers.' },
    { question: 'Can we choose our own menu?', answer: 'Yes. We can provide menu options, and you may select or request adjustments based on your preferences, guest needs, and budget.' },
    { question: 'Do you provide sounds, lights, and other equipment?', answer: 'Yes. We can provide or coordinate sound systems, lighting, microphones, projectors, screens, and other necessary event equipment, depending on your package.' },
    { question: 'Can you accommodate special requests?', answer: 'Yes. We do our best to accommodate special requests. Please inform us of your requirements early so we can properly plan and coordinate them.' },
    { question: 'How many guests can you accommodate?', answer: 'We can accommodate different event sizes, from small intimate gatherings to large events. The maximum capacity will depend on the venue, setup, and services required.' },
    { question: 'Do you offer event coordination services?', answer: 'Yes. Our event coordination service helps ensure that the program, suppliers, setup, and other event details are properly managed before and during the event.' },
    { question: 'Can you help us plan the event program?', answer: 'Yes. We can assist in creating and organizing your event program, including the sequence of activities, timing, presentations, and special segments.' },
    { question: 'How long does the event planning process take?', answer: 'The planning period depends on the size and complexity of the event. Simple events may take a few weeks, while larger events may require several months of preparation.' },
    { question: 'Can we have a meeting before booking?', answer: 'Yes. We encourage clients to have a consultation with us before booking so we can better understand their vision, requirements, and budget.' },
    { question: 'How can I check the availability of my preferred date?', answer: 'You can contact us through our official communication channels and provide your preferred event date. We will check our availability and get back to you.' },
    { question: 'What payment methods do you accept?', answer: 'We accept cash, bank transfer, and other available digital payment methods. Payment options will be discussed during the booking process.' },
    { question: 'When is the remaining balance due?', answer: 'The remaining balance is usually due before the event date, based on the payment schedule stated in your booking agreement.' },
    { question: 'Are there additional charges we should know about?', answer: 'Additional charges may apply for services outside the selected package, overtime, transportation, venue-related fees, special requests, or additional equipment. Any applicable charges will be discussed with you before they are confirmed.' }
  ];
  const accordion = document.querySelector('.accordion');
  if (accordion && document.body.dataset.page === 'contact') {
    accordion.innerHTML = faqQuestions.map(item => `<div class="faq-item"><button aria-expanded="false"><span>${item.question}</span><b>+</b></button><div class="answer"><p>${item.answer}</p></div></div>`).join('');
  }

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const currentLabel = carousel.querySelector('[data-current]');
    let currentIndex = 0;
    let swipeStartX = 0;
    let isSwiping = false;
    let captured = false;

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show photo ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index));
      dotsContainer.append(dot);
      return dot;
    });

function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      // the strip travels in the direction of travel
      track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
      slides.forEach((slide, slideIndex) => {
        let offset = slideIndex - currentIndex;
        if (offset > slides.length / 2) offset -= slides.length;
        if (offset < -slides.length / 2) offset += slides.length;
        const distance = Math.abs(offset);
        const active = distance === 0;
        // only the slides inside the viewport carry any 3D
        const near = distance <= 2 ? offset : Math.sign(offset) * 2;
        slide.style.transform =
          `rotateY(${-near * 18}deg) translateZ(${-Math.abs(near) * 60}px) scale(${1 - Math.abs(near) * 0.02})`;
        slide.style.opacity = active ? '1' : String(Math.max(0.4, 0.85 - distance * 0.2));
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
      currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Capture only once a real drag begins. Capturing on every pointerdown
    // retargets the derived click to .event-carousel, so the arrow buttons
    // never received a click at all.
    carousel.querySelector('.carousel-prev')?.addEventListener('click', () => showSlide(currentIndex - 1));
    carousel.querySelector('.carousel-next')?.addEventListener('click', () => showSlide(currentIndex + 1));
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showSlide(currentIndex - 1);
      if (event.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
    carousel.addEventListener('pointerdown', event => {
      if (!event.isPrimary) return;
      swipeStartX = event.clientX;
      isSwiping = true;
      carousel.classList.add('is-dragging');
    });
    carousel.addEventListener('pointermove', event => {
      if (!isSwiping || !event.isPrimary || captured) return;
      if (Math.abs(event.clientX - swipeStartX) > 6) {
        carousel.setPointerCapture?.(event.pointerId);
        captured = true;
      }
    });
    carousel.addEventListener('pointerup', event => {
      if (captured) {
        carousel.releasePointerCapture?.(event.pointerId);
        captured = false;
      }
      if (!isSwiping || !event.isPrimary) return;
      const distance = event.clientX - swipeStartX;
      isSwiping = false;
      carousel.classList.remove('is-dragging');
      if (Math.abs(distance) > 45) showSlide(currentIndex + (distance < 0 ? 1 : -1));
    });
    carousel.addEventListener('pointercancel', event => {
      if (captured) {
        carousel.releasePointerCapture?.(event.pointerId);
        captured = false;
      }
      isSwiping = false;
      carousel.classList.remove('is-dragging');
    });
    showSlide(0);
  });

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.append(progressBar);

  /* ---------- FULL-BLEED WIDTH ----------
     100vw includes the classic scrollbar, so a full-bleed layer built on
     it overshoots the visible area. clientWidth is the number that actually
     matches what the reader sees. */
  const syncBleedWidth = () => {
    document.documentElement.style.setProperty('--bleed-w', document.documentElement.clientWidth + 'px');
  };
  syncBleedWidth();
  window.addEventListener('resize', syncBleedWidth, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(syncBleedWidth, 120), { passive: true });
  window.addEventListener('load', syncBleedWidth, { once: true });

  /* ---------- AMBIENT PATTERN FIELD ----------
     Deliberately lean: one medallion veil, two warm blobs, 8 dust motes.
     Earlier this built ~28 concurrently animating elements (two veils, a
     ray sweep, three blobs, 18 motes) which read as visual noise. */
  if (!prefersReducedMotion) {
    const field = document.createElement('div');
    field.className = 'ambient-field';
    field.setAttribute('aria-hidden', 'true');
    field.innerHTML =
      '<div class="ambient-field__veil"></div>' +
      '<div class="ambient-field__glow ambient-field__glow--a"></div>' +
      '<div class="ambient-field__glow ambient-field__glow--b"></div>' +
      Array.from({ length: 8 }, () => '<span class="ambient-field__mote"></span>').join('');
    [...field.querySelectorAll('.ambient-field__mote')].forEach((mote, index) => {
      // deterministic spread so every reload looks the same, not random jitter
      const seed = (n) => (Math.sin(index * 12.9898 + n * 78.233) * 43758.5453) % 1;
      mote.style.setProperty('--x', ((seed(1) * 0.5 + 0.5) * 100).toFixed(2) + '%');
      mote.style.setProperty('--size', (2 + Math.abs(seed(2)) * 4).toFixed(1) + 'px');
      mote.style.setProperty('--dur', (18 + Math.abs(seed(3)) * 26).toFixed(1) + 's');
      mote.style.setProperty('--delay', (-Math.abs(seed(4)) * 34).toFixed(1) + 's');
      mote.style.setProperty('--drift', (Math.abs(seed(5)) * 90 - 45).toFixed(0) + 'px');
    });
    document.body.append(field);
  }

  // light the card under the pointer
  document.querySelectorAll(
    '.member, .portrait-card, .project-card, .manifesto article, .value-list > div, .stats div, .work-row, .activity'
  ).forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('is-lit'), { passive: true });
    card.addEventListener('mouseleave', () => card.classList.remove('is-lit'), { passive: true });
  });

  // a centred medallion watermark behind the stat block and the journal
  document.querySelectorAll('.community, .selected').forEach(section => section.classList.add('main-pattern'));

  /* ---------- PER-PAGE PATTERN ----------
     Each page gets its own motif so the site doesn't read as one repeated
     texture. Keyed off the existing body[data-page]. */
  const PAGE_PATTERN = {
    home: ['.community, .selected', 'pat-medallion'],
    about: ['.story, .values', 'pat-rings'],
    activities: ['.services-showcase', 'pat-lattice'],
    members: ['.people', 'pat-dots'],
    projects: ['.event-feature', 'pat-wave'],
    contact: ['.contact-layout, .faq', 'pat-diamond'],
    privacy: ['.legal-copy', 'pat-stripes'],
    terms: ['.legal-copy', 'pat-grid']
  };
  const pagePattern = PAGE_PATTERN[document.body.dataset.page];
  if (pagePattern) {
    document.querySelectorAll(pagePattern[0]).forEach(section => {
      section.classList.add('pat', pagePattern[1]);
    });
  }

  /* ---------- INFINITE SCROLLING BANNER + DIVIDERS ---------- */
  const MARQUEE_ITEMS = [
    'Event Management', 'Teamwork', 'Creativity', 'Leadership',
    'Twelve Minds One Vision', 'Order Twelve', 'Plan Create Celebrate'
  ];
  // Two identical copies scrolled by exactly -50% — the strip always shows
  // one full group, so there is nothing to measure and nothing to get wrong.
  const buildMarquee = (items = MARQUEE_ITEMS) => {
    const band = document.createElement('div');
    band.className = 'marquee';
    band.setAttribute('aria-hidden', 'true');
    const group = '<div class="marquee__group">' +
      items.map(item => '<span>' + item + '</span>').join('') + '</div>';
    band.innerHTML = '<div class="marquee__track">' + group + group + '</div>';
    return band;
  };

  const buildDivider = mark => {
    const rule = document.createElement('div');
    rule.className = 'divider';
    rule.setAttribute('aria-hidden', 'true');
    rule.innerHTML = '<span class="divider__mark">' + mark + '</span>';
    return rule;
  };

  /* ---------- SECTION SEPARATION ---------- */
  // hairline separators between content sections
  document.querySelectorAll('main > section').forEach(section => {
    if (!section.nextElementSibling) return;
    if (section.nextElementSibling.classList.contains('marquee')) return;
    section.nextElementSibling.before(buildDivider('✦ ✧ ✦'));
  });

  /* ---------- MOVING BANNER (homepage) ---------- */
  // one band breaks the page halfway — between the community stats and
  // the about-the-organization section
  if (document.body.dataset.page === 'home') {
    document.querySelector('.home-about')?.before(buildMarquee());
  }

  /* ---------- BACKGROUND VIDEO ----------
     Currently only the homepage hero opts in (data-bg-video). bg1.mp4 is
     60MB / 1080p / 120s and bg2.mp4 is 135MB / 4K, so this stays
     deliberately conservative: nothing is fetched until its section is
     near the viewport, decoding pauses the moment it scrolls away, and
     it is skipped entirely on Save-Data / 2G / 3G. Add the attribute to
     any <section> to opt that section in. */
  const canPlayBgVideo = () => {
    if (prefersReducedMotion) return false;
    const probe = document.createElement('video');
    if (!probe.canPlayType('video/mp4; codecs="avc1.42E01E"')) return false;
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return true;
    if (conn.saveData) return false;
    return !/^(slow-)?[23]g$/.test(conn.effectiveType || '');
  };

  const bgTargets = document.querySelectorAll('[data-bg-video]');
  if (bgTargets.length && canPlayBgVideo()) {
    let single = null;
    const loadFor = host => {
      let layer = host.querySelector('.bg-video-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'bg-video-layer';
        layer.setAttribute('aria-hidden', 'true');
        const video = document.createElement('video');
        video.className = 'bg-video';
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.preload = 'auto';
        const source = document.createElement('source');
        source.src = host.dataset.bgVideo;
        source.type = 'video/mp4';
        source.addEventListener('error', () => {
          layer.remove();
          host.classList.remove('has-bg-video');
        }, { once: true });
        video.append(source);
        // the scrim lives inside the layer so it can never wash over
        // section content — it previously sat on the section itself
        const scrim = document.createElement('span');
        scrim.className = 'bg-video-scrim';
        layer.append(video, scrim);
        host.prepend(layer);
      }
      const video = layer.querySelector('video');
      const played = video.play();
      if (played && played.catch) played.catch(() => {});
      host.classList.add('has-bg-video');
    };

    const bgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const host = entry.target;
        // only ever stream one of them; swap on section change
        if (entry.isIntersecting) {
          if (single && single !== host) single.querySelector('.bg-video')?.pause();
          single = host;
          loadFor(host);
        } else {
          host.querySelector('.bg-video')?.pause();
          host.classList.remove('has-bg-video');
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.01 });
    bgTargets.forEach(target => bgObserver.observe(target));
  }

  /* ---------- PRODUCT COMMERCIALS — PLAY WHEN IN VIEW, SOUND ON ---------- */
  const autoplayVideos = [...document.querySelectorAll('[data-autoplay-video]')];
  if (autoplayVideos.length) {
    const soundOnByUser = new WeakSet();

    autoplayVideos.forEach(video => {
      video.playsInline = true;
      // remember if the viewer unmutes, so a later fallback never re-mutes them
      video.addEventListener('volumechange', () => {
        if (!video.muted && video.volume > 0) soundOnByUser.add(video);
      });
    });

    if (!prefersReducedMotion) {
      const tryPlay = video => {
        // sound ON by default — most browsers only allow this after the
        // first interaction with the page, so be ready for a rejection
        const played = video.play();
        if (!played || !played.catch) return;
        played.catch(() => {
          if (soundOnByUser.has(video)) return;
          // browser blocked audible playback: fall back to silent playback
          // so the commercial still autoplays in view
          video.muted = true;
          const retried = video.play();
          if (retried && retried.catch) retried.catch(() => {});
        });
      };

      const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          // play only when the majority of the frame is on screen;
          // pause off-screen so we never stream two commercials at once
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            tryPlay(video);
          } else if (!video.paused) {
            video.pause();
          }
        });
      }, { threshold: [0, 0.55, 1] });
      autoplayVideos.forEach(video => videoObserver.observe(video));
    }
  }

  /* ---------- SCROLL PARALLAX ---------- */
  const parallaxItems = [];
  if (!prefersReducedMotion) {
    const registerParallax = (selector, speed, desktopOnly = false) => {
      document.querySelectorAll(selector).forEach(element => {
        parallaxItems.push({
          element,
          speed,
          desktopOnly,
          // hold off until the reveal transition has handed the transform back
          armed: !element.classList.contains('reveal'),
          top: 0,
          center: 0,
          last: null
        });
      });
    };
    // .hero-main/.hero-secondary carry a translateX(-50%) on small screens,
    // so those layers only move where no other transform is in play.
    // .hero-main is deliberately NOT registered: it is centred with
    // translateX(-50%) at every width, and an inline parallax transform
    // would overwrite that centring.
    registerParallax('.hero-secondary', 0.15, true);
    registerParallax('.orbit', 0.05, true);
    registerParallax('.featured-image.event-frame', 0.07);
    registerParallax('.page-hero-image', 0.08);
    registerParallax('.work-row figure', 0.055);
    registerParallax('.activity figure', 0.05);
  }

  const measureParallax = () => {
    parallaxItems.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      item.top = rect.top + window.scrollY;
      item.center = item.top + rect.height / 2;
      item.last = null;
    });
  };

  const updateParallax = scrollY => {
    if (!parallaxItems.length) return;
    const viewport = window.innerHeight;
    // must be the WIDTH: this decides whether the CSS desktop hero layout is
    // active. Reading innerHeight here let the parallax clobber the mobile
    // hero's translateX(-50%) centring on any device taller than 900px.
    const wideEnough = window.innerWidth > 900;
    parallaxItems.forEach(item => {
      const distance = scrollY + viewport / 2 - item.center;
      if (item.desktopOnly && !wideEnough) {
        if (item.last !== null) { item.element.style.transform = ''; item.last = null; }
        return;
      }
      if (Math.abs(distance) > viewport * 1.6) {
        if (item.last !== null) { item.element.style.transform = ''; item.last = null; }
        return;
      }
      if (!item.armed) {
        if (!item.element.classList.contains('visible')) return;
        item.armed = true;
      }
      const offset = Math.round(distance * item.speed);
      if (offset === item.last) return;
      item.last = offset;
      item.element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  parallaxItems.forEach(item => {
    if (!item.desktopOnly) item.element.dataset.parallax = '';
  });

  let scrollFrame = false;
  const updateScroll = () => {
    scrollFrame = false;
    const scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 24);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0})`;
    updateParallax(scrollY);
  };
  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = true;
    requestAnimationFrame(updateScroll);
  };

  measureParallax();
  updateScroll();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', () => {
    measureParallax();
    requestScrollUpdate();
  }, { passive: true });
  window.addEventListener('load', () => { measureParallax(); requestScrollUpdate(); });

  menuButton?.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  const currentPage = document.body.dataset.page;
  const pageMap = { home: 'index.html', about: 'about.html', members: 'members.html', activities: 'activities.html', projects: 'projects.html', contact: 'contact.html' };
  if (pageMap[currentPage]) {
    document.querySelectorAll(`a[href="${pageMap[currentPage]}"]`).forEach(link => {
      // skip the brand — marking it active would override its gold gradient
      // with the flat active-link color and draw a stray underline
      if (link.closest('.nav') && !link.classList.contains('brand')) link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  /* ---------- SPLIT-TEXT LINE REVEAL ----------
     Lines are grouped by their measured top edge, then each group is
     wrapped as one block. The animated transform lives on .split-inner,
     which is an ancestor of any <em>, so background-clip:text gold
     headings never desync from their own gradient. */
  if (!prefersReducedMotion) {
    const groupInlineLines = heading => {
      const nodes = [...heading.childNodes].filter(node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
        if (node.nodeType !== Node.ELEMENT_NODE || node.tagName === 'BR') return false;
        return node.textContent.trim().length > 0;
      });
      if (nodes.length < 2) return [];
      const rects = nodes.map(node => {
        if (node.nodeType === Node.ELEMENT_NODE) return node.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getBoundingClientRect();
      });
      const groups = [];
      nodes.forEach((node, index) => {
        const rect = rects[index];
        const current = groups[groups.length - 1];
        if (!current || Math.abs(rect.top - current.top) > Math.max(8, rect.height * 0.5)) {
          groups.push({ top: rect.top, nodes: [node] });
        } else {
          current.nodes.push(node);
        }
      });
      return groups;
    };

    const splitObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px' });

    document.querySelectorAll('main h1, main h2').forEach(heading => {
      if (heading.closest('[hidden]') || heading.closest('.project-modal')) return;
      const groups = groupInlineLines(heading);
      if (groups.length < 1) return;
      const fragment = document.createDocumentFragment();
      groups.forEach((group, index) => {
        const line = document.createElement('span');
        const inner = document.createElement('span');
        line.className = 'split-line';
        inner.className = 'split-inner';
        inner.style.setProperty('--split-delay', `${index * 110}ms`);
        group.nodes.forEach(node => inner.append(node));
        line.append(inner);
        fragment.append(line);
      });
      heading.querySelectorAll('br').forEach(br => br.remove());
      [...heading.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
      });
      heading.append(fragment);
      heading.classList.add('is-split');
      if (!heading.classList.contains('reveal')) splitObserver.observe(heading);
    });
  }

  /* ---------- WORD-LEVEL STAGGER ----------
     Runs before the .reveal observer below so the .reveal classes we
     add here get picked up and observed. */
  if (!prefersReducedMotion) {
    const WORD_TARGETS = [
      '.lede', '.page-intro', '.story-copy p', '.member p', '.work-row p',
      '.activity p', '.contact-info p', '.value-list p',
      '.featured-copy > p:not(.project-index)', '.quote-section blockquote'
    ].join(',');

    document.querySelectorAll(WORD_TARGETS).forEach(paragraph => {
      // leave anything interactive or already animated alone
      if (paragraph.closest('.split-line, .reveal-words')) return;
      if (paragraph.querySelector('a, button, input, select, textarea')) return;
      if (paragraph.textContent.trim().length < 24) return;

      const words = [];
      paragraph.childNodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(' ')); return; }
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = part;
          fragment.append(span);
          words.push(span);
        });
        node.replaceWith(fragment);
      });
      if (words.length < 3) return;
      // 26ms apart, capped so long paragraphs don't crawl
      const step = Math.min(26, 1400 / words.length);
      words.forEach((word, index) => {
        word.style.setProperty('--wd', Math.round(index * step) + 'ms');
      });
      paragraph.classList.add('reveal', 'reveal-words');
    });

    // numbers and figure rows cascade in
    document.querySelectorAll('.stats, .value-list').forEach(group => {
      if (group.querySelector('[data-stagger-children]')) return;
      group.setAttribute('data-stagger-children', '');
      [...group.children].forEach((child, index) => child.style.setProperty('--i', index));
    });
  }

  /* Stagger siblings, not the whole document. The previous index was
     document-wide, so delays were effectively arbitrary. */
  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = el.parentElement
      ? [...el.parentElement.children].filter(child => child.classList.contains('reveal'))
      : [el];
    const index = siblings.indexOf(el);
    el.style.transitionDelay = siblings.length > 1 ? `${Math.min(index, 4) * 70}ms` : '0ms';
    revealObserver.observe(el);
  });

  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const target = counter.dataset.stat
      ? organizationStats[counter.dataset.stat]
      : Number(counter.dataset.count);
    counter.dataset.target = String(target ?? 0);
    counter.setAttribute('aria-label', String(target ?? 0));
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCounter = counter => {
    const target = Number(counter.dataset.target);
    if (reduceMotion) {
      counter.textContent = String(target);
      return;
    }
    const duration = 1400;
    const startTime = performance.now();
    const update = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.65 });
  counters.forEach(counter => counterObserver.observe(counter));

  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.answer');
      const open = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item button[aria-expanded="true"]').forEach(other => {
        if (other !== button) {
          other.setAttribute('aria-expanded', 'false');
          other.querySelector('b').textContent = '+';
          other.closest('.faq-item').querySelector('.answer').style.maxHeight = null;
        }
      });
      button.setAttribute('aria-expanded', String(!open));
      button.querySelector('b').textContent = open ? '+' : '−';
      answer.style.maxHeight = open ? null : `${answer.scrollHeight}px`;
    });
  });

  const filterButtons = document.querySelectorAll('.filters button');
  const projects = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projects.forEach(project => project.classList.toggle('hidden', filter !== 'all' && project.dataset.category !== filter));
  }));

  const modal = document.querySelector('.project-modal');
  let lastFocused;
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocused?.focus();
  };
  document.querySelectorAll('.project-open').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    lastFocused = button;
    modal.querySelector('img').src = card.querySelector('img').src;
    modal.querySelector('img').alt = card.querySelector('img').alt;
    modal.querySelector('#modal-title').textContent = card.dataset.title;
    modal.querySelector('.modal-category').textContent = card.dataset.category;
    modal.querySelector('.modal-date').textContent = card.dataset.date;
    modal.querySelector('.modal-location').textContent = card.dataset.location;
    modal.querySelector('.modal-description').textContent = card.dataset.description;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
  }));
  modal?.querySelector('.modal-close').addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal && !modal.hidden) closeModal(); });

  /* ---------- FEEDBACK — floating button (every page) + wall (homepage) ----------
     The form lives in a panel toggled by the corner ✦ FAB so it exists on
     every page; the wall element only exists on the homepage. Shared wall
     via /api/feedback (Vercel Blob); when the API is unreachable (file://
     preview, offline) submissions fall back to this browser's own store.
     Cards are built with textContent so messages can never inject markup. */
  const fabRoot = document.createElement('div');
  fabRoot.className = 'fb-fab-root';
  fabRoot.innerHTML = `
    <div class="fb-panel" id="fb-panel" hidden>
      <div class="fb-panel-head">
        <h3>Share your <em>feedback</em></h3>
        <button type="button" class="fb-panel-close" aria-label="Close feedback form">✕</button>
      </div>
      <form class="feedback-form" novalidate>
        <input type="text" name="website" class="form-trap" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="field"><label for="fb-name">Name</label><input id="fb-name" name="name" maxlength="60"
            placeholder="Anonymous" autocomplete="name"></div>
        <div class="field"><label for="fb-text">Message</label><textarea id="fb-text" name="text" rows="4"
            required maxlength="1000" placeholder="Tell us what you think…"></textarea></div>
        <div class="field fb-rating-field">
          <span class="fb-rating-label" id="fb-rating-label">Your rating</span>
          <div class="star-rating" role="radiogroup" aria-labelledby="fb-rating-label">
            <input type="radio" name="rating" id="fb-star1" value="1" required><label for="fb-star1"
              aria-label="1 star">★</label>
            <input type="radio" name="rating" id="fb-star2" value="2"><label for="fb-star2"
              aria-label="2 stars">★</label>
            <input type="radio" name="rating" id="fb-star3" value="3"><label for="fb-star3"
              aria-label="3 stars">★</label>
            <input type="radio" name="rating" id="fb-star4" value="4"><label for="fb-star4"
              aria-label="4 stars">★</label>
            <input type="radio" name="rating" id="fb-star5" value="5"><label for="fb-star5"
              aria-label="5 stars">★</label>
          </div>
        </div>
        <button class="text-link submit" type="submit">Share feedback <b>→</b></button>
        <p class="form-status" role="status"></p>
      </form>
    </div>
    <button type="button" class="fb-fab" aria-expanded="false" aria-controls="fb-panel"
      aria-label="Open the feedback form"><span aria-hidden="true">✦</span></button>
  `;
  document.body.append(fabRoot);

  const fbFab = fabRoot.querySelector('.fb-fab');
  const fbPanel = fabRoot.querySelector('.fb-panel');
  const fbSetOpen = open => {
    fbPanel.hidden = !open;
    fbFab.setAttribute('aria-expanded', String(open));
    if (open) fbPanel.querySelector('input[name="name"]')?.focus();
  };
  fbFab.addEventListener('click', () => fbSetOpen(fbPanel.hidden));
  fbPanel.querySelector('.fb-panel-close').addEventListener('click', () => fbSetOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !fbPanel.hidden) fbSetOpen(false); });

  const feedbackForm = fabRoot.querySelector('.feedback-form');
  const status = feedbackForm.querySelector('.form-status');
  const wall = document.querySelector('.feedback-wall');
  const LOCAL_KEY = 'ordo-feedback';

  const makeCard = entry => {
    const card = document.createElement('article');
    card.className = 'feedback-card';
    const head = document.createElement('div');
    head.className = 'feedback-card-head';
    const mark = document.createElement('span');
    mark.className = 'feedback-card-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✦';
    const who = document.createElement('span');
    who.className = 'feedback-card-name';
    who.textContent = entry.name || 'Anonymous';
    head.append(mark, who);
    const rating = Math.round(Number(entry.rating));
    if (rating >= 1 && rating <= 5) {
      const stars = document.createElement('span');
      stars.className = 'feedback-card-rating';
      stars.setAttribute('aria-label', `Rated ${rating} out of 5`);
      const filled = document.createElement('span');
      filled.setAttribute('aria-hidden', 'true');
      filled.textContent = '★'.repeat(rating);
      const blank = document.createElement('span');
      blank.className = 'is-empty';
      blank.setAttribute('aria-hidden', 'true');
      blank.textContent = '☆'.repeat(5 - rating);
      stars.append(filled, blank);
      head.append(stars);
    }
    const when = document.createElement('time');
    const date = new Date(entry.at);
    if (!isNaN(date)) {
      when.dateTime = date.toISOString();
      when.textContent = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    head.append(when);
    const text = document.createElement('p');
    text.className = 'feedback-card-text';
    text.textContent = entry.text;
    card.append(head, text);
    return card;
  };

  const renderWall = entries => {
    wall.textContent = '';
    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'feedback-empty';
      empty.textContent = 'No feedback yet — be the first to share.';
      wall.append(empty);
      return;
    }
    entries.forEach(entry => wall.append(makeCard(entry)));
  };

  const localEntries = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; }
  };

  if (wall) {
    fetch('/api/feedback')
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => renderWall(Array.isArray(data.feedback) ? data.feedback : []))
      .catch(() => renderWall(localEntries().reverse()));
  }

  feedbackForm.addEventListener('submit', async event => {
    event.preventDefault();
    const textInput = feedbackForm.elements.text;
    const payload = {
      name: feedbackForm.elements.name.value.trim(),
      text: textInput.value.trim(),
      website: feedbackForm.elements.website.value
    };
    if (payload.text.length < 3) {
      status.className = 'form-status is-error';
      status.textContent = 'Please write a message first.';
      textInput.focus();
      return;
    }
    const rating = Number(feedbackForm.elements.rating?.value);
    if (!(rating >= 1 && rating <= 5)) {
      status.className = 'form-status is-error';
      status.textContent = 'Please pick a star rating.';
      feedbackForm.querySelector('.star-rating input')?.focus();
      return;
    }
    payload.rating = rating;
    const submit = feedbackForm.querySelector('[type="submit"]');
    submit.disabled = true;
    status.className = 'form-status is-sending';
    status.textContent = 'Sharing your feedback…';

    let response = null;
    let data = {};
    try {
      response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await response.json().catch(() => ({}));
    } catch { /* API unreachable → local fallback below */ }

    if (response && response.ok) {
      if (wall) {
        wall.querySelector('.feedback-empty')?.remove();
        wall.prepend(makeCard(data.feedback || payload));
      }
      status.className = 'form-status is-success';
      status.textContent = 'Thank you — your feedback is on the wall.';
      feedbackForm.reset();
    } else if (response) {
      // API reachable but refused (validation, rate limit) — surface it
      status.className = 'form-status is-error';
      status.textContent = data.error || 'Could not share your feedback — try again.';
    } else {
      // local preview / offline: keep the entry in this browser
      const entry = { name: payload.name || 'Anonymous', text: payload.text, rating: payload.rating, at: new Date().toISOString() };
      const stored = localEntries();
      stored.push(entry);
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(stored)); } catch { /* private mode */ }
      if (wall) {
        wall.querySelector('.feedback-empty')?.remove();
        wall.prepend(makeCard(entry));
      }
      status.className = 'form-status is-success';
      status.textContent = wall ? 'Saved — shown here on your device.' : 'Saved on this device — visit the homepage wall to see it.';
      feedbackForm.reset();
    }
    submit.disabled = false;
  });

  /* ---------- ACCOUNT — header link (every page) + login/member/admin pages ----------
     Basic school-project auth: email + password compared server-side,
     session kept in an HttpOnly cookie. See api/auth.mjs + lib/auth.mjs. */
  fetch('/api/auth')
    .then(response => (response.ok ? response.json() : null))
    .then(data => {
      const user = data?.user;
      const label = !user ? 'Login' : user.role === 'org' ? 'Dashboard' : 'My bookings';
      const href = !user ? 'login.html' : user.role === 'org' ? 'admin.html' : 'member.html';
      document.querySelectorAll('.nav-right').forEach(group => {
        const link = document.createElement('a');
        link.className = 'nav-account';
        link.href = href;
        link.textContent = label;
        group.append(link);
      });
      document.querySelectorAll('.mobile-menu').forEach(menu => {
        const link = document.createElement('a');
        link.className = 'nav-account';
        link.href = href;
        link.textContent = label;
        menu.append(link);
      });
    })
    .catch(() => { /* offline / file:// preview — skip quietly */ });

  const authForm = document.querySelector('.auth-form');
  if (authForm) {
    const status = authForm.querySelector('.form-status');
    const nameField = authForm.querySelector('.auth-name-field');
    const submit = authForm.querySelector('[type="submit"]');
    const switchBtn = authForm.querySelector('.auth-switch-btn');
    const switchPrompt = authForm.querySelector('.auth-switch-prompt');
    let mode = 'login';
    const setMode = next => {
      mode = next;
      nameField.hidden = mode !== 'signup';
      authForm.elements.name.required = mode === 'signup';
      submit.firstChild.textContent = mode === 'signup' ? 'Create account ' : 'Sign in ';
      switchPrompt.textContent = mode === 'signup' ? 'Already have an account?' : 'New here?';
      switchBtn.textContent = mode === 'signup' ? 'Sign in' : 'Create an account';
      status.textContent = '';
    };
    switchBtn.addEventListener('click', () => setMode(mode === 'login' ? 'signup' : 'login'));

    // already signed in? go straight to the right page
    fetch('/api/auth')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (data?.user) location.replace(data.user.role === 'org' ? 'admin.html' : 'member.html');
      })
      .catch(() => {});

    authForm.addEventListener('submit', async event => {
      event.preventDefault();
      const email = authForm.elements.email.value.trim();
      const password = authForm.elements.password.value;
      const name = authForm.elements.name.value.trim();
      if (!email || !password) {
        status.className = 'form-status is-error';
        status.textContent = 'Email and password are required.';
        return;
      }
      if (mode === 'signup' && !name) {
        status.className = 'form-status is-error';
        status.textContent = 'Please enter your name.';
        authForm.elements.name.focus();
        return;
      }
      submit.disabled = true;
      status.className = 'form-status is-sending';
      status.textContent = mode === 'signup' ? 'Creating your account…' : 'Signing in…';
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: mode, email, password, name })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          status.className = 'form-status is-error';
          status.textContent = data.error || 'Something went wrong — try again.';
          submit.disabled = false;
          return;
        }
        location.replace(data.user?.role === 'org' ? 'admin.html' : 'member.html');
      } catch {
        status.className = 'form-status is-error';
        status.textContent = 'Could not reach the server — check your connection.';
        submit.disabled = false;
      }
    });
  }

  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    const status = bookingForm.querySelector('.form-status');
    const list = document.querySelector('.booking-list');
    const nameInput = bookingForm.elements.name;

    const renderBookings = entries => {
      list.textContent = '';
      if (!entries.length) {
        const empty = document.createElement('p');
        empty.className = 'booking-empty';
        empty.textContent = 'No bookings yet — your submissions will appear here.';
        list.append(empty);
        return;
      }
      entries.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'booking-row';
        const head = document.createElement('div');
        head.className = 'booking-row-head';
        const type = document.createElement('span');
        type.className = 'booking-row-type';
        type.textContent = entry.type;
        const when = document.createElement('time');
        when.textContent = entry.date;
        const count = document.createElement('span');
        count.className = 'booking-row-count';
        count.textContent = `${entry.headcount} guests`;
        head.append(type, when, count);
        const text = document.createElement('p');
        text.className = 'booking-row-message';
        text.textContent = entry.message;
        card.append(head, text);
        list.append(card);
      });
    };

    const loadBookings = () => fetch('/api/bookings')
      .then(response => {
        if (response.status === 401) { location.replace('login.html'); return null; }
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => { if (data) renderBookings(Array.isArray(data.bookings) ? data.bookings : []); })
      .catch(() => {
        list.textContent = '';
        const empty = document.createElement('p');
        empty.className = 'booking-empty';
        empty.textContent = 'Could not load bookings — refresh the page.';
        list.append(empty);
      });

    fetch('/api/auth')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (!data?.user) { location.replace('login.html'); return; }
        if (!nameInput.value) nameInput.placeholder = data.user.name || 'Your full name';
        loadBookings();
      })
      .catch(() => loadBookings());

    bookingForm.addEventListener('submit', async event => {
      event.preventDefault();
      const payload = {
        name: nameInput.value.trim(),
        type: bookingForm.elements.type.value,
        date: bookingForm.elements.date.value,
        headcount: bookingForm.elements.headcount.value,
        message: bookingForm.elements.message.value.trim()
      };
      if (!payload.type) {
        status.className = 'form-status is-error';
        status.textContent = 'Please pick an event type.';
        return;
      }
      if (!payload.date) {
        status.className = 'form-status is-error';
        status.textContent = 'Please pick an event date.';
        return;
      }
      if (!payload.headcount || Number(payload.headcount) < 1) {
        status.className = 'form-status is-error';
        status.textContent = 'Please enter a headcount.';
        return;
      }
      if (payload.message.length < 3) {
        status.className = 'form-status is-error';
        status.textContent = 'Please add a short message about the event.';
        return;
      }
      const submit = bookingForm.querySelector('[type="submit"]');
      submit.disabled = true;
      status.className = 'form-status is-sending';
      status.textContent = 'Sending your booking…';
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          status.className = 'form-status is-error';
          status.textContent = data.error || 'Could not save your booking — try again.';
        } else {
          status.className = 'form-status is-success';
          status.textContent = 'Booking sent — the organization will get back to you.';
          bookingForm.reset();
          loadBookings();
        }
      } catch {
        status.className = 'form-status is-error';
        status.textContent = 'Could not reach the server — check your connection.';
      }
      submit.disabled = false;
    });
  }

  document.querySelectorAll('.logout-btn').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'logout' })
        });
      } catch { /* still leave the page */ }
      location.replace('login.html');
    });
  });

  const adminFeedbackList = document.querySelector('.admin-feedback-list');
  if (adminFeedbackList) {
    const adminBookingList = document.querySelector('.admin-booking-list');

    const emptyNote = text => {
      const note = document.createElement('p');
      note.className = 'booking-empty';
      note.textContent = text;
      return note;
    };

    const renderAdminBookings = entries => {
      adminBookingList.textContent = '';
      if (!entries.length) {
        adminBookingList.append(emptyNote('No bookings yet.'));
        return;
      }
      entries.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'booking-row';
        const head = document.createElement('div');
        head.className = 'booking-row-head';
        const type = document.createElement('span');
        type.className = 'booking-row-type';
        type.textContent = entry.type;
        const who = document.createElement('span');
        who.className = 'booking-row-email';
        who.textContent = `${entry.name} · ${entry.email}`;
        const when = document.createElement('time');
        when.textContent = entry.date;
        const count = document.createElement('span');
        count.className = 'booking-row-count';
        count.textContent = `${entry.headcount} guests`;
        head.append(type, who, when, count);
        const text = document.createElement('p');
        text.className = 'booking-row-message';
        text.textContent = entry.message;
        card.append(head, text);
        adminBookingList.append(card);
      });
    };

    const moderate = async (id, action) => {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id, action })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          alert(data.error || 'That action failed — try again.');
          return;
        }
        loadAdmin();
      } catch {
        alert('Could not reach the server — check your connection.');
      }
    };

    const renderAdminFeedback = entries => {
      adminFeedbackList.textContent = '';
      if (!entries.length) {
        adminFeedbackList.append(emptyNote('No feedback yet.'));
        return;
      }
      entries.forEach(entry => {
        const card = document.createElement('article');
        card.className = entry.hidden ? 'booking-row is-hidden' : 'booking-row';
        const head = document.createElement('div');
        head.className = 'booking-row-head';
        const who = document.createElement('span');
        who.className = 'booking-row-type';
        who.textContent = entry.name || 'Anonymous';
        head.append(who);
        const rating = Math.round(Number(entry.rating));
        if (rating >= 1 && rating <= 5) {
          const stars = document.createElement('span');
          stars.className = 'booking-row-count';
          stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
          head.append(stars);
        }
        if (entry.hidden) {
          const badge = document.createElement('span');
          badge.className = 'admin-badge';
          badge.textContent = 'Hidden';
          head.append(badge);
        }
        const when = document.createElement('time');
        const date = new Date(entry.at);
        if (!isNaN(date)) {
          when.textContent = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        }
        head.append(when);
        const text = document.createElement('p');
        text.className = 'booking-row-message';
        text.textContent = entry.text;
        const actions = document.createElement('div');
        actions.className = 'admin-actions';
        const hideBtn = document.createElement('button');
        hideBtn.type = 'button';
        hideBtn.textContent = entry.hidden ? 'Unhide' : 'Hide';
        hideBtn.addEventListener('click', () => moderate(entry.id, entry.hidden ? 'unhide' : 'hide'));
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
          if (confirm('Delete this feedback permanently?')) moderate(entry.id, 'delete');
        });
        actions.append(hideBtn, deleteBtn);
        card.append(head, text, actions);
        adminFeedbackList.append(card);
      });
    };

    const loadAdmin = () => {
      Promise.all([
        fetch('/api/bookings').then(response => (response.ok ? response.json() : { bookings: [] })),
        fetch('/api/feedback?all=1').then(response => (response.ok ? response.json() : { feedback: [] }))
      ])
        .then(([bookings, feedback]) => {
          renderAdminBookings(Array.isArray(bookings.bookings) ? bookings.bookings : []);
          renderAdminFeedback(Array.isArray(feedback.feedback) ? feedback.feedback : []);
        })
        .catch(() => {
          adminBookingList.textContent = '';
          adminBookingList.append(emptyNote('Could not load data — refresh the page.'));
          adminFeedbackList.textContent = '';
          adminFeedbackList.append(emptyNote('Could not load data — refresh the page.'));
        });
    };

    fetch('/api/auth')
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (!data?.user) { location.replace('login.html'); return; }
        if (data.user.role !== 'org') {
          adminBookingList.textContent = '';
          adminBookingList.append(emptyNote('This dashboard is for the organization account only.'));
          adminFeedbackList.textContent = '';
          adminFeedbackList.append(emptyNote('This dashboard is for the organization account only.'));
          return;
        }
        loadAdmin();
      })
      .catch(() => location.replace('login.html'));
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    form.action = 'https://formsubmit.co/c927bce93a8b2e16b581ecb1466f12f9';
    form.method = 'POST';
    form.insertAdjacentHTML('afterbegin', `
      <input type="hidden" name="_subject" value="New Ordo Duo Decim Event Inquiry">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="text" name="_honey" class="form-trap" tabindex="-1" autocomplete="off" aria-hidden="true">
    `);
    const contactBlocks = [...document.querySelectorAll('.contact-info > div')];
    const contactBlock = label => contactBlocks.find(block => block.querySelector('span')?.textContent.trim() === label);
    const emailBlock = contactBlock('Email');
    if (emailBlock) emailBlock.innerHTML = '<span>Email</span><a href="mailto:jdbonon23-1329@cca.edu.ph">jdbonon23-1329@cca.edu.ph</a>';
    const addressBlock = contactBlock('Address');
    if (addressBlock) addressBlock.innerHTML = '<span>Address</span><p>Arayat Boulevard, Brgy. Pampang<br>Angeles City, 2009</p>';
    const phoneBlock = contactBlock('Phone');
    if (phoneBlock) phoneBlock.innerHTML = '<span>Phone</span><a href="tel:+639941810919">0994 181 0919</a>';
    const facebookBlock = contactBlock('Facebook');
    if (facebookBlock) facebookBlock.innerHTML = '<span>Facebook</span><a href="https://www.facebook.com/share/19VWYMyxks/" target="_blank" rel="noopener noreferrer">Ordo Duo Decim ↗</a>';
    const hoursBlock = contactBlock('Business Hours');
    if (hoursBlock) hoursBlock.innerHTML = '<span>Business Hours</span><p>Monday–Friday<br>8:00 AM–5:00 PM</p>';
    const status = form.querySelector('.form-status');
    if (status) status.textContent = 'Your inquiry will be sent securely by email.';
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      const originalLabel = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending…';
      status.className = 'form-status is-sending';
      status.textContent = 'Sending your inquiry…';

      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const response = await fetch('https://formsubmit.co/ajax/c927bce93a8b2e16b581ecb1466f12f9', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'The email service rejected the submission.');
        }
        form.reset();
        status.className = 'form-status is-success';
        status.textContent = result.message || 'Inquiry sent. Please check the receiving inbox.';
      } catch (error) {
        status.className = 'form-status is-error';
        status.textContent = `${error.message} Please email jdbonon23-1329@cca.edu.ph directly.`;
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    });
  }
});
