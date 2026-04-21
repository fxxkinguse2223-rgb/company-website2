/* ============================================
   Navigation
   ============================================ */
const header     = document.querySelector('.header');
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

// Sticky header
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  animObserver.observe(el);
});

/* ============================================
   Counter Animation
   ============================================ */
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ============================================
   Contact Form Validation
   ============================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    lastName:  { el: document.getElementById('lastName'),  msg: document.getElementById('err-lastName'),  validate: v => v.trim().length > 0,   hint: '姓を入力してください' },
    firstName: { el: document.getElementById('firstName'), msg: document.getElementById('err-firstName'), validate: v => v.trim().length > 0,   hint: '名を入力してください' },
    company:   { el: document.getElementById('company'),   msg: document.getElementById('err-company'),   validate: v => v.trim().length > 0,   hint: '会社名を入力してください' },
    email:     { el: document.getElementById('email'),     msg: document.getElementById('err-email'),     validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), hint: '正しいメールアドレスを入力してください' },
    inquiry:   { el: document.getElementById('inquiry'),   msg: document.getElementById('err-inquiry'),   validate: v => v !== '',              hint: 'お問い合わせ種別を選択してください' },
    message:   { el: document.getElementById('message'),   msg: document.getElementById('err-message'),   validate: v => v.trim().length >= 10, hint: '10文字以上でご記入ください' },
  };
  const privacyCheck = document.getElementById('privacyCheck');
  const privacyErr   = document.getElementById('err-privacy');

  function validateField(key) {
    const { el, msg, validate, hint } = fields[key];
    const val = el.value;
    const ok  = validate(val);
    el.classList.toggle('error', !ok);
    if (msg) {
      msg.textContent = ok ? '' : hint;
      msg.classList.toggle('visible', !ok);
    }
    return ok;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur',  () => validateField(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(key);
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(fields).forEach(key => {
      if (!validateField(key)) valid = false;
    });

    if (!privacyCheck.checked) {
      privacyErr.classList.add('visible');
      valid = false;
    } else {
      privacyErr.classList.remove('visible');
    }

    if (!valid) {
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate form submission (GitHub Pages — static hosting)
    const btn = contactForm.querySelector('.form-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = '送信中...';

    setTimeout(() => {
      document.getElementById('formArea').style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
    }, 1200);
  });
}
