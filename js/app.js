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

      if (b.ratingTitle) setText('hero-floating-title', b.ratingTitle);
      if (b.ratingSub) setText('hero-floating-sub', b.ratingSub);
    }

    // 2. Pillars
    if (cachedCMS.pillars) {
      const p = cachedCMS.pillars;
      if (p.p1_title) setText('pillar-1-title', p.p1_title);
      if (p.p1_desc) setText('pillar-1-desc', p.p1_desc);
      if (p.p2_title) setText('pillar-2-title', p.p2_title);
      if (p.p2_desc) setText('pillar-2-desc', p.p2_desc);
      if (p.p3_title) setText('pillar-3-title', p.p3_title);
      if (p.p3_desc) setText('pillar-3-desc', p.p3_desc);
      if (p.p4_title) setText('pillar-4-title', p.p4_title);
      if (p.p4_desc) setText('pillar-4-desc', p.p4_desc);
    }

    // 3. Health Benefits & Story
    if (cachedCMS.story) {
      const s = cachedCMS.story;
      if (s.benefits_title) setText('benefits-main-title', s.benefits_title);
      if (s.benefits_sub) setText('benefits-main-sub', s.benefits_sub);
      if (s.about_title) setText('about-company-title', s.about_title);
      if (s.about_yard) setText('about-yard-badge', s.about_yard);
      if (s.about_p1) setText('about-company-p1', s.about_p1);
      if (s.about_p2) setText('about-company-p2', s.about_p2);
    }

    // 4. Global Export
    if (cachedCMS.export) {
      const e = cachedCMS.export;
      if (e.title) setText('export-banner-title', e.title);
      if (e.moq) setText('export-banner-moq', e.moq);
      if (e.desc) setText('grow-together-desc', e.desc);
    }

    // 5. Footer & Contacts
    if (cachedCMS.footer) {
      const f = cachedCMS.footer;
      if (f.phone) {
        setText('footer-contact-phone', f.phone);
        document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = `tel:${f.phone.replace(/[^0-9+]/g, '')}`);
      }
      if (f.email) {
        setText('footer-contact-email', f.email);
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = `mailto:${f.email}`);
      }
      if (f.address) setText('footer-contact-address', f.address);
      if (f.social_ig) setHref('footer-social-ig', f.social_ig);
      if (f.social_fb) setHref('footer-social-fb', f.social_fb);
      if (f.social_yt) setHref('footer-social-yt', f.social_yt);
      if (f.social_wa) {
        setHref('footer-social-wa', f.social_wa);
        const floatWa = document.querySelector('.floating-whatsapp-widget');
        if (floatWa) floatWa.href = f.social_wa;
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

            <div class="card-price-row">
              <div class="card-current-price">
                ₹${currentPrice} <span style="font-size: 0.75rem;">/ ${selectedPack}</span>
              </div>
              <span class="card-bulk-tag">${!inStock ? (isTa ? 'கையிருப்பு இல்லை' : 'Out of Stock') : p.export_ready ? (isTa ? 'ஏற்றுமதி தரம்' : 'Export Ready') : '100% Natural'}</span>
            </div>

            <div class="card-actions-grid" style="grid-template-columns: 1fr 1fr; gap: 0.6rem;">
              <button class="btn-card-details" onclick="window.openQuickView('${p.id}')">
                ${isTa ? 'விவரங்கள்' : 'Quick View'}
              </button>
              <button class="btn-card-whatsapp" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.openOrderModal('${p.id}')" title="Buy and Order via WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                ${!inStock ? (isTa ? 'முடிந்துவிட்டது' : 'Out of Stock') : isTa ? 'ஆர்டர் செய்க' : 'Order Now'}
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
      const prices = product.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 };
      const price = prices[pack] || Object.values(prices)[0] || 0;

      currentCheckoutItems = [{
        productId: product.id,
        name_en: product.name_en,
        name_ta: product.name_ta,
        image: product.image || product.image_url,
        packSize: pack,
        price: price,
        quantity: 1
      }];
    }

    renderOrderSummary();
    if (orderCheckoutModal) orderCheckoutModal.classList.add('active');
  };

  function renderOrderSummary() {
    if (!orderItemsSummary || currentCheckoutItems.length === 0) return;

    const isTa = currentLang === 'ta';
    const totalAmount = currentCheckoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    orderItemsSummary.innerHTML = `
      <div style="font-size: 0.8rem; font-weight: 800; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem;">
        📦 ${isTa ? 'ஆர்டர் செய்யும் தயாரிப்பு:' : 'Selected Product for Order:'}
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 180px; overflow-y: auto; padding-right: 0.25rem;">
        ${currentCheckoutItems.map((item) => {
          const name = isTa ? item.name_ta : item.name_en;
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.15); border-radius: 6px; padding: 0.6rem 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${item.image}" alt="${name}" style="width: 46px; height: 46px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-gold);" onerror="this.src='assets/plain-rice-vadagam.jpg'">
                <div>
                  <div style="font-size: 0.92rem; font-weight: 700; color: #fff;">${name}</div>
                  <div style="font-size: 0.78rem; color: #e5c07b;">${item.packSize} • ₹${item.price}</div>
                </div>
              </div>
              <div style="font-size: 1.1rem; font-weight: 800; color: var(--gold-primary);">
                ₹${item.price * item.quantity}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-gold);">
        <span style="font-size: 0.9rem; font-weight: 700; color: #e5c07b;">${isTa ? 'மொத்த தொகை (Estimated Total):' : 'Estimated Total:'}</span>
        <span style="font-size: 1.35rem; font-weight: 900; color: #ffffff;">₹${totalAmount}</span>
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

      const totalAmount = currentCheckoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
            total: totalAmount,
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
        msg += `   • Pack: ${item.packSize} | Qty: ${item.quantity} | Amount: ₹${item.price * item.quantity}\n`;
      });

      msg += `\n💰 *Total Order Value: ₹${totalAmount}*\n`;
      msg += `💳 *Payment Preference:* ${payment}\n`;
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
    const prices = product.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 };
    const price = prices[selectedPack] || Object.values(prices)[0] || 0;
    const inStock = product.in_stock !== false;

    quickViewModalBody.innerHTML = `
      <div class="quick-view-grid">
        <div>
          <div style="position: relative; border-radius: 12px; overflow: hidden; border: 1.5px solid var(--border-gold); height: 260px; margin-bottom: 1.2rem;">
            <img src="${product.image || product.image_url}" alt="${product.name_en}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/plain-rice-vadagam.jpg'">
            <span class="card-badge badge-gold" style="top: 12px; left: 12px;">${isTa ? (product.badge_ta || product.badge_en) : (product.badge_en || product.badge_ta)}</span>
          </div>
          
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-gold); border-radius: 8px; padding: 1rem; font-size: 0.82rem; color: #b8b1a4;">
            <div style="color: var(--gold-primary); font-weight: 700; margin-bottom: 0.3rem;">🌿 ${isTa ? 'தயாரிப்பு முறை' : 'Drying Method'}:</div>
            <div>${product.drying_method || 'Traditional Sun-Dried'} • ${isTa ? '12 மாத காலாவதி' : '12 Months Shelf Life'}</div>
            <div style="margin-top: 0.5rem; color: #86efac;">✓ 100% Vegan & Gluten-Free Natural</div>
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; letter-spacing: 2px; color: var(--gold-primary); text-transform: uppercase; font-weight: 700;">AXCES SEVEN EXIMS / DKB</div>
          <h2 style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0.3rem 0 0.2rem;">${name}</h2>
          <div style="font-size: 0.88rem; color: #e5c07b; margin-bottom: 1rem;">${subtitle || ''}</div>
          <p style="font-size: 0.88rem; color: #d6cfc4; line-height: 1.6; margin-bottom: 1.3rem;">${desc || ''}</p>

          <div style="background: #14120e; border-left: 3px solid var(--gold-primary); padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.3rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--gold-light); margin-bottom: 0.4rem;">✨ ${isTa ? 'மருத்துவ நன்மைகள்' : 'Key Health & Medicinal Benefits'}:</div>
            <ul style="padding-left: 1.2rem; font-size: 0.82rem; color: #b8b1a4; line-height: 1.5;">
              ${benefits.map(b => `<li style="margin-bottom: 0.3rem;">${b}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 1.3rem;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #e2d5c3; margin-bottom: 0.5rem;">${isTa ? 'சேர்க்கப்பட்டுள்ள பொருட்கள்:' : 'Ingredients:'}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${ingredients.map(ing => `<span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 99px; color: #fbf8f2;">${ing}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(212,175,55,0.2); padding-top: 1.2rem;">
            <div>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--gold-primary);">₹${price}</div>
              <div style="font-size: 0.75rem; color: #9c9486;">(${selectedPack} pack)</div>
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

  // Mobile Menu Toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
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
