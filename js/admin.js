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
      heroBadge_en: "AUTHENTIC SOUTH INDIAN FLAVOURS",
      heroBadge_ta: "உண்மையான தென்னிந்திய பாரம்பரிய சுவை",
      heroTitle_en: "PREMIUM RICE VADAGAM",
      heroTitle_ta: "பாரம்பரிய அரிசி வத்தல்",
      heroSub_en: "Traditional taste. Naturally prepared. Probiotic Fermented Rice Fryums from our kitchen to the world.",
      heroSub_ta: "பாரம்பரிய சுவை. இயற்கையான முறையில் தயாரிக்கப்பட்டது. எங்கள் சமையலறையிலிருந்து உலகிற்கு.",
      pill1_en: "HOMEMADE QUALITY",
      pill2_en: "NO PRESERVATIVES",
      pill3_en: "EXPORT WORLDWIDE",
      ratingTitle: "DKB TRADITIONAL TASTE",
      ratingSub: "100% Sun-Dried Fermented Rice (4.9 / 5.0)"
    },
    categories: {
      cat1_title: "Palaya Sadam (Fermented)",
      cat1_sub: "Probiotic Rich Overnight Fermented Fryums",
      cat1_img: "assets/plain-rice-vadagam.jpg",
      cat2_title: "Herbal & Spiced Specialties",
      cat2_sub: "Mudakathan, Curry Leaf, Garlic & Pepper",
      cat2_img: "assets/herbal-rice-vadagam.jpg",
      cat3_title: "Classic Heritage Fryums",
      cat3_sub: "Sago (Javvarisi), Tomato & Traditional Plain",
      cat3_img: "assets/sago-rice-vadagam.jpg"
    },
    whyChoose: {
      main_title: "Why Choose Us",
      why1_title: "Well Managed Logistics",
      why1_desc: "Seamless door-to-door domestic delivery and international sea/air freight shipping.",
      why2_title: "Excellent Product Packaging",
      why2_desc: "Nitrogen-flushed, moisture-barrier multi-layer pouches for 12-month guaranteed crispness.",
      why3_title: "Quality Assured Products",
      why3_desc: "100% natural ingredients, farm-fresh spices, zero chemical preservatives, lab tested.",
      why4_title: "Competitive Prices",
      why4_desc: "Direct manufacturer pricing with transparent tiered volume discounts for retailers.",
      why5_title: "Wide Distribution Network",
      why5_desc: "Supplying supermarkets and diaspora stores in USA, UK, UAE, Singapore & Australia.",
      why6_title: "Dedication & Focus",
      why6_desc: "Committed to preserving South Indian culinary heritage with complete export compliance."
    },
    facility: {
      main_heading: "Warehouse & Packaging Facility",
      main_subtitle: "State-of-the-art sterile solar green-houses, nitrogen-flushed pouch packaging, and moisture-controlled warehousing in Coimbatore.",
      fac1_title: "Hygienic Solar Sun-Drying Yards",
      fac1_desc: "Spread over clean food-grade fabrics inside closed poly-greenhouse yards to protect from dust, birds, and moisture while maximizing UV sun-drying.",
      fac2_title: "Nitrogen-Flushed Packaging",
      fac2_desc: "Automated pouch filling and heat-sealing with food-grade nitrogen flushing that guarantees zero oil rancidity and 12-month crispness retention.",
      fac3_title: "Export Palletizing & Loading",
      fac3_desc: "Full Container Load (FCL) and Less Container Load (LCL) palletized loading with moisture-barrier corrugated cartons and Phytosanitary certification."
    },
    certifications: {
      main_heading: "Certification",
      main_subtitle: "Recognized export certifications, food safety compliance, and commercial trade registrations.",
      cert1_label: "GST",
      cert1_org: "Govt. of India - GST Registered",
      cert1_desc: "Tax Invoicing & Commercial Export Clearance",
      cert1_img: "assets/a7e-logo.jpg",
      cert2_label: "MSME",
      cert2_org: "Ministry of MSME",
      cert2_desc: "Udyam Registered Manufacturing Unit",
      cert2_img: "assets/a7e-logo.jpg",
      cert3_label: "IEC",
      cert3_org: "Directorate General of Foreign Trade",
      cert3_desc: "Import Export Code (IEC Validated)",
      cert3_img: "assets/a7e-logo.jpg",
      cert4_label: "FSSAI",
      cert4_org: "Food Safety and Standards Authority",
      cert4_desc: "FSSAI License & Hygiene Compliance",
      cert4_img: "assets/a7e-logo.jpg",
      cert5_label: "AD Code",
      cert5_org: "Port Customs Registration",
      cert5_desc: "Authorized Dealer Code for Sea/Air Ports",
      cert5_img: "assets/a7e-logo.jpg",
      cert6_label: "Test Report",
      cert6_org: "NABL Accredited Laboratory",
      cert6_desc: "Nutritional, Moisture & Probiotic Test Report",
      cert6_img: "assets/a7e-logo.jpg"
    },
    about: {
      title: "ABOUT US",
      p1: "AXCES SEVEN EXIMS is a premier export and manufacturing enterprise based in Coimbatore, Tamil Nadu, dedicated to bringing authentic South Indian culinary heritage to households and retailers worldwide.",
      p2: "Our signature brand DKB focuses on handcrafted rice vadagam varieties and traditional probiotic fermented fryums (Palaya Sadam Vathal). Combining ancestral recipes with modern food-safety standards and closed-chamber solar sun-drying, we ensure consistent crispness, mouth-watering aroma, and 12-month shelf life.",
      p3: "We partner with supermarket chains, grocery importers, ethnic distributors, and HoReCa buyers across the USA, UK, UAE, Singapore, Malaysia, Australia, and New Zealand with end-to-end export documentation.",
      str1: "100% Traditional Fermentation (No Chemicals)",
      str2: "Clean Room Nitrogen-Flushed Pouch Packing",
      str3: "FSSAI, GST, IEC & Lab Certified Quality",
      str4: "Flexible MOQ (100 kg to Full 20ft/40ft FCL)",
      str5: "Custom Private Label & Buyer Branding"
    },
    export: {
      banner_sub: "GLOBAL EXPORT & BULK SUPPLY",
      title: "PREMIUM SOUTH INDIAN VADAGAMS FOR INTERNATIONAL BUYERS",
      moq: "Bulk Orders • Private Label • Container Supply",
      grow_title: "LET'S GROW TOGETHER",
      desc: "Interested in bulk orders, international distribution, or private label packaging? Axces Seven Exims is your reliable manufacturing partner with complete export documentation."
    },
    companyInfo: {
      phone: "+91 8344594952",
      phone2: "9940994469",
      email: "info@a7exims.com",
      contact_person: "Jawahar L.",
      business_entity: "Axces Seven Exims",
      address: "2/1154, Bettathapuram, Coimbatore, Tamil Nadu 641104, India"
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
      about_text: "Premier export house specializing in authentic South Indian Fermented Rice Fryums (Palaya Sadam Vathal), Herbal Vadagams, and heritage delicacies made with 100% natural ingredients.",
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
    const directLeads = orders.length + rfqs.length;

    if (kpiProductsCount) kpiProductsCount.textContent = products.length;
    if (kpiOrdersCount) kpiOrdersCount.textContent = orders.length;
    if (kpiRfqsCount) kpiRfqsCount.textContent = rfqs.length;
    if (kpiRevenueVal) kpiRevenueVal.textContent = `${directLeads} Leads`;

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
      const cat = p.category || p.category_slug || 'fermented';
      const packSizes = p.pack_sizes || (p.prices ? Object.keys(p.prices).join(', ') : '250g, 500g, 1kg, 5kg');
      const bulkInfo = p.bulk_packing || '20kg / 50kg Master Cartons & Pallets';

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
            <div style="font-size: 0.82rem; line-height: 1.4;">
              <div style="color: #e5c07b;">📦 <strong>Packs:</strong> ${packSizes}</div>
              <div style="font-size: 0.75rem; color: #b8b1a4; margin-top: 0.2rem;">🚢 ${bulkInfo}</div>
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
      const packsInput = document.getElementById('prod-packs');
      if (packsInput) packsInput.value = '250g, 500g, 1kg, 5kg';
      const bulkInput = document.getElementById('prod-bulk-packing');
      if (bulkInput) bulkInput.value = '20kg / 50kg Master Cartons & Pallets';
    }
    if (productModal) productModal.classList.add('active');
  };

  window.editProduct = function(id) {
    const p = products.find(prod => prod.id === id || String(prod.id) === String(id));
    if (!p || !productForm) return;

    document.getElementById('modal-prod-id').value = p.id;
    document.getElementById('modal-prod-title').textContent = `Edit: ${p.name_en}`;
    document.getElementById('prod-name-en').value = p.name_en || '';
    document.getElementById('prod-name-ta').value = p.name_ta || '';
    document.getElementById('prod-subtitle-en').value = p.subtitle_en || '';
    document.getElementById('prod-subtitle-ta').value = p.subtitle_ta || '';
    document.getElementById('prod-category').value = p.category || p.category_slug || 'fermented';
    
    const packsInput = document.getElementById('prod-packs');
    if (packsInput) {
      packsInput.value = p.pack_sizes || (p.prices ? Object.keys(p.prices).join(', ') : '250g, 500g, 1kg, 5kg');
    }
    const bulkInput = document.getElementById('prod-bulk-packing');
    if (bulkInput) {
      bulkInput.value = p.bulk_packing || '20kg / 50kg Master Cartons & Pallets';
    }

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

      const packsVal = document.getElementById('prod-packs') ? document.getElementById('prod-packs').value.trim() : '250g, 500g, 1kg, 5kg';
      const bulkVal = document.getElementById('prod-bulk-packing') ? document.getElementById('prod-bulk-packing').value.trim() : '20kg / 50kg Master Cartons & Pallets';

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
        pack_sizes: packsVal,
        bulk_packing: bulkVal,
        prices: {
          "250g": 0,
          "500g": 0,
          "1kg": 0,
          "5kg": 0
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
      const itemsText = (ord.items || []).map(i => `${i.name_en || i.product_name_en || 'Vadagam'} (${i.packSize || i.pack_size || '250g'} × ${i.qty || i.quantity || 1})`).join(', ');

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
          <td><span style="font-size: 0.82rem; font-weight: 700; color: #86efac;">${ord.payment || 'WhatsApp Order / COD'}</span></td>
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
          <div style="font-size: 0.75rem; color: var(--text-muted);">${ord.city} • ${ord.payment || 'WhatsApp Order'}</div>
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
    let csv = "Order ID,Date,Customer Name,Phone,Address,City,State,Pincode,Items,Payment,Status\n";
    orders.forEach(o => {
      const itemsText = (o.items || []).map(i => `${i.name_en || i.product_name_en || 'Vadagam'} (${i.packSize || i.pack_size || '250g'} x ${i.qty || i.quantity || 1})`).join('; ');
      csv += `"${o.id}","${o.date}","${o.name}","${o.phone}","${o.address}","${o.city}","${o.state}","${o.pincode}","${itemsText || 'General Vadagam Order'}","${o.payment || 'WhatsApp Order'}","${o.status}"\n`;
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
    // 1. Hero & Branding
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
    setVal('cms-pill-1-en', b.pill1_en || 'HOMEMADE QUALITY');
    setVal('cms-pill-2-en', b.pill2_en || 'NO PRESERVATIVES');
    setVal('cms-pill-3-en', b.pill3_en || 'EXPORT WORLDWIDE');
    setVal('cms-hero-rating-title', b.ratingTitle);
    setVal('cms-hero-rating-sub', b.ratingSub);

    // 2. Featured Categories (3 Tiles)
    const c = siteCMS.categories || DEFAULT_SITE_CONTENT.categories;
    setVal('cms-cat1-title', c.cat1_title);
    setVal('cms-cat1-sub', c.cat1_sub);
    setVal('cms-cat1-img', c.cat1_img);
    setImg('cms-cat1-preview', c.cat1_img);

    setVal('cms-cat2-title', c.cat2_title);
    setVal('cms-cat2-sub', c.cat2_sub);
    setVal('cms-cat2-img', c.cat2_img);
    setImg('cms-cat2-preview', c.cat2_img);

    setVal('cms-cat3-title', c.cat3_title);
    setVal('cms-cat3-sub', c.cat3_sub);
    setVal('cms-cat3-img', c.cat3_img);
    setImg('cms-cat3-preview', c.cat3_img);

    // 3. Why Choose Us (6 Features)
    const w = siteCMS.whyChoose || DEFAULT_SITE_CONTENT.whyChoose;
    setVal('cms-why-main-title', w.main_title);
    setVal('cms-why1-title', w.why1_title);
    setVal('cms-why1-desc', w.why1_desc);
    setVal('cms-why2-title', w.why2_title);
    setVal('cms-why2-desc', w.why2_desc);
    setVal('cms-why3-title', w.why3_title);
    setVal('cms-why3-desc', w.why3_desc);
    setVal('cms-why4-title', w.why4_title);
    setVal('cms-why4-desc', w.why4_desc);
    setVal('cms-why5-title', w.why5_title);
    setVal('cms-why5-desc', w.why5_desc);
    setVal('cms-why6-title', w.why6_title);
    setVal('cms-why6-desc', w.why6_desc);

    // 4. Warehouse & Packaging Facility (3 Cards)
    const fac = siteCMS.facility || DEFAULT_SITE_CONTENT.facility;
    setVal('cms-fac-main-title', fac.main_heading);
    setVal('cms-fac-main-sub', fac.main_subtitle);
    setVal('cms-fac1-title', fac.fac1_title);
    setVal('cms-fac1-desc', fac.fac1_desc);
    setVal('cms-fac2-title', fac.fac2_title);
    setVal('cms-fac2-desc', fac.fac2_desc);
    setVal('cms-fac3-title', fac.fac3_title);
    setVal('cms-fac3-desc', fac.fac3_desc);

    // 5. Certification & Government Accreditations (6 Tiles)
    const crt = siteCMS.certifications || DEFAULT_SITE_CONTENT.certifications;
    setVal('cms-cert-main-title', crt.main_heading);
    setVal('cms-cert-main-sub', crt.main_subtitle);
    setVal('cms-cert1-label', crt.cert1_label);
    setVal('cms-cert1-org', crt.cert1_org);
    setVal('cms-cert1-desc', crt.cert1_desc);
    setVal('cms-cert1-img', crt.cert1_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert1-preview', crt.cert1_img || 'assets/a7e-logo.jpg');

    setVal('cms-cert2-label', crt.cert2_label);
    setVal('cms-cert2-org', crt.cert2_org);
    setVal('cms-cert2-desc', crt.cert2_desc);
    setVal('cms-cert2-img', crt.cert2_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert2-preview', crt.cert2_img || 'assets/a7e-logo.jpg');

    setVal('cms-cert3-label', crt.cert3_label);
    setVal('cms-cert3-org', crt.cert3_org);
    setVal('cms-cert3-desc', crt.cert3_desc);
    setVal('cms-cert3-img', crt.cert3_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert3-preview', crt.cert3_img || 'assets/a7e-logo.jpg');

    setVal('cms-cert4-label', crt.cert4_label);
    setVal('cms-cert4-org', crt.cert4_org);
    setVal('cms-cert4-desc', crt.cert4_desc);
    setVal('cms-cert4-img', crt.cert4_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert4-preview', crt.cert4_img || 'assets/a7e-logo.jpg');

    setVal('cms-cert5-label', crt.cert5_label);
    setVal('cms-cert5-org', crt.cert5_org);
    setVal('cms-cert5-desc', crt.cert5_desc);
    setVal('cms-cert5-img', crt.cert5_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert5-preview', crt.cert5_img || 'assets/a7e-logo.jpg');

    setVal('cms-cert6-label', crt.cert6_label);
    setVal('cms-cert6-org', crt.cert6_org);
    setVal('cms-cert6-desc', crt.cert6_desc);
    setVal('cms-cert6-img', crt.cert6_img || 'assets/a7e-logo.jpg');
    setImg('cms-cert6-preview', crt.cert6_img || 'assets/a7e-logo.jpg');

    // 6. About Us & Operational Strengths
    const a = siteCMS.about || DEFAULT_SITE_CONTENT.about;
    setVal('cms-about-title', a.title);
    setVal('cms-about-p1', a.p1);
    setVal('cms-about-p2', a.p2);
    setVal('cms-about-p3', a.p3);
    setVal('cms-about-str1', a.str1);
    setVal('cms-about-str2', a.str2);
    setVal('cms-about-str3', a.str3);
    setVal('cms-about-str4', a.str4);
    setVal('cms-about-str5', a.str5);

    // 7. Global Export & Bulk Supply
    const e = siteCMS.export || DEFAULT_SITE_CONTENT.export;
    setVal('cms-export-sub', e.banner_sub);
    setVal('cms-export-title', e.title);
    setVal('cms-export-moq', e.moq);
    setVal('cms-export-grow-title', e.grow_title);
    setVal('cms-export-desc', e.desc);

    // 8. Company Info & Contact Desk
    const co = siteCMS.companyInfo || DEFAULT_SITE_CONTENT.companyInfo;
    setVal('cms-company-phone', co.phone);
    setVal('cms-company-phone2', co.phone2);
    setVal('cms-company-email', co.email);
    setVal('cms-company-person', co.contact_person);
    setVal('cms-company-entity', co.business_entity);
    setVal('cms-company-address', co.address);

    // 9. Footer & Social Links
    const f = siteCMS.footer || DEFAULT_SITE_CONTENT.footer;
    setVal('cms-footer-about', f.about_text);
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
        pill1_en: getVal('cms-pill-1-en'),
        pill2_en: getVal('cms-pill-2-en'),
        pill3_en: getVal('cms-pill-3-en'),
        ratingTitle: getVal('cms-hero-rating-title'),
        ratingSub: getVal('cms-hero-rating-sub')
      },
      categories: {
        cat1_title: getVal('cms-cat1-title'),
        cat1_sub: getVal('cms-cat1-sub'),
        cat1_img: getVal('cms-cat1-img'),
        cat2_title: getVal('cms-cat2-title'),
        cat2_sub: getVal('cms-cat2-sub'),
        cat2_img: getVal('cms-cat2-img'),
        cat3_title: getVal('cms-cat3-title'),
        cat3_sub: getVal('cms-cat3-sub'),
        cat3_img: getVal('cms-cat3-img')
      },
      whyChoose: {
        main_title: getVal('cms-why-main-title'),
        why1_title: getVal('cms-why1-title'),
        why1_desc: getVal('cms-why1-desc'),
        why2_title: getVal('cms-why2-title'),
        why2_desc: getVal('cms-why2-desc'),
        why3_title: getVal('cms-why3-title'),
        why3_desc: getVal('cms-why3-desc'),
        why4_title: getVal('cms-why4-title'),
        why4_desc: getVal('cms-why4-desc'),
        why5_title: getVal('cms-why5-title'),
        why5_desc: getVal('cms-why5-desc'),
        why6_title: getVal('cms-why6-title'),
        why6_desc: getVal('cms-why6-desc')
      },
      facility: {
        main_heading: getVal('cms-fac-main-title'),
        main_subtitle: getVal('cms-fac-main-sub'),
        fac1_title: getVal('cms-fac1-title'),
        fac1_desc: getVal('cms-fac1-desc'),
        fac2_title: getVal('cms-fac2-title'),
        fac2_desc: getVal('cms-fac2-desc'),
        fac3_title: getVal('cms-fac3-title'),
        fac3_desc: getVal('cms-fac3-desc')
      },
      certifications: {
        main_heading: getVal('cms-cert-main-title'),
        main_subtitle: getVal('cms-cert-main-sub'),
        cert1_label: getVal('cms-cert1-label'),
        cert1_org: getVal('cms-cert1-org'),
        cert1_desc: getVal('cms-cert1-desc'),
        cert1_img: getVal('cms-cert1-img'),
        cert2_label: getVal('cms-cert2-label'),
        cert2_org: getVal('cms-cert2-org'),
        cert2_desc: getVal('cms-cert2-desc'),
        cert2_img: getVal('cms-cert2-img'),
        cert3_label: getVal('cms-cert3-label'),
        cert3_org: getVal('cms-cert3-org'),
        cert3_desc: getVal('cms-cert3-desc'),
        cert3_img: getVal('cms-cert3-img'),
        cert4_label: getVal('cms-cert4-label'),
        cert4_org: getVal('cms-cert4-org'),
        cert4_desc: getVal('cms-cert4-desc'),
        cert4_img: getVal('cms-cert4-img'),
        cert5_label: getVal('cms-cert5-label'),
        cert5_org: getVal('cms-cert5-org'),
        cert5_desc: getVal('cms-cert5-desc'),
        cert5_img: getVal('cms-cert5-img'),
        cert6_label: getVal('cms-cert6-label'),
        cert6_org: getVal('cms-cert6-org'),
        cert6_desc: getVal('cms-cert6-desc'),
        cert6_img: getVal('cms-cert6-img')
      },
      about: {
        title: getVal('cms-about-title'),
        p1: getVal('cms-about-p1'),
        p2: getVal('cms-about-p2'),
        p3: getVal('cms-about-p3'),
        str1: getVal('cms-about-str1'),
        str2: getVal('cms-about-str2'),
        str3: getVal('cms-about-str3'),
        str4: getVal('cms-about-str4'),
        str5: getVal('cms-about-str5')
      },
      export: {
        banner_sub: getVal('cms-export-sub'),
        title: getVal('cms-export-title'),
        moq: getVal('cms-export-moq'),
        grow_title: getVal('cms-export-grow-title'),
        desc: getVal('cms-export-desc')
      },
      companyInfo: {
        phone: getVal('cms-company-phone'),
        phone2: getVal('cms-company-phone2'),
        email: getVal('cms-company-email'),
        contact_person: getVal('cms-company-person'),
        business_entity: getVal('cms-company-entity'),
        address: getVal('cms-company-address')
      },
      footer: {
        about_text: getVal('cms-footer-about'),
        phone: getVal('cms-company-phone'),
        email: getVal('cms-company-email'),
        address: getVal('cms-company-address'),
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
