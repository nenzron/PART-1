document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));

  initScrollReveal();
  initActiveNav();
  initMobileMenu();
  initLightbox();
  initProductSearch();
  initAccordion();
  initLeafletMap();
  initDeliveryForm();
  initContactForm();
  initEnquiryForm();
  initBackToTop();
});

function initScrollReveal() {
  const main = document.querySelector('main');
  if (!main) return;
  const els = main.querySelectorAll(':scope > div, :scope > ul > li, :scope > p, :scope > h2, :scope > h1, :scope > form');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${(i % 8) * 0.04}s, transform 0.4s ease ${(i % 8) * 0.04}s`;
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el) => obs.observe(el));
}

function initActiveNav() {
  const page = (window.location.pathname.split('/').pop() || '').replace(/ /g, '_');
  document.querySelectorAll('header nav a').forEach((a) => {
    const href = (a.getAttribute('href') || '').split('#')[0].replace(/ /g, '_');
    if (href === page) {
      a.style.fontWeight = '900';
      a.style.textDecoration = 'underline';
    }
  });
}

function initMobileMenu() {
  const nav = document.querySelector('header nav');
  if (!nav) return;
  const style = document.createElement('style');
  style.textContent = `.js-burger{display:none;flex-direction:column;justify-content:space-between;width:28px;height:20px;background:transparent;border:none;cursor:pointer;padding:0;}.js-burger span{display:block;width:100%;height:3px;background:#000;border-radius:3px;transition:transform .25s,opacity .25s}.js-burger.open span:nth-child(1){transform:translateY(8px) rotate(45deg)}.js-burger.open span:nth-child(2){opacity:0}.js-burger.open span:nth-child(3){transform:translateY(-8px) rotate(-45deg)}@media(max-width:640px){.js-burger{display:flex}header nav a{display:none;width:100%;padding:.5rem 1rem}}`;
  document.head.appendChild(style);
  const burger = document.createElement('button');
  burger.className = 'js-burger';
  burger.setAttribute('aria-label', 'Toggle navigation');
  burger.innerHTML = '<span></span><span></span><span></span>';
  const logoDiv = nav.querySelector('div');
  if (logoDiv) nav.insertBefore(burger, logoDiv.nextSibling);
  else nav.prepend(burger);
  const links = nav.querySelectorAll('a');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    links.forEach((a) => { a.style.display = open ? 'block' : ''; });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) { burger.classList.remove('open'); links.forEach((a) => { a.style.display = ''; }); }
  });
}

function initLightbox() {
  const main = document.querySelector('main');
  if (!main) return;
  const images = main.querySelectorAll('div > img, li > img');
  if (!images.length) return;

  const overlay = document.createElement('div');
  overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;align-items:center;justify-content:center;padding:1rem;';
  overlay.innerHTML = `<div style="position:relative;background:#fff;border-radius:14px;padding:1.75rem;max-width:520px;width:100%;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.5)"><button id="lb-close" style="position:absolute;top:.5rem;right:.7rem;background:none;border:none;font-size:1.8rem;cursor:pointer;">&times;</button><button id="lb-prev" style="position:absolute;top:50%;left:-18px;transform:translateY(-50%);background:#e3001b;border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;">&#10094;</button><img id="lb-img" src="" alt="" style="max-width:100%;max-height:60vh;object-fit:contain;border-radius:8px;margin-bottom:.5rem;"><p id="lb-cap" style="font-weight:700;color:#555;margin:.3rem 0 0;font-size:.9rem;"></p><button id="lb-next" style="position:absolute;top:50%;right:-18px;transform:translateY(-50%);background:#e3001b;border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;">&#10095;</button></div>`;
  document.body.appendChild(overlay);

  const imgArr = [...images];
  let cur = 0;

  const show = () => {
    const img = imgArr[cur];
    document.getElementById('lb-img').src = img.src;
    const card = img.closest('div') || img.closest('li');
    const txt = card ? [...card.querySelectorAll('p, a')].map(p => p.textContent.trim()).filter(Boolean).join(' · ') : '';
    document.getElementById('lb-cap').textContent = txt;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const close = () => { overlay.style.display = 'none'; document.body.style.overflow = ''; };

  imgArr.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => { cur = i; show(); });
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter') { cur = i; show(); } });
    img.setAttribute('tabindex', '0');
  });

  document.getElementById('lb-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.getElementById('lb-prev').addEventListener('click', () => { cur = (cur - 1 + imgArr.length) % imgArr.length; show(); });
  document.getElementById('lb-next').addEventListener('click', () => { cur = (cur + 1) % imgArr.length; show(); });
  document.addEventListener('keydown', (e) => {
    if (overlay.style.display !== 'flex') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { cur = (cur - 1 + imgArr.length) % imgArr.length; show(); }
    if (e.key === 'ArrowRight') { cur = (cur + 1) % imgArr.length; show(); }
  });
}

