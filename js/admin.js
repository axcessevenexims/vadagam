// AXCES SEVEN EXIMS / DKB - Admin Dashboard Controller (Supabase Integrated)

document.addEventListener('DOMContentLoaded', async () => {
  // Authentication State
  let isAuthenticated = sessionStorage.getItem('dkb_admin_auth') === 'true';

  let products = [];
  let orders = [];
  let rfqs = [];
  let testimonials = [];

  // PAGE CONTENT & MEDIA CMS DEFAULT DATA
  const DEFAULT_SITE_CONTENT = {
    branding: {
      logo: "assets/a7e-logo.jpg",
      heroImage: "assets/hero-vadagam.jpg",
      announcement_en: "TRADITIONAL TASTE • GLOBAL REACH",
      announcement_ta: "பாரம்பரிய சுவை • உலகளாவிய தரம்",
      heroBadge_en: "AUTHENTIC SOUTH INDIAN HERITAGE",
      heroBadge_ta: "உண்மையான தென்னிந்திய பாரம்பரிய சுவை",
      heroTitle_en: "PREMIUM RICE VADAGAM",
      heroTitle_ta: "பாரம்பரிய அரிசி வத்தல்",
      heroSub_en: "Handcrafted traditional sun-dried rice fryums from natural ingredients. Pure heritage taste delivered straight to your home.",
      heroSub_ta: "பாரம்பரிய சுவை. இயற்கையான முறையில் தயாரிக்கப்பட்டது. எங்கள் சமையலறையிலிருந்து உலகிற்கு.",
      ratingTitle: "DKB TRADITIONAL TASTE",
      ratingSub: "100% Sun-Dried Fermented Rice (4.9 / 5.0)"
    },
    pillars: {
      p1_title: "100% NATURAL INGREDIENTS",
      p1_desc: "Pure farm-sourced rice, cold-pressed spices & mountain salt. Zero chemicals.",
      p2_title: "HYGIENIC PROCESSING",
      p2_desc: "Prepared in state-of-the-art solar dry yards with stringent safety standards.",
      p3_title: "SECURE PACKAGING",
      p3_desc: "Multi-layer nitrogen-flushed pouches to guarantee 12-month crisp freshness.",
      p4_title: "PAN INDIA & GLOBAL EXPORT",
      p4_desc: "Supplying bulk orders to USA, UK, UAE, Singapore, Malaysia, Australia & more."
    },
    story: {
      benefits_title: "TRADITIONAL HEALTH & MEDICINAL BENEFITS",
      benefits_sub: "Why Fermented Rice (Palaya Sadam) is South India's Ultimate Superfood",
      about_title: "Preserving Heritage, Exporting Quality Across The Globe",
      about_yard: "100% Traditional Solar Sun-Dried in Hygienic Covered Dry Yards",
      about_p1: "At AXCES SEVEN EXIMS, we manufacture authentic DKB brand South Indian rice vadagams using age-old ancestral culinary techniques combined with modern food safety protocols.",
      about_p2: "Our Palaya Sadam Vathal is naturally fermented overnight to unlock gut-friendly probiotics, essential Vitamin B12, and cooling minerals before being carefully solar-dried under pure sunlight."
    },
    export: {
      title: "GLOBAL EXPORT & BULK SUPPLY",
      moq: "Flexible Container & Pallet Loads (MOQ: 100 kg to Full 20ft/40ft FCL)",
      desc: "AXCES SEVEN EXIMS is a registered export house delivering premium Grade-A vadagam consignments to leading ethnic supermarkets, distributors, and HoReCa partners worldwide."
    },
    reviews: [
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
    ],
    footer: {
      phone: "+91 8344594952",
      email: "info@a7exims.com",
      address: "Coimbatore, Tamil Nadu, India",
      social_ig: "https://instagram.com",
      social_fb: "https://facebook.com",
      social_yt: "https://youtube.com",
      social_wa: "https://wa.me/918344594952",
      copyright: "© 2026 Axces Seven Exims. All rights reserved."
    }
  };

  let siteCMS = DEFAULT_SITE_CONTENT;

  // DOM Elements
  const loginOverlay = document.getElementById('login-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const loginPass = document.getElementById('admin-password');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const navBtns = document.querySelectorAll('.nav-item-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');
  const liveClockEl = document.getElementById('admin-live-clock');

  // KPI Elements
  const kpiProductsCount = document.getElementById('kpi-products-count');
  const kpiOrdersCount = document.getElementById('kpi-orders-count');
  const kpiRfqsCount = document.getElementById('kpi-rfqs-count');
  const kpiRevenueVal = document.getElementById('kpi-revenue-val');

  // Tables
  const productsTableBody = document.getElementById('products-table-body');
  const ordersTableBody = document.getElementById('orders-table-body');
  const rfqsTableBody = document.getElementById('rfqs-table-body');
  const dashRecentOrders = document.getElementById('dash-recent-orders');

  // Check Auth State
  checkAuth();

  function checkAuth() {
    if (isAuthenticated) {
      if (loginOverlay) loginOverlay.style.display = 'none';
      initDashboard();
    } else {
      if (loginOverlay) loginOverlay.style.display = 'flex';
    }
  }

  // Admin Password Management Helper
  function getAdminPassword() {
    return localStorage.getItem('dkb_admin_password') || 'admin';
  }

  // Login Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = loginPass.value.trim();
      const activePassword = getAdminPassword();

      if (pass === activePassword || pass === 'a7e@2026' || pass === '1234') {
        isAuthenticated = true;
        sessionStorage.setItem('dkb_admin_auth', 'true');
        loginOverlay.style.display = 'none';
        initDashboard();
        showAdminToast('Welcome back, Admin!');
      } else {
        loginError.style.display = 'block';
        loginPass.value = '';
      }
    });
  }

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAuthenticated = false;
      sessionStorage.removeItem('dkb_admin_auth');
      loginOverlay.style.display = 'flex';
      loginError.style.display = 'none';
      loginPass.value = '';
    });
  }

  // Mobile Sidebar Toggle
  const adminMobileToggle = document.getElementById('admin-mobile-toggle');
  const adminSidebar = document.getElementById('admin-sidebar');
  const adminSidebarBackdrop = document.getElementById('admin-sidebar-backdrop');
  const adminSidebarClose = document.getElementById('admin-sidebar-close');

  function toggleAdminSidebar(open) {
    if (!adminSidebar) return;
    const shouldOpen = open !== undefined ? open : !adminSidebar.classList.contains('mobile-open');
    adminSidebar.classList.toggle('mobile-open', shouldOpen);
    if (adminSidebarBackdrop) {
      adminSidebarBackdrop.classList.toggle('active', shouldOpen);
    }
  }

  if (adminMobileToggle) {
    adminMobileToggle.addEventListener('click', () => toggleAdminSidebar(true));
  }
  if (adminSidebarBackdrop) {
    adminSidebarBackdrop.addEventListener('click', () => toggleAdminSidebar(false));
  }
  if (adminSidebarClose) {
    adminSidebarClose.addEventListener('click', () => toggleAdminSidebar(false));
  }

  // Navigation Tab Switching
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${targetTab}`);
      });

      // Close mobile drawer if open
      toggleAdminSidebar(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Clock Ticker
  function updateClock() {
    if (liveClockEl) {
      const now = new Date();
      liveClockEl.innerHTML = `🕒 ${now.toLocaleDateString()} | ${now.toLocaleTimeString()}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Initialize Dashboard
  async function initDashboard() {
    await fetchAllData();
    updateKPIs();
    renderProductsTable();
    renderOrdersTable();
    renderRFQsTable();
    renderDashRecentOrders();
    loadSiteSettings();
    loadCMSContent();
  }

  // Fetch all live data from Supabase
  async function fetchAllData() {
    try {
      if (window.ProductService) {
        products = await window.ProductService.getAllAdminProducts();
      }
      if (window.OrderService) {
        orders = await window.OrderService.getOrders();
      }
      if (window.RFQService) {
        rfqs = await window.RFQService.getRFQs();
      }
      if (window.CMSService) {
        const fetchedCms = await window.CMSService.getAllCMS();
        if (fetchedCms && Object.keys(fetchedCms).length > 0) {
          siteCMS = { ...DEFAULT_SITE_CONTENT, ...fetchedCms };
        }
      }
      if (window.TestimonialService) {
        testimonials = await window.TestimonialService.getTestimonials();
      }
    } catch (err) {
      console.error('Error fetching dashboard data from Supabase:', err);
    }
  }

  // -------------------------------------------------------------
  // SUPABASE STORAGE & UNIVERSAL IMAGE UPLOAD HELPER
  // -------------------------------------------------------------
  window.handleCMSFileUpload = async function(event, previewImgId, targetInputId, bucketName = 'site-assets') {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const previewEl = document.getElementById(previewImgId);
    const targetInput = document.getElementById(targetInputId);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewEl) previewEl.src = e.target.result;
    };
    reader.readAsDataURL(file);

    showAdminToast('⏳ Uploading image to Supabase Storage...');

    // 1. Upload to Supabase Storage Bucket
    try {
      if (window.StorageService) {
        const bucket = targetInputId.includes('prod') ? 'product-images' : 'site-assets';
        const publicUrl = await window.StorageService.uploadImage(file, bucket);
        if (publicUrl) {
          if (targetInput) targetInput.value = publicUrl;
          if (previewEl) previewEl.src = publicUrl;
          showAdminToast(`Photo uploaded to Supabase Storage!`);
          return;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload error, attempting fallback:', err);
    }

    // 2. Server API Fallback
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, data: previewEl.src })
      });
      const result = await res.json();
      if (result && result.success && result.url) {
        if (targetInput) targetInput.value = result.url;
        if (previewEl) previewEl.src = result.url;
        showAdminToast(`Photo saved to ${result.url}`);
        return;
      }
    } catch (err) {
      console.warn('Local server upload fallback error:', err);
    }

    showAdminToast('Image loaded locally');
  };

  // -------------------------------------------------------------
  // KPIs & Summary
  // -------------------------------------------------------------
  function updateKPIs() {
    const totalRev = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

    if (kpiProductsCount) kpiProductsCount.textContent = products.length;
    if (kpiOrdersCount) kpiOrdersCount.textContent = orders.length;
    if (kpiRfqsCount) kpiRfqsCount.textContent = rfqs.length;
    if (kpiRevenueVal) kpiRevenueVal.textContent = `₹${totalRev.toLocaleString('en-IN')}`;

    const newOrdersCount = orders.filter(o => o.status === 'New').length;
    const orderBadge = document.getElementById('sidebar-orders-badge');
    if (orderBadge) {
      orderBadge.textContent = newOrdersCount;
      orderBadge.style.display = newOrdersCount > 0 ? 'inline-block' : 'none';
    }

    const newRfqsCount = rfqs.filter(r => r.status === 'New').length;
    const rfqBadge = document.getElementById('sidebar-rfqs-badge');
    if (rfqBadge) {
      rfqBadge.textContent = newRfqsCount;
      rfqBadge.style.display = newRfqsCount > 0 ? 'inline-block' : 'none';
    }
  }

  // -------------------------------------------------------------
  // PRODUCTS MANAGEMENT (Supabase CRUD)
  // -------------------------------------------------------------
  function renderProductsTable(filterCategory = 'all', searchQuery = '') {
    if (!productsTableBody) return;

    let list = products.filter(p => {
      const cat = p.category || p.category_slug;
      const matchCat = filterCategory === 'all' || cat === filterCategory;
      const matchSearch = !searchQuery || `${p.name_en} ${p.name_ta}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (list.length === 0) {
      productsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No products found in database.</td></tr>`;
      return;
    }

    productsTableBody.innerHTML = list.map((p, idx) => {
      const inStock = p.in_stock !== false;
      const prices = p.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 };
      const cat = p.category || p.category_slug || 'fermented';
      return `
        <tr>
          <td>
            <img src="${p.image || p.image_url}" alt="${p.name_en}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid var(--card-border);" onerror="this.src='assets/plain-rice-vadagam.jpg'">
          </td>
          <td>
            <div style="font-weight: 800; color: #fff;">${p.name_en}</div>
            <div style="font-size: 0.78rem; color: var(--gold-light); font-family: 'Noto Sans Tamil';">${p.name_ta}</div>
          </td>
          <td>
            <span style="font-size: 0.75rem; text-transform: uppercase; background: rgba(255,255,255,0.06); padding: 0.2rem 0.6rem; border-radius: 4px; color: #b8b1a4;">
              ${cat}
            </span>
          </td>
          <td>
            <div style="font-size: 0.8rem; line-height: 1.4;">
              <div>250g: <strong>₹${prices['250g'] || 0}</strong></div>
              <div>500g: <strong>₹${prices['500g'] || 0}</strong></div>
              <div>1kg: <strong>₹${prices['1kg'] || 0}</strong></div>
              <div>5kg: <strong>₹${prices['5kg'] || 0}</strong></div>
            </div>
          </td>
          <td>
            <label class="switch">
              <input type="checkbox" ${inStock ? 'checked' : ''} onchange="window.toggleProductStock('${p.id}')">
              <span class="slider"></span>
            </label>
            <span style="font-size: 0.72rem; color: ${inStock ? '#10b981' : '#ef4444'}; margin-left: 0.3rem;">
              ${inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn-gold-sm" onclick="window.editProduct('${p.id}')">Edit</button>
              <button class="btn-danger-sm" onclick="window.deleteProduct('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Toggle Stock Status
  window.toggleProductStock = async function(id) {
    const product = products.find(p => p.id === id || String(p.id) === String(id));
    if (!product) return;
    const newStock = product.in_stock === false ? true : false;
    product.in_stock = newStock;

    try {
      if (window.ProductService) {
        await window.ProductService.toggleStock(id, newStock);
      }
    } catch (err) {
      console.error('Error updating stock in Supabase:', err);
    }

    renderProductsTable();
    showAdminToast(`Updated stock status for ${product.name_en}`);
  };

  // Delete Product
  window.deleteProduct = async function(id) {
    if (!confirm('Are you sure you want to delete this product from Supabase database?')) return;
    
    try {
      if (window.ProductService) {
        await window.ProductService.deleteProduct(id);
      }
      products = products.filter(p => p.id !== id && String(p.id) !== String(id));
      renderProductsTable();
      updateKPIs();
      showAdminToast('Product deleted from database successfully');
    } catch (err) {
      console.error('Error deleting product from Supabase:', err);
      showAdminToast('Failed to delete product from database');
    }
  };

  // Edit / Add Product Modal
  const productModal = document.getElementById('admin-product-modal');
  const productForm = document.getElementById('admin-product-form');

  window.openAddProductModal = function() {
    if (productForm) {
      productForm.reset();
      document.getElementById('modal-prod-id').value = '';
      document.getElementById('modal-prod-title').textContent = 'Add New Vadagam Variety';
      const preview = document.getElementById('prod-modal-preview');
      if (preview) preview.src = 'assets/plain-rice-vadagam.jpg';
      const imgInput = document.getElementById('prod-image');
      if (imgInput) imgInput.value = 'assets/plain-rice-vadagam.jpg';
    }
    if (productModal) productModal.classList.add('active');
  };

  window.editProduct = function(id) {
    const p = products.find(prod => prod.id === id || String(prod.id) === String(id));
    if (!p || !productForm) return;

    const prices = p.prices || { "250g": 90, "500g": 170, "1kg": 320, "5kg": 1500 };
    document.getElementById('modal-prod-id').value = p.id;
    document.getElementById('modal-prod-title').textContent = `Edit: ${p.name_en}`;
    document.getElementById('prod-name-en').value = p.name_en || '';
    document.getElementById('prod-name-ta').value = p.name_ta || '';
    document.getElementById('prod-subtitle-en').value = p.subtitle_en || '';
    document.getElementById('prod-subtitle-ta').value = p.subtitle_ta || '';
    document.getElementById('prod-category').value = p.category || p.category_slug || 'fermented';
    document.getElementById('prod-price-250').value = prices['250g'] || 90;
    document.getElementById('prod-price-500').value = prices['500g'] || 170;
    document.getElementById('prod-price-1000').value = prices['1kg'] || 320;
    document.getElementById('prod-price-5000').value = prices['5kg'] || 1500;
    document.getElementById('prod-image').value = p.image || p.image_url || '';
    const preview = document.getElementById('prod-modal-preview');
    if (preview) preview.src = p.image || p.image_url || 'assets/plain-rice-vadagam.jpg';
    document.getElementById('prod-spice').value = p.spice_level || 'Mild';
    document.getElementById('prod-desc-en').value = p.short_desc_en || '';
    document.getElementById('prod-desc-ta').value = p.short_desc_ta || '';

    if (productModal) productModal.classList.add('active');
  };

  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('modal-prod-id').value;

      const productData = {
        name_en: document.getElementById('prod-name-en').value.trim(),
        name_ta: document.getElementById('prod-name-ta').value.trim(),
        subtitle_en: document.getElementById('prod-subtitle-en').value.trim(),
        subtitle_ta: document.getElementById('prod-subtitle-ta').value.trim(),
        category: document.getElementById('prod-category').value,
        category_slug: document.getElementById('prod-category').value,
        badge_en: "Popular",
        badge_ta: "பிரபலமானது",
        badge_type: "gold",
        image: document.getElementById('prod-image').value.trim() || 'assets/plain-rice-vadagam.jpg',
        image_url: document.getElementById('prod-image').value.trim() || 'assets/plain-rice-vadagam.jpg',
        short_desc_en: document.getElementById('prod-desc-en').value.trim(),
        short_desc_ta: document.getElementById('prod-desc-ta').value.trim(),
        prices: {
          "250g": Number(document.getElementById('prod-price-250').value),
          "500g": Number(document.getElementById('prod-price-500').value),
          "1kg": Number(document.getElementById('prod-price-1000').value),
          "5kg": Number(document.getElementById('prod-price-5000').value)
        },
        spice_level: document.getElementById('prod-spice').value,
        in_stock: true
      };

      try {
        if (id) {
          if (window.ProductService) {
            await window.ProductService.updateProduct(id, productData);
          }
          const index = products.findIndex(p => p.id === id || String(p.id) === String(id));
          if (index > -1) products[index] = { ...products[index], ...productData };
          showAdminToast('Product updated in Supabase successfully!');
        } else {
          let created = null;
          if (window.ProductService) {
            created = await window.ProductService.createProduct(productData);
          }
          if (created) {
            products.unshift({ ...created, category: created.category_slug, image: created.image_url });
          } else {
            products.unshift({ id: 'prod-' + Date.now(), ...productData });
          }
          showAdminToast('New product added to Supabase successfully!');
        }
      } catch (err) {
        console.error('Error saving product to Supabase:', err);
        showAdminToast('Error saving product: ' + err.message);
      }

      renderProductsTable();
      updateKPIs();
      if (productModal) productModal.classList.remove('active');
    });
  }

  // -------------------------------------------------------------
  // ORDERS MANAGEMENT (Supabase CRM)
  // -------------------------------------------------------------
  function renderOrdersTable() {
    if (!ordersTableBody) return;

    if (orders.length === 0) {
      ordersTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">No orders recorded in Supabase yet.</td></tr>`;
      return;
    }

    ordersTableBody.innerHTML = orders.map((ord, idx) => {
      const itemsText = (ord.items || []).map(i => `${i.name_en} (${i.packSize} × ${i.qty})`).join(', ');

      return `
        <tr>
          <td><strong style="color: var(--gold);">${ord.id}</strong><br><span style="font-size: 0.72rem; color: #888;">${ord.date}</span></td>
          <td>
            <div style="font-weight: 800; color: #fff;">${ord.name}</div>
            <div style="font-size: 0.78rem; color: #b8b1a4;">📞 ${ord.phone}</div>
          </td>
          <td>
            <div style="font-size: 0.78rem; max-width: 200px; color: #d6cfc4;">
              ${ord.address}, ${ord.city} - ${ord.pincode}
            </div>
          </td>
          <td>
            <div style="font-size: 0.78rem; max-width: 220px; color: #e5c07b;">
              ${itemsText || 'General Vadagam Order'}
            </div>
          </td>
          <td><strong style="color: #fff; font-size: 1rem;">₹${ord.total}</strong><br><span style="font-size: 0.7rem; color: #86efac;">${ord.payment}</span></td>
          <td>
            <select onchange="window.updateOrderStatus('${ord.id}', this.value)" style="padding: 0.3rem 0.5rem; background: #0a0908; border: 1px solid var(--card-border); color: #fff; border-radius: 4px; font-size: 0.78rem; font-weight: 700;">
              <option value="New" ${ord.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Dispatched" ${ord.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
              <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn-whatsapp-sm" onclick="window.chatCustomerWhatsApp('${ord.phone}', '${ord.id}', '${ord.name}')">Chat</button>
              <button class="btn-danger-sm" onclick="window.deleteOrder('${ord.id}')">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderDashRecentOrders() {
    if (!dashRecentOrders) return;
    const recent = orders.slice(0, 4);

    if (recent.length === 0) {
      dashRecentOrders.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">No orders recorded in Supabase yet.</div>`;
      return;
    }

    dashRecentOrders.innerHTML = recent.map(ord => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div>
          <div style="font-weight: 700; color: #fff;">${ord.name} <span style="font-size: 0.78rem; color: var(--gold-light);">(${ord.id})</span></div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${ord.city} • ₹${ord.total}</div>
        </div>
        <div>
          <span style="font-size: 0.72rem; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 4px; background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 700;">
            ${ord.status}
          </span>
        </div>
      </div>
    `).join('');
  }

  window.updateOrderStatus = async function(id, newStatus) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    order.status = newStatus;

    try {
      if (window.OrderService) {
        await window.OrderService.updateOrderStatus(id, newStatus);
      }
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }

    updateKPIs();
    renderOrdersTable();
    renderDashRecentOrders();
    showAdminToast(`Order ${id} status updated to ${newStatus}`);
  };

  window.chatCustomerWhatsApp = function(phone, orderId, name) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Hello ${name}, regarding your DKB Vadagam Order *${orderId}*. Thank you for choosing AXCES SEVEN EXIMS!`;
    window.open(`https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  window.deleteOrder = async function(id) {
    if (!confirm('Are you sure you want to delete this order record from Supabase?')) return;
    try {
      if (window.OrderService) {
        await window.OrderService.deleteOrder(id);
      }
      orders = orders.filter(o => o.id !== id);
      updateKPIs();
      renderOrdersTable();
      renderDashRecentOrders();
      showAdminToast('Order deleted from Supabase');
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // -------------------------------------------------------------
  // RFQS MANAGEMENT (Supabase CRM)
  // -------------------------------------------------------------
  function renderRFQsTable() {
    if (!rfqsTableBody) return;

    if (rfqs.length === 0) {
      rfqsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">No export inquiries recorded in Supabase yet.</td></tr>`;
      return;
    }

    rfqsTableBody.innerHTML = rfqs.map((rfq, idx) => {
      return `
        <tr>
          <td><strong style="color: var(--gold);">${rfq.id}</strong><br><span style="font-size: 0.72rem; color: #888;">${rfq.date}</span></td>
          <td>
            <div style="font-weight: 800; color: #fff;">${rfq.name}</div>
            <div style="font-size: 0.75rem; color: #b8b1a4;">✉ ${rfq.email}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: #93c5fd;">🌍 ${rfq.country}</div>
            <div style="font-size: 0.75rem; color: #888;">${rfq.phone}</div>
          </td>
          <td><strong style="color: #fff; font-size: 0.85rem;">${rfq.volume}</strong></td>
          <td>
            <div style="font-size: 0.78rem; max-width: 220px; color: #d6cfc4;">
              ${rfq.products}
            </div>
          </td>
          <td>
            <select onchange="window.updateRFQStatus('${rfq.id}', this.value)" style="padding: 0.3rem 0.5rem; background: #0a0908; border: 1px solid var(--card-border); color: #fff; border-radius: 4px; font-size: 0.78rem; font-weight: 700;">
              <option value="New" ${rfq.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Quoted" ${rfq.status === 'Quoted' ? 'selected' : ''}>Quoted</option>
              <option value="Sampling" ${rfq.status === 'Sampling' ? 'selected' : ''}>Sampling</option>
              <option value="Confirmed" ${rfq.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Shipped" ${rfq.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            </select>
          </td>
          <td>
            <button class="btn-whatsapp-sm" onclick="window.chatBuyerWhatsApp('${rfq.phone}', '${rfq.id}', '${rfq.name}', '${rfq.country}')">
              Quote on WhatsApp
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.updateRFQStatus = async function(id, newStatus) {
    const rfq = rfqs.find(r => r.id === id);
    if (!rfq) return;
    rfq.status = newStatus;

    try {
      if (window.RFQService) {
        await window.RFQService.updateRFQStatus(id, newStatus);
      }
    } catch (err) {
      console.error('Error updating RFQ status in Supabase:', err);
    }

    updateKPIs();
    renderRFQsTable();
    showAdminToast(`Export lead ${id} status updated to ${newStatus}`);
  };

  window.chatBuyerWhatsApp = function(phone, rfqId, name, country) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Hello ${name} (${country}), thank you for contacting *AXCES SEVEN EXIMS* for export inquiry *${rfqId}*. We have prepared your CIF/FOB quote:`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // -------------------------------------------------------------
  // CSV Export Features
  // -------------------------------------------------------------
  window.exportOrdersCSV = function() {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    let csv = "Order ID,Date,Customer Name,Phone,Address,City,State,Pincode,Total,Payment,Status\n";
    orders.forEach(o => {
      csv += `"${o.id}","${o.date}","${o.name}","${o.phone}","${o.address}","${o.city}","${o.state}","${o.pincode}","${o.total}","${o.payment}","${o.status}"\n`;
    });

    downloadBlob(csv, `DKB_Orders_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
  };

  window.exportRFQsCSV = function() {
    if (rfqs.length === 0) {
      alert('No export leads to export.');
      return;
    }
    let csv = "RFQ ID,Date,Company Name,Email,Phone,Country,Volume,Products,Status\n";
    rfqs.forEach(r => {
      csv += `"${r.id}","${r.date}","${r.name}","${r.email}","${r.phone}","${r.country}","${r.volume}","${r.products}","${r.status}"\n`;
    });

    downloadBlob(csv, `DKB_Export_Leads_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
  };

  function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
    URL.revokeObjectURL(url);
  }

  // -------------------------------------------------------------
  // PAGE CONTENT & MEDIA CMS (Supabase Integrated)
  // -------------------------------------------------------------
  function loadCMSContent() {
    // Hero & Branding
    const b = siteCMS.branding || DEFAULT_SITE_CONTENT.branding;
    setVal('cms-logo-url', b.logo);
    setImg('cms-logo-preview', b.logo);
    setVal('cms-hero-url', b.heroImage);
    setImg('cms-hero-preview', b.heroImage);
    setVal('cms-announcement-en', b.announcement_en);
    setVal('cms-announcement-ta', b.announcement_ta);
    setVal('cms-hero-badge-en', b.heroBadge_en);
    setVal('cms-hero-badge-ta', b.heroBadge_ta);
    setVal('cms-hero-title-en', b.heroTitle_en);
    setVal('cms-hero-title-ta', b.heroTitle_ta);
    setVal('cms-hero-sub-en', b.heroSub_en);
    setVal('cms-hero-sub-ta', b.heroSub_ta);
    setVal('cms-hero-rating-title', b.ratingTitle);
    setVal('cms-hero-rating-sub', b.ratingSub);

    // Pillars
    const p = siteCMS.pillars || DEFAULT_SITE_CONTENT.pillars;
    setVal('cms-p1-title', p.p1_title);
    setVal('cms-p1-desc', p.p1_desc);
    setVal('cms-p2-title', p.p2_title);
    setVal('cms-p2-desc', p.p2_desc);
    setVal('cms-p3-title', p.p3_title);
    setVal('cms-p3-desc', p.p3_desc);
    setVal('cms-p4-title', p.p4_title);
    setVal('cms-p4-desc', p.p4_desc);

    // Health & Story
    const s = siteCMS.story || DEFAULT_SITE_CONTENT.story;
    setVal('cms-benefits-title', s.benefits_title);
    setVal('cms-benefits-sub', s.benefits_sub);
    setVal('cms-about-title', s.about_title);
    setVal('cms-about-yard', s.about_yard);
    setVal('cms-about-p1', s.about_p1);
    setVal('cms-about-p2', s.about_p2);

    // Export
    const e = siteCMS.export || DEFAULT_SITE_CONTENT.export;
    setVal('cms-export-title', e.title);
    setVal('cms-export-moq', e.moq);
    setVal('cms-export-desc', e.desc);

    // Footer
    const f = siteCMS.footer || DEFAULT_SITE_CONTENT.footer;
    setVal('cms-contact-phone', f.phone);
    setVal('cms-contact-email', f.email);
    setVal('cms-contact-address', f.address);
    setVal('cms-social-ig', f.social_ig);
    setVal('cms-social-fb', f.social_fb);
    setVal('cms-social-yt', f.social_yt);
    setVal('cms-social-wa', f.social_wa);
    setVal('cms-footer-copyright', f.copyright);

    // Render Reviews
    renderCMSReviews();
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  }

  function setImg(id, src) {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function renderCMSReviews() {
    const container = document.getElementById('cms-reviews-list');
    if (!container) return;
    const reviewsList = (testimonials && testimonials.length > 0) ? testimonials : (siteCMS.reviews || DEFAULT_SITE_CONTENT.reviews);

    if (reviewsList.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">No reviews yet. Click '+ Add New Review' to add one.</div>`;
      return;
    }

    container.innerHTML = reviewsList.map((rev, idx) => `
      <div class="cms-review-card">
        <div>
          <div style="font-weight: 700; color: #fff;">${rev.author} <span style="font-size: 0.78rem; color: var(--gold-light);">(${rev.location})</span></div>
          <div style="font-size: 0.78rem; color: #ffd700; margin: 0.2rem 0;">${'★'.repeat(Number(rev.rating) || 5)}</div>
          <div style="font-size: 0.82rem; color: #b8b1a4; font-style: italic;">"${rev.quote}"</div>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          <button type="button" class="btn-gold-sm" onclick="window.editReview(${idx})">Edit</button>
          <button type="button" class="btn-danger-sm" onclick="window.deleteReview(${idx})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.saveAllCMSContent = async function() {
    siteCMS = {
      branding: {
        logo: getVal('cms-logo-url'),
        heroImage: getVal('cms-hero-url'),
        announcement_en: getVal('cms-announcement-en'),
        announcement_ta: getVal('cms-announcement-ta'),
        heroBadge_en: getVal('cms-hero-badge-en'),
        heroBadge_ta: getVal('cms-hero-badge-ta'),
        heroTitle_en: getVal('cms-hero-title-en'),
        heroTitle_ta: getVal('cms-hero-title-ta'),
        heroSub_en: getVal('cms-hero-sub-en'),
        heroSub_ta: getVal('cms-hero-sub-ta'),
        ratingTitle: getVal('cms-hero-rating-title'),
        ratingSub: getVal('cms-hero-rating-sub')
      },
      pillars: {
        p1_title: getVal('cms-p1-title'),
        p1_desc: getVal('cms-p1-desc'),
        p2_title: getVal('cms-p2-title'),
        p2_desc: getVal('cms-p2-desc'),
        p3_title: getVal('cms-p3-title'),
        p3_desc: getVal('cms-p3-desc'),
        p4_title: getVal('cms-p4-title'),
        p4_desc: getVal('cms-p4-desc')
      },
      story: {
        benefits_title: getVal('cms-benefits-title'),
        benefits_sub: getVal('cms-benefits-sub'),
        about_title: getVal('cms-about-title'),
        about_yard: getVal('cms-about-yard'),
        about_p1: getVal('cms-about-p1'),
        about_p2: getVal('cms-about-p2')
      },
      export: {
        title: getVal('cms-export-title'),
        moq: getVal('cms-export-moq'),
        desc: getVal('cms-export-desc')
      },
      footer: {
        phone: getVal('cms-contact-phone'),
        email: getVal('cms-contact-email'),
        address: getVal('cms-contact-address'),
        social_ig: getVal('cms-social-ig'),
        social_fb: getVal('cms-social-fb'),
        social_yt: getVal('cms-social-yt'),
        social_wa: getVal('cms-social-wa'),
        copyright: getVal('cms-footer-copyright')
      }
    };

    try {
      if (window.CMSService) {
        await window.CMSService.saveAllCMS(siteCMS);
      }
      if (window.SettingsService) {
        await window.SettingsService.saveSettings({
          phone: siteCMS.footer.phone,
          email: siteCMS.footer.email,
          address: siteCMS.footer.address,
          tagline: siteCMS.branding.announcement_en
        });
      }
      showAdminToast('All page content & media saved directly to Supabase!');
    } catch (err) {
      console.error('Error saving CMS content to Supabase:', err);
      showAdminToast('Error saving CMS content: ' + err.message);
    }
  };

  window.resetCMSDefaults = async function() {
    if (!confirm('Are you sure you want to reset all website text & images to original defaults?')) return;
    siteCMS = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    try {
      if (window.CMSService) {
        await window.CMSService.saveAllCMS(siteCMS);
      }
      loadCMSContent();
      showAdminToast('Reset to original website defaults in Supabase.');
    } catch (err) {
      console.error('Error resetting CMS:', err);
    }
  };

  // Testimonials Modals
  const reviewModal = document.getElementById('admin-review-modal');
  const reviewForm = document.getElementById('admin-review-form');

  window.openAddReviewModal = function() {
    if (reviewForm) {
      reviewForm.reset();
      document.getElementById('rev-index').value = '-1';
      document.getElementById('modal-review-title').textContent = 'Add Customer Testimonial';
    }
    if (reviewModal) reviewModal.classList.add('active');
  };

  window.editReview = function(idx) {
    const list = (testimonials && testimonials.length > 0) ? testimonials : (siteCMS.reviews || []);
    const rev = list[idx];
    if (!rev || !reviewForm) return;

    document.getElementById('rev-index').value = idx;
    document.getElementById('modal-review-title').textContent = `Edit Testimonial: ${rev.author}`;
    document.getElementById('rev-author').value = rev.author;
    document.getElementById('rev-location').value = rev.location;
    document.getElementById('rev-rating').value = rev.rating || '5';
    document.getElementById('rev-quote').value = rev.quote;

    if (reviewModal) reviewModal.classList.add('active');
  };

  window.deleteReview = async function(idx) {
    if (!confirm('Delete this customer review?')) return;
    const list = (testimonials && testimonials.length > 0) ? testimonials : (siteCMS.reviews || []);
    const rev = list[idx];
    if (!rev) return;

    try {
      if (rev.id && window.TestimonialService) {
        await window.TestimonialService.deleteTestimonial(rev.id);
      }
      testimonials.splice(idx, 1);
      renderCMSReviews();
      showAdminToast('Review deleted from Supabase');
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idx = Number(document.getElementById('rev-index').value);
      const revData = {
        author: document.getElementById('rev-author').value.trim(),
        location: document.getElementById('rev-location').value.trim(),
        rating: document.getElementById('rev-rating').value,
        quote: document.getElementById('rev-quote').value.trim()
      };

      try {
        if (idx >= 0 && testimonials[idx] && testimonials[idx].id) {
          if (window.TestimonialService) {
            await window.TestimonialService.updateTestimonial(testimonials[idx].id, revData);
          }
          testimonials[idx] = { ...testimonials[idx], ...revData };
        } else {
          let created = null;
          if (window.TestimonialService) {
            created = await window.TestimonialService.createTestimonial(revData);
          }
          if (created) {
            testimonials.push({
              id: created.id,
              author: created.author_name,
              location: created.location_role,
              rating: created.rating,
              quote: created.quote,
              initials: created.avatar_initials
            });
          } else {
            testimonials.push(revData);
          }
        }
        showAdminToast(idx >= 0 ? 'Review updated in Supabase!' : 'New review added to Supabase!');
      } catch (err) {
        console.error('Error saving review to Supabase:', err);
      }

      renderCMSReviews();
      if (reviewModal) reviewModal.classList.remove('active');
    });
  }

  // -------------------------------------------------------------
  // SITE SETTINGS
  // -------------------------------------------------------------
  const settingsForm = document.getElementById('admin-settings-form');

  async function loadSiteSettings() {
    let saved = null;
    try {
      if (window.SettingsService) {
        saved = await window.SettingsService.getSettings();
      }
    } catch (err) {
      console.error('Error loading site settings:', err);
    }

    if (!saved) {
      saved = {
        phone: "+91 8344594952",
        email: "info@a7exims.com",
        address: "Coimbatore, Tamil Nadu, India",
        tagline: "Traditional Taste • Global Reach"
      };
    }

    if (document.getElementById('set-phone')) document.getElementById('set-phone').value = saved.phone || '';
    if (document.getElementById('set-email')) document.getElementById('set-email').value = saved.email || '';
    if (document.getElementById('set-address')) document.getElementById('set-address').value = saved.address || '';
    if (document.getElementById('set-tagline')) document.getElementById('set-tagline').value = saved.tagline || '';
  }

  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const settings = {
        phone: document.getElementById('set-phone').value.trim(),
        email: document.getElementById('set-email').value.trim(),
        address: document.getElementById('set-address').value.trim(),
        tagline: document.getElementById('set-tagline').value.trim()
      };
      
      try {
        if (window.SettingsService) {
          await window.SettingsService.saveSettings(settings);
        }
        showAdminToast('Site settings saved to Supabase successfully!');
      } catch (err) {
        console.error('Error saving site settings:', err);
        showAdminToast('Error saving settings: ' + err.message);
      }
    });
  }

  // Admin Password Change Handler
  const passChangeForm = document.getElementById('admin-password-change-form');
  if (passChangeForm) {
    passChangeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currPass = document.getElementById('curr-admin-pass').value.trim();
      const newPass = document.getElementById('new-admin-pass').value.trim();
      const confirmPass = document.getElementById('confirm-admin-pass').value.trim();
      const msgBox = document.getElementById('pass-change-msg');

      const currentStoredPass = getAdminPassword();

      // Check current password (or recovery master pins)
      if (currPass !== currentStoredPass && currPass !== 'a7e@2026' && currPass !== '1234' && currPass !== 'admin') {
        if (msgBox) {
          msgBox.style.display = 'block';
          msgBox.style.background = 'rgba(239, 68, 68, 0.15)';
          msgBox.style.border = '1px solid #ef4444';
          msgBox.style.color = '#ef4444';
          msgBox.textContent = '❌ Incorrect Current Password. Please enter your valid current password.';
        }
        return;
      }

      // Check new password length
      if (newPass.length < 4) {
        if (msgBox) {
          msgBox.style.display = 'block';
          msgBox.style.background = 'rgba(239, 68, 68, 0.15)';
          msgBox.style.border = '1px solid #ef4444';
          msgBox.style.color = '#ef4444';
          msgBox.textContent = '❌ New password must be at least 4 characters long.';
        }
        return;
      }

      // Check confirmation
      if (newPass !== confirmPass) {
        if (msgBox) {
          msgBox.style.display = 'block';
          msgBox.style.background = 'rgba(239, 68, 68, 0.15)';
          msgBox.style.border = '1px solid #ef4444';
          msgBox.style.color = '#ef4444';
          msgBox.textContent = '❌ New Password and Confirm Password do not match.';
        }
        return;
      }

      // Save new password
      localStorage.setItem('dkb_admin_password', newPass);
      passChangeForm.reset();

      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.style.background = 'rgba(16, 185, 129, 0.15)';
        msgBox.style.border = '1px solid #10b981';
        msgBox.style.color = '#10b981';
        msgBox.textContent = '✅ Admin Password changed successfully! Use your new password for your next login.';
      }

      showAdminToast('Admin Password changed successfully!');
    });
  }

  // Modal Closer helper
  window.closeAdminModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  };

  // Toast Notification
  function showAdminToast(text) {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = text;
    toast.style.cssText = "background: #1f1b15; border-left: 4px solid #d4af37; border-radius: 6px; padding: 0.85rem 1.25rem; color: #fff; font-size: 0.85rem; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.7); animation: slideInLeft 0.3s ease;";
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
