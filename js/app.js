// Axces Seven Exims / DKB - Main Application Controller (Supabase Integrated)

document.addEventListener('DOMContentLoaded', async () => {
  // App State
  let currentLang = localStorage.getItem('dkb_lang') || 'en';
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedPacks = {}; // productId -> "250g"
  let currentCheckoutItems = []; // holds items for the checkout modal
  let allProducts = [];
  let cachedCMS = null;
  let cachedTestimonials = [];

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langLabel = document.getElementById('lang-label');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewModalBody = document.getElementById('quick-view-modal-body');
  const exportModal = document.getElementById('export-modal');
  const orderCheckoutModal = document.getElementById('order-checkout-modal');
  const orderItemsSummary = document.getElementById('order-items-summary');
  const orderCheckoutForm = document.getElementById('order-checkout-form');
  const toastContainer = document.getElementById('toast-container');

  // Load products from Supabase
  async function loadProducts() {
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #d4af37;">
          <div style="display: inline-block; width: 36px; height: 36px; border: 3px solid rgba(212,175,55,0.3); border-top-color: #d4af37; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="margin-top: 0.8rem; font-size: 0.9rem;">Loading authentic vadagams...</p>
        </div>
      `;
    }

    try {
      if (window.ProductService) {
        allProducts = await window.ProductService.getProducts('all', '');
      } else if (typeof PRODUCTS_DATA !== 'undefined') {
        allProducts = PRODUCTS_DATA;
      }
    } catch (e) {
      console.error('Error fetching products:', e);
      if (typeof PRODUCTS_DATA !== 'undefined') {
        allProducts = PRODUCTS_DATA;
      }
    }

    // Initialize selected pack sizes
    allProducts.forEach(p => {
      if (!selectedPacks[p.id]) {
        selectedPacks[p.id] = '250g';
      }
    });

    renderProducts();
  }

  // Load CMS and Testimonials from Supabase
  async function loadSiteCMS() {
    try {
      if (window.CMSService) {
        cachedCMS = await window.CMSService.getAllCMS();
      }
      if (window.TestimonialService) {
        cachedTestimonials = await window.TestimonialService.getTestimonials();
      }
    } catch (err) {
      console.error('Error fetching CMS/Testimonials:', err);
    }
    applyCustomSiteContent(currentLang);
  }

  // Initial Boot
  applyLanguage(currentLang);
  await loadProducts();
  await loadSiteCMS();

  // -------------------------------------------------------------
  // Language Switcher & CMS Content Sync
  // -------------------------------------------------------------
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ta' : 'en';
      localStorage.setItem('dkb_lang', currentLang);
      applyLanguage(currentLang);
      renderProducts();
      if (orderCheckoutModal && orderCheckoutModal.classList.contains('active')) {
        renderOrderSummary();
      }
      showToast(currentLang === 'ta' ? 'தமிழ் மொழிக்கு மாற்றப்பட்டது' : 'Switched to English');
    });
  }

  function applyLanguage(lang) {
    document.body.classList.toggle('lang-ta', lang === 'ta');
    if (langLabel) {
      langLabel.textContent = lang === 'en' ? 'தமிழ்' : 'English';
    }

    const dict = typeof TRANSLATIONS !== 'undefined' ? (TRANSLATIONS[lang] || TRANSLATIONS.en) : null;

    if (dict) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = dict[key];
          } else {
            el.innerHTML = dict[key];
          }
        }
      });
    }

    // Apply any customized CMS content overrides
    applyCustomSiteContent(lang);
  }

  // -------------------------------------------------------------
  // Dynamic CMS Content Loader (Live synchronization with Supabase)
  // -------------------------------------------------------------
  function applyCustomSiteContent(lang = currentLang) {
    const defaultReviews = [
      {
        author: "Senthil Kumar",
        location: "Singapore (Export Customer)",
        rating: "5",
        quote: "The Palaya Sadam Garlic Vathal reminded me of my grandmother's home in Pollachi. Perfectly spiced, super light when fried, and not salty. Ordered 5kg for our family in Singapore!"
      },
      {
        author: "Ramesh R.",
        location: "New Jersey, USA (Supermarket Buyer)",
        rating: "5",
        quote: "We import South Indian grocery items to New Jersey. DKB's packaging quality and Palaya Sadam Black Pepper vadagams sold out within two weeks. Excellent export compliance and timely shipment."
      },
      {
        author: "Anitha Lakshmi",
        location: "Chennai, Tamil Nadu",
        rating: "5",
        quote: "The Curry Leaf and Mudakathan herbal vadagams are truly therapeutic. Crisp, aromatic, and easy on the stomach. 1-click WhatsApp ordering made delivery to Chennai so seamless!"
      }
    ];

    const isTa = lang === 'ta';

    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el && txt !== undefined && txt !== null && txt !== '') el.textContent = txt;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el && html !== undefined && html !== null && html !== '') el.innerHTML = html;
    };
    const setSrc = (id, src) => {
      const el = document.getElementById(id);
      if (el && src) el.src = src;
    };
    const setHref = (id, href) => {
      const el = document.getElementById(id);
      if (el && href) el.href = href;
    };

    // Render reviews (from Supabase or default)
    const reviewsList = (cachedTestimonials && cachedTestimonials.length > 0) 
      ? cachedTestimonials 
      : ((cachedCMS && cachedCMS.reviews && cachedCMS.reviews.length > 0) ? cachedCMS.reviews : defaultReviews);

    const grid = document.getElementById('testimonials-grid');
    if (grid) {
      grid.innerHTML = reviewsList.map(rev => {
        const initials = rev.initials || (rev.author || 'CU').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';
        const stars = '★'.repeat(Math.min(5, Math.max(1, Number(rev.rating) || 5)));
        return `
          <div class="testimonial-card">
            <div>
              <div class="testimonial-rating" style="color: #ffd700; margin-bottom: 0.75rem;">${stars}</div>
              <p class="testimonial-quote">"${rev.quote}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">${initials}</div>
              <div class="author-info">
                <h5>${rev.author}</h5>
                <p>${rev.location}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    if (!cachedCMS) return;

    // 1. Branding & Hero
    if (cachedCMS.branding) {
      const b = cachedCMS.branding;
      if (b.logo) {
        setSrc('brand-logo-header', b.logo);
        setSrc('brand-logo-footer', b.logo);
      }
      if (b.heroImage) {
        setSrc('hero-main-img', b.heroImage);
      }
      if (isTa && b.announcement_ta) setText('top-announcement', b.announcement_ta);
      else if (b.announcement_en) setText('top-announcement', b.announcement_en);

      if (isTa && b.heroBadge_ta) setText('hero-tagline', b.heroBadge_ta);
      else if (b.heroBadge_en) setText('hero-tagline', b.heroBadge_en);

      if (isTa && b.heroTitle_ta) {
        setHtml('hero-main-title', b.heroTitle_ta);
      } else if (b.heroTitle_en) {
        setHtml('hero-main-title', b.heroTitle_en);
      }

      if (isTa && b.heroSub_ta) setText('hero-description', b.heroSub_ta);
      else if (b.heroSub_en) setText('hero-description', b.heroSub_en);

      if (b.pill1_en) setText('hero-pill-1', b.pill1_en);
      if (b.pill2_en) setText('hero-pill-2', b.pill2_en);
      if (b.pill3_en) setText('hero-pill-3', b.pill3_en);

      if (b.ratingTitle) setText('hero-floating-title', b.ratingTitle);
      if (b.ratingSub) setText('hero-floating-sub', b.ratingSub);
    }

    // 2. Featured Categories (3 Tiles)
    if (cachedCMS.categories) {
      const c = cachedCMS.categories;
      if (c.cat1_title) setText('cat-tile-1-title', c.cat1_title);
      if (c.cat1_sub) setText('cat-tile-1-sub', c.cat1_sub);
      if (c.cat1_img) setSrc('cat-tile-1-img', c.cat1_img);

      if (c.cat2_title) setText('cat-tile-2-title', c.cat2_title);
      if (c.cat2_sub) setText('cat-tile-2-sub', c.cat2_sub);
      if (c.cat2_img) setSrc('cat-tile-2-img', c.cat2_img);

      if (c.cat3_title) setText('cat-tile-3-title', c.cat3_title);
      if (c.cat3_sub) setText('cat-tile-3-sub', c.cat3_sub);
      if (c.cat3_img) setSrc('cat-tile-3-img', c.cat3_img);
    }

    // 3. Why Choose Us (6 Features)
    if (cachedCMS.whyChoose) {
      const w = cachedCMS.whyChoose;
      if (w.main_title) setText('why-main-heading', w.main_title);
      if (w.why1_title) setText('why-1-title', w.why1_title);
      if (w.why1_desc) setText('why-1-desc', w.why1_desc);
      if (w.why2_title) setText('why-2-title', w.why2_title);
      if (w.why2_desc) setText('why-2-desc', w.why2_desc);
      if (w.why3_title) setText('why-3-title', w.why3_title);
      if (w.why3_desc) setText('why-3-desc', w.why3_desc);
      if (w.why4_title) setText('why-4-title', w.why4_title);
      if (w.why4_desc) setText('why-4-desc', w.why4_desc);
      if (w.why5_title) setText('why-5-title', w.why5_title);
      if (w.why5_desc) setText('why-5-desc', w.why5_desc);
      if (w.why6_title) setText('why-6-title', w.why6_title);
      if (w.why6_desc) setText('why-6-desc', w.why6_desc);
    }

    // 4. Warehouse & Packaging Facility (3 Cards)
    if (cachedCMS.facility) {
      const fac = cachedCMS.facility;
      if (fac.main_heading) setText('facility-main-heading', fac.main_heading);
      if (fac.main_subtitle) setText('facility-main-subtitle', fac.main_subtitle);
      if (fac.fac1_title) setText('fac-1-title', fac.fac1_title);
      if (fac.fac1_desc) setText('fac-1-desc', fac.fac1_desc);
      if (fac.fac2_title) setText('fac-2-title', fac.fac2_title);
      if (fac.fac2_desc) setText('fac-2-desc', fac.fac2_desc);
      if (fac.fac3_title) setText('fac-3-title', fac.fac3_title);
      if (fac.fac3_desc) setText('fac-3-desc', fac.fac3_desc);
    }

    // 5. Certification & Government Accreditations (6 Tiles)
    if (cachedCMS.certifications) {
      const crt = cachedCMS.certifications;
      if (crt.main_heading) setText('cert-main-heading', crt.main_heading);
      if (crt.main_subtitle) setText('cert-main-subtitle', crt.main_subtitle);

      for (let i = 1; i <= 6; i++) {
        if (crt[`cert${i}_label`]) setText(`cert-${i}-label`, crt[`cert${i}_label`]);
        if (crt[`cert${i}_org`]) setText(`cert-${i}-org`, crt[`cert${i}_org`]);
        if (crt[`cert${i}_desc`]) setText(`cert-${i}-desc`, crt[`cert${i}_desc`]);

        const imgUrl = crt[`cert${i}_img`];
        const imgEl = document.getElementById(`cert-${i}-img`);
        const emblemEl = document.getElementById(`cert-${i}-emblem`);

        if (imgUrl && imgUrl.trim() !== '') {
          if (imgEl) {
            imgEl.src = imgUrl;
            imgEl.style.display = 'block';
          }
          if (emblemEl) {
            emblemEl.style.display = 'none';
          }
        }
      }
    }

    // 6. About Us & Operational Strengths
    if (cachedCMS.about) {
      const a = cachedCMS.about;
      if (a.title) setText('about-company-title', a.title);
      if (a.p1) setText('about-company-p1', a.p1);
      if (a.p2) setText('about-company-p2', a.p2);
      if (a.p3) setText('about-company-p3', a.p3);
      if (a.str1) setText('about-str-1', a.str1);
      if (a.str2) setText('about-str-2', a.str2);
      if (a.str3) setText('about-str-3', a.str3);
      if (a.str4) setText('about-str-4', a.str4);
      if (a.str5) setText('about-str-5', a.str5);
    }

    // 7. Global Export & Bulk Supply
    if (cachedCMS.export) {
      const e = cachedCMS.export;
      if (e.banner_sub) setText('export-banner-sub', e.banner_sub);
      if (e.title) setText('export-banner-title', e.title);
      if (e.moq) setText('export-banner-moq', e.moq);
      if (e.grow_title) setText('grow-together-title', e.grow_title);
      if (e.desc) setText('grow-together-desc', e.desc);
    }

    // 8. Company Info & Contact Desk
    if (cachedCMS.companyInfo) {
      const co = cachedCMS.companyInfo;
      if (co.phone) {
        setText('contact-company-phone', co.phone);
        const el = document.getElementById('contact-company-phone');
        if (el) el.href = `tel:${co.phone.replace(/[^0-9+]/g, '')}`;
      }
      if (co.phone2) setText('contact-company-phone2', co.phone2);
      if (co.email) {
        setText('contact-company-email', co.email);
        const el = document.getElementById('contact-company-email');
        if (el) el.href = `mailto:${co.email}`;
      }
      if (co.contact_person) setText('contact-company-person', co.contact_person);
      if (co.business_entity) setText('contact-company-entity', co.business_entity);
      if (co.address) setText('contact-company-address', co.address);
    }

    // 9. Footer & Contacts
    if (cachedCMS.footer || cachedCMS.companyInfo) {
      const f = cachedCMS.footer || {};
      const co = cachedCMS.companyInfo || {};
      const phone = co.phone || f.phone;
      const email = co.email || f.email;
      const address = co.address || f.address;

      if (f.about_text) setText('footer-about-text', f.about_text);
      if (phone) {
        setText('footer-contact-phone', phone);
        document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = `tel:${phone.replace(/[^0-9+]/g, '')}`);
      }
      if (email) {
        setText('footer-contact-email', email);
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = `mailto:${email}`);
      }
      if (address) setText('footer-contact-address', address);
      if (f.social_ig) setHref('footer-social-ig', f.social_ig);
      if (f.social_fb) setHref('footer-social-fb', f.social_fb);
      if (f.social_yt) setHref('footer-social-yt', f.social_yt);
      if (f.social_wa || co.phone) {
        const waLink = f.social_wa || `https://wa.me/${(phone || '').replace(/[^0-9]/g, '')}`;
        setHref('footer-social-wa', waLink);
        const floatWa = document.querySelector('.floating-whatsapp-widget');
        if (floatWa) floatWa.href = waLink;
      }
      if (f.copyright) setText('footer-copyright-text', f.copyright);
    }
  }

  // -------------------------------------------------------------
  // Category Filter & Search
  // -------------------------------------------------------------
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // -------------------------------------------------------------
  // Render Product Cards
  // -------------------------------------------------------------
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = allProducts.filter(p => {
      const categorySlug = p.category || p.category_slug || '';
      const matchesCategory = currentCategory === 'all' || categorySlug === currentCategory;
      const searchTarget = `${p.name_en} ${p.name_ta} ${p.subtitle_en || ''} ${p.subtitle_ta || ''} ${(p.ingredients_en || []).join(' ')} ${(p.benefits_en || []).join(' ')}`.toLowerCase();
      const matchesSearch = !searchQuery || searchTarget.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #786b59;">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a1713;">
            ${currentLang === 'ta' ? 'தயாரிப்புகள் ஏதும் கிடைக்கவில்லை' : 'No matching vadagams found'}
          </h3>
          <p>${currentLang === 'ta' ? 'வேறு தேடல் சொல்லை பயன்படுத்தி பார்க்கவும்.' : 'Try adjusting your search query or category filter.'}</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => {
      const isTa = currentLang === 'ta';
      const name = isTa ? p.name_ta : p.name_en;
      const altName = isTa ? p.name_en : p.name_ta;
      const badge = isTa ? (p.badge_ta || p.badge_en) : (p.badge_en || p.badge_ta);
      const desc = isTa ? (p.short_desc_ta || p.short_desc_en) : (p.short_desc_en || p.short_desc_ta);
      const selectedPack = selectedPacks[p.id] || '250g';
      const prices = p.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 };
      const currentPrice = prices[selectedPack] || Object.values(prices)[0] || 0;
      const badgeClass = p.badge_type === 'emerald' ? 'badge-emerald' : p.badge_type === 'red' ? 'badge-red' : 'badge-gold';
      const inStock = p.in_stock !== false;
      const categorySlug = p.category || p.category_slug;

      return `
        <div class="product-card" data-product-id="${p.id}">
          <div class="card-image-wrap" onclick="window.openQuickView('${p.id}')" style="cursor: pointer;">
            <img src="${p.image || p.image_url}" alt="${p.name_en}" class="product-thumb-img" onerror="this.onerror=null; this.src='assets/plain-rice-vadagam.jpg'">
            <span class="card-badge ${badgeClass}">${badge || 'Popular'}</span>
            <span class="card-spice-tag">${p.spice_level || 'Mild'}</span>
          </div>

          <div class="card-body">
            <div class="product-category-tag">${categorySlug === 'fermented' ? (isTa ? 'பழைய சாத வத்தல்' : 'Fermented Rice (Probiotic)') : (isTa ? 'பாரம்பரிய வத்தல்' : 'Traditional Specialty')}</div>
            <h3 class="product-card-title" onclick="window.openQuickView('${p.id}')" style="cursor: pointer;">${name}</h3>
            <div class="product-tamil-title">${altName}</div>
            <p class="product-card-desc">${desc || ''}</p>

            <div class="pack-selector-label">${isTa ? 'அளவை தேர்வு செய்க:' : 'Select Pack Size:'}</div>
            <div class="pack-chips-row">
              ${Object.keys(prices).map(size => `
                <button type="button" class="pack-chip ${size === selectedPack ? 'active' : ''}" onclick="window.changePackSize('${p.id}', '${size}')">
                  ${size}
                </button>
              `).join('')}
            </div>

            <div class="card-info-row" style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-light);">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-rust); display: flex; align-items: center; gap: 0.35rem;">
                <span>📦</span> <span>${selectedPack} Pack</span>
              </div>
              <span class="card-bulk-tag">${!inStock ? (isTa ? 'கையிருப்பு இல்லை' : 'Out of Stock') : p.export_ready ? (isTa ? 'ஏற்றுமதி தரம்' : 'Export Ready') : '100% Natural'}</span>
            </div>

            <div class="card-actions-grid" style="grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.75rem;">
              <button class="btn-card-details" onclick="window.openQuickView('${p.id}')">
                ${isTa ? 'விவரங்கள்' : 'Quick View'}
              </button>
              <button class="btn-card-whatsapp" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.openOrderModal('${p.id}')" title="Order via WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                ${!inStock ? (isTa ? 'முடிந்துவிட்டது' : 'Out of Stock') : isTa ? 'WhatsApp ஆர்டர்' : 'WhatsApp Order'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // Pack Size Modifier
  // -------------------------------------------------------------
  window.changePackSize = function(productId, size) {
    selectedPacks[productId] = size;
    renderProducts();
  };

  // -------------------------------------------------------------
  // Order Checkout Modal & WhatsApp Handler
  // -------------------------------------------------------------
  window.openOrderModal = function(productId) {
    if (productId) {
      const product = allProducts.find(p => p.id === productId || String(p.id) === String(productId));
      if (!product) return;

      const pack = selectedPacks[productId] || '250g';

      currentCheckoutItems = [{
        productId: product.id,
        name_en: product.name_en,
        name_ta: product.name_ta,
        image: product.image || product.image_url,
        packSize: pack,
        quantity: 1
      }];
    }

    renderOrderSummary();
    if (orderCheckoutModal) orderCheckoutModal.classList.add('active');
  };

  function renderOrderSummary() {
    if (!orderItemsSummary || currentCheckoutItems.length === 0) return;

    const isTa = currentLang === 'ta';

    orderItemsSummary.innerHTML = `
      <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-teal); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem;">
        📦 ${isTa ? 'ஆர்டர் செய்யும் தயாரிப்பு:' : 'Selected Product for WhatsApp Order:'}
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 180px; overflow-y: auto; padding-right: 0.25rem;">
        ${currentCheckoutItems.map((item) => {
          const name = isTa ? item.name_ta : item.name_en;
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 0.65rem 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${item.image}" alt="${name}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-light);" onerror="this.src='assets/plain-rice-vadagam.jpg'">
                <div>
                  <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-dark);">${name}</div>
                  <div style="font-size: 0.8rem; color: var(--accent-rust); font-weight: 600;">📦 Pack Size: ${item.packSize}</div>
                </div>
              </div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #16a34a; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.25rem 0.6rem; border-radius: 99px;">
                Direct WhatsApp
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light);">
        <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">${isTa ? 'ஆர்டர் முறை:' : 'Order Mode:'}</span>
        <span style="font-size: 0.85rem; font-weight: 800; color: #16a34a;">💬 Direct WhatsApp Confirmation</span>
      </div>
    `;
  }

  // Order Checkout Form Submission -> Saves into Supabase DB & Dispatches to WhatsApp
  if (orderCheckoutForm) {
    orderCheckoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (currentCheckoutItems.length === 0) {
        showToast(currentLang === 'ta' ? 'ஆர்டர் விபரங்கள் கிடைக்கவில்லை' : 'No items selected for order');
        return;
      }

      const submitBtn = orderCheckoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳ Processing Order...</span>`;
      }

      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      const city = document.getElementById('cust-city').value.trim();
      const state = document.getElementById('cust-state').value.trim();
      const pincode = document.getElementById('cust-pincode').value.trim();
      const payment = document.getElementById('cust-payment').value;
      const notes = document.getElementById('cust-notes').value.trim();

      // Save Order directly into Supabase PostgreSQL
      let orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      try {
        if (window.OrderService) {
          const created = await window.OrderService.createOrder({
            name,
            phone,
            address,
            city,
            state,
            pincode,
            payment,
            total: 0,
            notes
          }, currentCheckoutItems);
          if (created && created.order_number) {
            orderNumber = created.order_number;
          }
        }
      } catch (err) {
        console.error('Error recording order to Supabase:', err);
      }

      // Construct Structured WhatsApp Message
      let msg = `*🛒 NEW VADAGAM ORDER - AXCES SEVEN EXIMS / DKB*\n`;
      msg += `*Order ID: ${orderNumber}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `👤 *Customer Details:*\n`;
      msg += `• *Name:* ${name}\n`;
      msg += `• *Contact Phone:* ${phone}\n\n`;

      msg += `📍 *Delivery Address:*\n`;
      msg += `• *Address:* ${address}\n`;
      msg += `• *City:* ${city}\n`;
      msg += `• *State:* ${state}\n`;
      msg += `• *Pincode:* ${pincode}\n\n`;

      msg += `📦 *Ordered Items:*\n`;
      currentCheckoutItems.forEach((item, index) => {
        msg += `${index + 1}. *${item.name_en}* (${item.name_ta})\n`;
        msg += `   • Pack Size: ${item.packSize} | Quantity: ${item.quantity || 1}\n`;
      });

      msg += `\n💳 *Payment Preference:* ${payment}\n`;
      if (notes) {
        msg += `📝 *Special Instructions:* ${notes}\n`;
      }
      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `Please confirm my order and share delivery timeframe. Thank you!`;

      // Dispatch to WhatsApp
      const whatsappUrl = `https://wa.me/918344594952?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      showToast(currentLang === 'ta' ? 'ஆர்டர் பதிவு செய்யப்பட்டது & WhatsApp திறக்கப்பட்டது!' : 'Order recorded in database & sent to WhatsApp!');

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit & Order on WhatsApp</span>`;
      }

      window.closeModal('order-checkout-modal');
      orderCheckoutForm.reset();
    });
  }

  // -------------------------------------------------------------
  // Quick View Modal
  // -------------------------------------------------------------
  window.openQuickView = function(productId) {
    const product = allProducts.find(p => p.id === productId || String(p.id) === String(productId));
    if (!product || !quickViewModal || !quickViewModalBody) return;

    const isTa = currentLang === 'ta';
    const name = isTa ? pName(product.name_ta, product.name_en) : `${product.name_en} (${product.name_ta})`;
    const subtitle = isTa ? product.subtitle_ta : product.subtitle_en;
    const desc = isTa ? (product.short_desc_ta || product.short_desc_en) : (product.short_desc_en || product.short_desc_ta);
    const ingredients = isTa ? (product.ingredients_ta || []) : (product.ingredients_en || []);
    const benefits = isTa ? (product.benefits_ta || []) : (product.benefits_en || []);
    const selectedPack = selectedPacks[product.id] || '250g';
    const inStock = product.in_stock !== false;

    quickViewModalBody.innerHTML = `
      <div class="quick-view-grid">
        <div>
          <div style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-light); background: #f8fafc; height: 260px; margin-bottom: 1.2rem;">
            <img src="${product.image || product.image_url}" alt="${product.name_en}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/plain-rice-vadagam.jpg'">
            <span class="card-badge badge-rust" style="top: 12px; left: 12px;">${isTa ? (product.badge_ta || product.badge_en) : (product.badge_en || product.badge_ta)}</span>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: 8px; padding: 1rem; font-size: 0.85rem; color: #475569;">
            <div style="color: var(--primary-teal); font-weight: 700; margin-bottom: 0.3rem;">🌿 ${isTa ? 'தயாரிப்பு முறை' : 'Drying Method'}:</div>
            <div>${product.drying_method || 'Traditional Sun-Dried'} • ${isTa ? '12 மாத காலாவதி' : '12 Months Shelf Life'}</div>
            <div style="margin-top: 0.5rem; color: #16a34a; font-weight: 600;">✓ 100% Vegan & Gluten-Free Natural</div>
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; letter-spacing: 1.5px; color: var(--accent-rust); text-transform: uppercase; font-weight: 800;">AXCES SEVEN EXIMS / DKB</div>
          <h2 style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 800; color: var(--primary-teal); margin: 0.3rem 0 0.2rem;">${name}</h2>
          <div style="font-size: 0.88rem; color: var(--accent-rust); font-weight: 600; margin-bottom: 1rem;">${subtitle || ''}</div>
          <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 1.3rem;">${desc || ''}</p>

          <div style="background: #f8fafc; border-left: 4px solid var(--accent-emerald); border-top: 1px solid var(--border-light); border-right: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); padding: 0.85rem 1rem; border-radius: 6px; margin-bottom: 1.3rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-teal); margin-bottom: 0.4rem;">✨ ${isTa ? 'மருத்துவ நன்மைகள்' : 'Key Health & Medicinal Benefits'}:</div>
            <ul style="padding-left: 1.2rem; font-size: 0.84rem; color: #334155; line-height: 1.5;">
              ${benefits.map(b => `<li style="margin-bottom: 0.3rem;">${b}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 1.3rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-teal); margin-bottom: 0.5rem;">${isTa ? 'சேர்க்கப்பட்டுள்ள பொருட்கள்:' : 'Ingredients:'}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${ingredients.map(ing => `<span style="background: #ffffff; border: 1px solid #cbd5e1; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 99px; color: #334155; font-weight: 500;">${ing}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--border-light); padding-top: 1.2rem;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-teal);">📦 ${isTa ? 'தேர்ந்தெடுக்கப்பட்ட அளவு:' : 'Selected Pack:'}</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-rust);">${selectedPack} Pack</div>
            </div>

            <button class="btn-card-whatsapp" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} style="padding: 0.8rem 1.4rem; font-size: 0.88rem; border-radius: var(--radius-sm);" onclick="window.closeModal('quick-view-modal'); window.openOrderModal('${product.id}');">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>${!inStock ? (isTa ? 'கையிருப்பு இல்லை' : 'Out of Stock') : isTa ? 'WhatsApp-ல் ஆர்டர் செய்க' : 'Order via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.add('active');
  };

  function pName(ta, en) {
    return `${ta} (${en})`;
  }

  // -------------------------------------------------------------
  // Certificate Lightbox Preview
  // -------------------------------------------------------------
  window.viewCertCard = function(num) {
    const certs = (cachedCMS && cachedCMS.certifications) || {};
    const label = document.getElementById(`cert-${num}-label`) ? document.getElementById(`cert-${num}-label`).textContent : `Certificate ${num}`;
    const org = document.getElementById(`cert-${num}-org`) ? document.getElementById(`cert-${num}-org`).textContent : '';
    const desc = document.getElementById(`cert-${num}-desc`) ? document.getElementById(`cert-${num}-desc`).textContent : '';
    const imgEl = document.getElementById(`cert-${num}-img`);
    const imgSrc = (imgEl && imgEl.src && !imgEl.src.includes('undefined') && imgEl.style.display !== 'none') 
      ? imgEl.src 
      : (certs[`cert${num}_img`] || 'assets/a7e-logo.jpg');

    const modalTitle = document.getElementById('cert-lightbox-title');
    const modalImg = document.getElementById('cert-lightbox-img');
    const modalDesc = document.getElementById('cert-lightbox-desc');
    const modal = document.getElementById('cert-lightbox-modal');

    if (modalTitle) modalTitle.textContent = `${label} - ${org}`;
    if (modalImg) modalImg.src = imgSrc;
    if (modalDesc) modalDesc.textContent = desc;
    if (modal) modal.classList.add('active');
  };

  // -------------------------------------------------------------
  // Global Export RFQ Modal & Form
  // -------------------------------------------------------------
  window.openExportModal = function() {
    if (exportModal) exportModal.classList.add('active');
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  };

  const exportForm = document.getElementById('export-rfq-form');
  if (exportForm) {
    exportForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = exportForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳ Submitting Inquiry...</span>`;
      }

      const name = document.getElementById('rfq-name').value.trim();
      const email = document.getElementById('rfq-email').value.trim();
      const phone = document.getElementById('rfq-phone').value.trim();
      const country = document.getElementById('rfq-country').value.trim();
      const volume = document.getElementById('rfq-volume').value.trim();
      const products = document.getElementById('rfq-products').value.trim();
      const notes = document.getElementById('rfq-notes').value.trim();

      // Save RFQ directly into Supabase PostgreSQL
      let rfqNumber = 'RFQ-' + Math.floor(500 + Math.random() * 500);
      try {
        if (window.RFQService) {
          const created = await window.RFQService.createRFQ({
            name,
            email,
            phone,
            country,
            volume,
            products,
            notes
          });
          if (created && created.rfq_number) {
            rfqNumber = created.rfq_number;
          }
        }
      } catch (err) {
        console.error('Error recording RFQ to Supabase:', err);
      }

      let msg = `*🌍 GLOBAL EXPORT & BULK ORDER INQUIRY 🌍*\n`;
      msg += `*Lead ID: ${rfqNumber}*\n`;
      msg += `-------------------------------------------\n`;
      msg += `*Name/Company:* ${name}\n`;
      msg += `*Email:* ${email}\n`;
      msg += `*Phone:* ${phone}\n`;
      msg += `*Destination Country:* ${country}\n`;
      msg += `*Estimated Volume:* ${volume}\n`;
      msg += `*Products of Interest:* ${products}\n`;
      msg += `*Special Requirements/Notes:* ${notes}\n`;
      msg += `-------------------------------------------\n`;
      msg += `Sent via AXCES SEVEN EXIMS Official Export Portal`;

      const whatsappUrl = `https://wa.me/918344594952?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      showToast(currentLang === 'ta' ? 'விசாரணை பதிவு செய்யப்பட்டது & WhatsApp திறக்கப்பட்டது!' : 'Inquiry registered in database & WhatsApp opened!');
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Export Inquiry</span>`;
      }

      window.closeModal('export-modal');
      exportForm.reset();
    });
  }

  // Mobile Menu Toggle & Backdrop
  const navBackdrop = document.getElementById('nav-backdrop');

  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove('mobile-open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-locked');
  }

  function toggleMobileNav() {
    if (!navMenu) return;
    const isOpen = navMenu.classList.toggle('mobile-open');
    if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-locked', isOpen);
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileNav);
    }

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    });
  }

  // Toast Notification
  function showToast(text) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = text;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