function initProductSearch() {
  const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
  if (page !== 'product.html') return;
  const main = document.querySelector('main');
  if (!main) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem;';
  wrap.innerHTML = `<input type="search" id="js-search" placeholder="Search products..." aria-label="Search products" style="flex:1;min-width:220px;padding:.65rem 1.1rem;border:2px solid #ccc;border-radius:50px;font-size:1rem;"><span id="js-count" style="font-weight:700;color:#777;font-size:.9rem;white-space:nowrap;"></span>`;
  const firstH2 = main.querySelector('h2');
  if (firstH2) main.insertBefore(wrap, firstH2);

  const input = document.getElementById('js-search');
  const countEl = document.getElementById('js-count');

  const headings = [...main.querySelectorAll(':scope > h2')];
  const sections = headings.map((h2) => {
    const rows = [];
    let node = h2.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'DIV') rows.push(node);
      node = node.nextElementSibling;
    }
    return { h2, rows };
  });

  const allCards = sections.flatMap(s => s.rows.flatMap(r => [...r.children].filter(c => c.tagName === 'DIV')));
  const total = allCards.length;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    sections.forEach(({ h2, rows }) => {
      let secVisible = false;
      rows.forEach((row) => {
        let rowVisible = false;
        [...row.children].filter(c => c.tagName === 'DIV').forEach((card) => {
          const match = !q || card.textContent.toLowerCase().includes(q);
          card.style.display = match ? '' : 'none';
          if (match) { rowVisible = true; visible++; }
        });
        row.style.display = rowVisible ? '' : 'none';
        if (rowVisible) secVisible = true;
      });
      h2.style.display = (secVisible || !q) ? '' : 'none';
    });

    countEl.textContent = q ? `Showing ${visible} of ${total} products` : '';
  });
}

function initAccordion() {
  const headings = [...document.querySelectorAll('h2')];
  const h2 = headings.find(h => h.textContent.toLowerCase().includes('operating'));
  if (!h2) return;
  const ul = h2.nextElementSibling;
  if (!ul || ul.tagName !== 'UL') return;

  const wrapper = document.createElement('div');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.style.cssText = 'width:100%;text-align:left;background:#e3001b;color:#fff;border:none;border-radius:8px;font-size:1.05rem;font-weight:700;padding:.8rem 1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:space-between;';
  btn.innerHTML = 'View Operating Hours <span id="acc-arrow" style="transition:transform .3s;">&#9660;</span>';
  const panel = document.createElement('div');
  panel.style.cssText = 'max-height:0;overflow:hidden;transition:max-height .35s ease;';
  ul.parentNode.insertBefore(wrapper, ul);
  panel.appendChild(ul);
  wrapper.appendChild(btn);
  wrapper.appendChild(panel);

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.style.maxHeight = open ? '0' : panel.scrollHeight + 'px';
    document.getElementById('acc-arrow').style.transform = open ? '' : 'rotate(180deg)';
  });
}

