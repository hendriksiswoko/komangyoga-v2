// ===== Sticky nav solid on scroll =====
const nav = document.querySelector('.site-nav');
const onScroll = () => {
  if (window.scrollY > 40) nav?.classList.add('solid');
  else nav?.classList.remove('solid');
};
window.addEventListener('scroll', onScroll);
onScroll();

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.textContent = '☰';
}));

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
  el.style.setProperty('--i', i % 8);
  io.observe(el);
});

// ===== Hero carousel: 4 slides, 3s interval =====
const heroSlides = document.querySelectorAll('.hero-slide');
const heroTexts = document.querySelectorAll('.hero-text');
const heroDots = document.querySelectorAll('.hero-dot');
if (heroSlides.length) {
  let heroIndex = 0;
  const showHeroSlide = (i) => {
    heroSlides.forEach(s => s.classList.remove('active'));
    heroTexts.forEach(t => t.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    heroSlides[i].classList.add('active');
    heroTexts[i]?.classList.add('active');
    heroDots[i]?.classList.add('active');
  };
  showHeroSlide(0);
  let heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 3000);
  const restartHeroTimer = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    }, 3000);
  };
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      heroIndex = i;
      showHeroSlide(heroIndex);
      restartHeroTimer();
    });
  });
  document.querySelector('.hero-arrow.next')?.addEventListener('click', () => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
    restartHeroTimer();
  });
  document.querySelector('.hero-arrow.prev')?.addEventListener('click', () => {
    heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(heroIndex);
    restartHeroTimer();
  });
}

// ===== Testimonial / Review carousel (3 at a time) =====
const reviewData = [
  { name: 'Sarah M.', place: 'Australia', avatar: 'assets/images/reviews/reviewer-01-sarah.jpg', quote: 'Komang picked us up on time and knew exactly which spots to skip the crowds. Felt like traveling with a friend, not a stranger.' },
  { name: 'Julien P.', place: 'France', avatar: 'assets/images/reviews/reviewer-02-julien.jpg', quote: 'Honest pricing from the start, no surprise add-ons. The car was clean and cold, and he waited patiently at every stop.' },
  { name: 'Aiko T.', place: 'Japan', avatar: 'assets/images/reviews/reviewer-03-aiko.jpg', quote: 'We changed our route halfway through the day and he was totally flexible about it. Best day of our whole Bali trip.' },
  { name: 'Marco B.', place: 'Italy', avatar: 'assets/images/reviews/reviewer-04-marco.jpg', quote: 'Very professional and warm. He explained the history behind every temple we visited without us even asking.' },
  { name: 'Priya K.', place: 'India', avatar: 'assets/images/reviews/reviewer-05-priya.jpg', quote: 'Booked last minute and he still made time for us. The whole day felt relaxed, never rushed between stops.' },
  { name: 'Lucas F.', place: 'Brazil', avatar: 'assets/images/reviews/reviewer-06-lucas.jpg', quote: 'Best decision of our trip. Comfortable car, great music, and he knew all the best photo spots in Nusa Penida.' }
];
const reviewTrack = document.getElementById('reviewTrack');
if (reviewTrack) {
  let reviewStart = 0;
  const renderReviews = () => {
    reviewTrack.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const r = reviewData[(reviewStart + i) % reviewData.length];
      const card = document.createElement('div');
      card.className = 'review-card';
      card.style.setProperty('--i', i);
      card.innerHTML = `
        <div class="review-person-row">
          <img class="review-avatar" src="${r.avatar}" alt="${r.name}">
          <div class="review-person"><b>${r.name}</b><span>${r.place}</span></div>
        </div>
        <div class="review-stars">★★★★★</div>
        <p class="review-quote">"${r.quote}"</p>
      `;
      reviewTrack.appendChild(card);
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('show')));
    }
  };
  renderReviews();
  document.querySelector('.review-arrow.next')?.addEventListener('click', () => {
    reviewStart = (reviewStart + 1) % reviewData.length;
    renderReviews();
  });
  document.querySelector('.review-arrow.prev')?.addEventListener('click', () => {
    reviewStart = (reviewStart - 1 + reviewData.length) % reviewData.length;
    renderReviews();
  });
}

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ===== Animated counters =====
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target + suffix; return; }
      el.textContent = cur + suffix;
      requestAnimationFrame(tick);
    };
    tick();
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterIO.observe(el));