function initLeafletMap() {
  const page = (window.location.pathname.split('/').pop() || '').toLowerCase();
  if (page !== 'contact.html') return;
  const iframe = document.querySelector('main iframe');
  if (!iframe) return;

  const mapDiv = document.createElement('div');
  mapDiv.id = 'leaflet-map';
  mapDiv.style.cssText = 'width:100%;height:340px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.15);margin:1rem 0;';
  iframe.parentNode.replaceChild(mapDiv, iframe);

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  document.head.appendChild(css);

  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
  s.onload = () => {
    const map = L.map('leaflet-map').setView([-26.3465095, 28.0953687], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
    const icon = L.divIcon({ className: '', html: '<div style="background:#e3001b;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);"></div>', iconSize: [34,34], iconAnchor: [17,34] });
    L.marker([-26.3465095, 28.0953687], { icon }).addTo(map).bindPopup('<b>Cascet Supermarket</b><br>92 Letaba Street, Brackendowns, Alberton').openPopup();
  };
  document.body.appendChild(s);
}

function initDeliveryForm() {
  const form = document.querySelector('main form');
  if (!form || form.id === 'contactForm' || form.id === 'enquiryForm') return;
  form.setAttribute('novalidate', '');

  const rules = {
    'name and surname': { label: 'Full Name', min: 2, pattern: /^[a-zA-Z\s'-]+$/, msg: 'Enter a valid full name.' },
    'ID': { label: 'ID Number', pattern: /^\d{13}$/, msg: 'SA ID must be exactly 13 digits.' },
    'phone': { label: 'Phone Number', pattern: /^0[6-8]\d{8}$/, msg: 'Enter a valid SA mobile number e.g. 0821234567.' },
    'city': { label: 'City/Suburb', min: 2, msg: 'Enter your city or suburb.' },
    'Adress': { label: 'Street Address', min: 5, msg: 'Enter your street address.' },
    'Postal code': { label: 'Postal Code', pattern: /^\d{4}$/, msg: 'Postal code must be 4 digits.' },
    'Card Number': { label: 'Card Number', pattern: /^\d{16}$/, msg: 'Card number must be 16 digits.' },
    'Building type': { label: 'Building Type', required: true, msg: 'Please select a building type.' },
  };

  const err = (field, msg) => {
    clearMsg(field);
    field.style.borderColor = '#cc0000';
    field.style.background = '#fff5f5';
    const span = document.createElement('span');
    span.className = 'js-err';
    span.style.cssText = 'display:block;color:#cc0000;font-size:.8rem;font-weight:700;margin:3px 0 4px;';
    span.textContent = msg;
    field.insertAdjacentElement('afterend', span);
  };

  const ok = (field) => {
    clearMsg(field);
    field.style.borderColor = '#007a33';
    field.style.background = '#f0fff6';
  };

  const clearMsg = (field) => {
    field.style.borderColor = '';
    field.style.background = '';
    const n = field.nextElementSibling;
    if (n && n.className === 'js-err') n.remove();
  };

  const validate = (field) => {
    const key = field.id || field.name;
    const rule = rules[key];
    if (!rule) return true;
    const val = field.value.trim();
    if (!val) { err(field, `${rule.label} is required.`); return false; }
    if (rule.min && val.length < rule.min) { err(field, rule.msg); return false; }
    if (rule.pattern && !rule.pattern.test(val)) { err(field, rule.msg); return false; }
    ok(field);
    return true;
  };

  form.querySelectorAll('input, select').forEach((f) => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => { if (f.style.borderColor === 'rgb(204, 0, 0)') validate(f); });
  });

  const submitBtn = form.querySelector('button[type="sumbit"], button[type="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let allOk = true;
      form.querySelectorAll('input, select').forEach((f) => { if (!validate(f)) allOk = false; });
      if (allOk) showModal('Order Placed!', 'Thank you for your order. We will contact you shortly to confirm your delivery details.');
      else { const first = form.querySelector('[style*="rgb(204, 0, 0)"]'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.setAttribute('novalidate', '');
  const responseBox = document.getElementById('contact-response');
  const EMAIL = 'cascet.supermarket@gmail.com';

  const err = (field, msg) => {
    clearMsg(field);
    field.style.borderColor = '#cc0000';
    field.style.background = '#fff5f5';
    const span = document.createElement('span');
    span.className = 'js-err';
    span.style.cssText = 'display:block;color:#cc0000;font-size:.8rem;font-weight:700;margin:3px 0 4px;';
    span.textContent = msg;
    field.insertAdjacentElement('afterend', span);
  };

  const ok = (field) => {
    clearMsg(field);
    field.style.borderColor = '#007a33';
    field.style.background = '#f0fff6';
  };

  const clearMsg = (field) => {
    field.style.borderColor = '';
    field.style.background = '';
    const n = field.nextElementSibling;
    if (n && n.className === 'js-err') n.remove();
  };

  const validate = (field) => {
    const val = field.value.trim();
    if (!val) { err(field, 'This field is required.'); return false; }
    if (field.id === 'contact-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { err(field, 'Enter a valid email address.'); return false; }
    if (field.id === 'contact-phone' && !/^0[6-8]\d{8}$/.test(val)) { err(field, 'Enter a valid SA number e.g. 0821234567.'); return false; }
    if (field.id === 'contact-message' && val.length < 10) { err(field, 'Please write at least 10 characters.'); return false; }
    ok(field);
    return true;
  };

  form.querySelectorAll('input, select, textarea').forEach((f) => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => { if (f.style.borderColor === 'rgb(204, 0, 0)') validate(f); });
  });

  document.getElementById('contact-submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    let allOk = true;
    form.querySelectorAll('input, select, textarea').forEach((f) => { if (!validate(f)) allOk = false; });
    if (!allOk) { const first = form.querySelector('[style*="rgb(204, 0, 0)"]'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value.trim();

    const subject = encodeURIComponent(`Cascet Supermarket - ${type} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage Type: ${type}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    responseBox.style.cssText = 'display:block;margin-top:1.5rem;padding:1.25rem 1.5rem;background:#f0fff6;border-left:4px solid #007a33;border-radius:8px;color:#1a3d1a;';
    responseBox.innerHTML = `<strong>Thank you, ${name}!</strong><br>Your email app should now be open with your message ready to send to <strong>${EMAIL}</strong>. If it did not open, please email us directly.`;
    responseBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
    form.querySelectorAll('input, select, textarea').forEach((f) => { f.style.borderColor = ''; f.style.background = ''; });
  });
}

function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;
  form.setAttribute('novalidate', '');
  const responseBox = document.getElementById('enquiry-response');

  const CATALOGUE = [
    { name: 'Onion', price: 5.99 }, { name: 'Tomatates', price: 5.99 }, { name: 'Peppers', price: 5.99 }, { name: 'Apple', price: 5.99 },
    { name: 'Doritos Grilled Barbeque', price: 25.99 }, { name: 'Doritos Sour Cream', price: 25.99 }, { name: 'Doritos Flaming Hot', price: 25.99 }, { name: 'Doritos Cheesy', price: 25.99 }, { name: 'Doritos Sweet Chilli', price: 25.99 },
    { name: 'Lays Barbeque', price: 25.99 }, { name: 'Lays Spring Onion', price: 25.99 }, { name: 'Lays Thai Sweet Chilli', price: 25.99 }, { name: 'Lays Caribbean Onion', price: 25.99 }, { name: 'Lays Salted', price: 25.99 },
    { name: 'Goslo', price: 6.99 }, { name: 'Jelly Jersey', price: 15.99 }, { name: 'Jelly Babies', price: 15.99 }, { name: 'Fruit Babies', price: 15.99 }, { name: 'Jelly Teddies', price: 15.99 }, { name: 'Sour Jellies', price: 15.99 }, { name: 'Wine Gums', price: 15.99 },
    { name: 'Toppers Mint Cream', price: 11.99 }, { name: 'Toppers Chocolate', price: 11.99 }, { name: 'Oreo Original', price: 20.99 }, { name: 'Romany', price: 46.99 }, { name: 'Tennis Classic Coconut', price: 29.99 },
    { name: 'Dairy Milk Nut n Raisen', price: 23.99 }, { name: 'Dairy Milk Nut', price: 23.99 }, { name: 'Dairy Milk Oreo', price: 31.99 }, { name: 'Dairy Milk Milk Chocolate', price: 23.99 }, { name: 'Dairy Milk Mint Chocolate', price: 23.99 },
    { name: 'Coke 1L', price: 19.99 }, { name: 'Coke 1.5L', price: 22.99 }, { name: 'Coke 2L', price: 29.99 }, { name: 'Coke 440ml', price: 14.99 }, { name: 'Coke Light 440ml', price: 14.99 }, { name: 'Coke Light 2.25L', price: 29.99 }, { name: 'Coke No Sugar 2L', price: 29.99 }, { name: 'Coke No Sugar 2.25L', price: 29.99 },
    { name: 'Creme Soda 2L', price: 22.99 }, { name: 'Sparberry 2L', price: 22.99 }, { name: 'Iron Brew 2L', price: 15.99 }, { name: 'Pine Nut 2L', price: 22.99 },
    { name: 'Sprite 1L', price: 19.99 }, { name: 'Sprite 1.5L', price: 22.99 }, { name: 'Sprite 2L', price: 28.99 },
    { name: 'Stoney 440ml', price: 14.99 }, { name: 'Stoney 1.5L', price: 21.99 }, { name: 'Stoney 2L', price: 28.99 },
    { name: 'Sparkling Water 2L', price: 15.99 }, { name: 'Still Water 2L', price: 15.99 }, { name: 'Tonic 1L', price: 19.99 }, { name: 'Milk 2L', price: 25.99 },
    { name: 'BIC Blue Pens', price: 39.99 }, { name: 'Colour Pens', price: 55.99 }, { name: 'Hard Cover Book', price: 20.99 }, { name: 'Scissors', price: 33.99 }, { name: 'Ruler', price: 8.99 }, { name: 'Highlighter', price: 39.99 },
    { name: 'Airpops', price: 109.99 }, { name: 'Vuse', price: 109.99 }, { name: 'Elf Bar', price: 209.99 }, { name: 'Nasty', price: 249.99 }, { name: 'Camel', price: 65.99 }, { name: 'Gold Leaf', price: 26.99 }, { name: 'Pall Mall', price: 44.99 },
    { name: 'Magnum Classic 5 Pack', price: 123.99 }, { name: 'Oreo Ice Cream 440ml', price: 129.99 }, { name: 'Rich n Creamy 1.8L', price: 79.99 }, { name: 'Country Fresh 1.8L', price: 65.99 }, { name: 'King Cone', price: 26.99 },
    { name: 'Brown Loaf', price: 13.99 }, { name: 'White Loaf', price: 12.99 }, { name: 'Albany Brown Bread', price: 19.99 }, { name: 'Albany White Bread', price: 21.99 }, { name: 'Sasko Brown Bread', price: 19.99 }, { name: 'Sasko White Bread', price: 21.99 },
  ];

  const find = (q) => {
    const s = q.toLowerCase().trim();
    return CATALOGUE.find(p => p.name.toLowerCase() === s) || CATALOGUE.find(p => p.name.toLowerCase().includes(s) || s.includes(p.name.toLowerCase())) || null;
  };

  const err = (field, msg) => {
    clearMsg(field);
    field.style.borderColor = '#cc0000';
    field.style.background = '#fff5f5';
    const span = document.createElement('span');
    span.className = 'js-err';
    span.style.cssText = 'display:block;color:#cc0000;font-size:.8rem;font-weight:700;margin:3px 0 4px;';
    span.textContent = msg;
    field.insertAdjacentElement('afterend', span);
  };

  const ok = (field) => {
    clearMsg(field);
    field.style.borderColor = '#007a33';
    field.style.background = '#f0fff6';
  };

  const clearMsg = (field) => {
    field.style.borderColor = '';
    field.style.background = '';
    const n = field.nextElementSibling;
    if (n && n.className === 'js-err') n.remove();
  };

  const validate = (field) => {
    const val = field.value.trim();
    if (!val) { err(field, 'This field is required.'); return false; }
    if (field.id === 'enquiry-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { err(field, 'Enter a valid email address.'); return false; }
    if (field.id === 'enquiry-phone' && !/^0[6-8]\d{8}$/.test(val)) { err(field, 'Enter a valid SA number e.g. 0821234567.'); return false; }
    if (field.id === 'enquiry-quantity' && (isNaN(val) || Number(val) < 1)) { err(field, 'Quantity must be at least 1.'); return false; }
    ok(field);
    return true;
  };

  form.querySelectorAll('input, select').forEach((f) => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => { if (f.style.borderColor === 'rgb(204, 0, 0)') validate(f); });
  });

  document.getElementById('enquiry-submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    let allOk = true;
    form.querySelectorAll('input[required], select[required]').forEach((f) => { if (!validate(f)) allOk = false; });
    if (!allOk) { const first = form.querySelector('[style*="rgb(204, 0, 0)"]'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const name = document.getElementById('enquiry-name').value.trim();
    const product = document.getElementById('enquiry-product').value.trim();
    const qty = Number(document.getElementById('enquiry-quantity').value);
    const match = find(product);

    responseBox.style.display = 'block';
    if (match) {
      const total = (match.price * qty).toFixed(2);
      responseBox.style.cssText = 'display:block;margin-top:1.5rem;padding:1.25rem 1.5rem;background:#f0fff6;border-left:4px solid #007a33;border-radius:8px;color:#1a3d1a;';
      responseBox.innerHTML = `<strong>Good news, ${name}!</strong><br><strong>${match.name}</strong> is in stock at Cascet Supermarket.<br>Price: <strong>R${match.price.toFixed(2)}</strong> each &nbsp;|&nbsp; Quantity: <strong>${qty}</strong> &nbsp;|&nbsp; Estimated total: <strong>R${total}</strong><br><br>Pop in at 92 Letaba Street, Brackendowns or call 011 082 9055 to confirm before you arrive.`;
    } else {
      responseBox.style.cssText = 'display:block;margin-top:1.5rem;padding:1.25rem 1.5rem;background:#fff8e6;border-left:4px solid #cc8800;border-radius:8px;color:#664500;';
      responseBox.innerHTML = `<strong>Thanks for your enquiry, ${name}.</strong><br>We could not find <strong>${product}</strong> in our current catalogue, but our team will check stock and get back to you within 1 business day.`;
    }
    responseBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function showModal(title, msg) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML = `<div style="background:#fff;border-radius:14px;padding:2.25rem 2rem;max-width:400px;width:100%;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.45);"><div style="font-size:2.6rem;margin-bottom:.5rem;">&#9989;</div><h3 style="color:#e3001b;margin-bottom:.6rem;">${title}</h3><p style="color:#666;margin-bottom:1.4rem;line-height:1.6;">${msg}</p><button onclick="this.closest('div[style*=fixed]').remove();document.body.style.overflow='';" style="background:#e3001b;color:#fff;border:none;border-radius:8px;font-weight:700;padding:.7rem 2.2rem;cursor:pointer;">Close</button></div>`;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', (e) => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { modal.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); } });
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8593;';
  btn.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;background:#e3001b;color:#fff;border:none;border-radius:50%;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 14px rgba(227,0,27,.4);opacity:0;transform:translateY(16px);transition:opacity .25s,transform .25s;z-index:500;display:flex;align-items:center;justify-content:center;';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(16px)';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
