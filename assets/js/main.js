/**
 * AXCES SEVEN EXIMS - MAIN FRONTEND & SUPABASE INTEGRATION ENGINE
 * Production-ready backend synchronization for products, facility gallery, certificates,
 * company settings, and lead inquiries via Supabase.
 */

// ==========================================================================
// 1. DEFAULT DATASETS (Used as initial graceful fallback)
// ==========================================================================
const DEFAULT_SITE_SETTINGS = {
  companyName: "AXCES SEVEN EXIMS",
  tagline: "Pure & Natural Products 2026",
  primaryPhone: "+91 8344594952",
  secondaryPhone: "+91 9659298629",
  email: "info@a7exims.com",
  backupEmail: "moulikatraders3@gmail.com",
  address: "2/1154, Bettathapuram, Coimbatore, TN 641104",
  contactPerson: "Jawahar L.",
  established: "2019",
  experience: "7 Years"
};

// Normalize image path for root website pages
function normalizeImgPath(path) {
  if (!path) return "assets/images/prod-turmeric-mortar.jpg";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return path.replace(/^(\.\.\/)+/, "").replace(/^(\.\/)+/, "");
}

// ==========================================================================
// 2. DYNAMIC SUPABASE SYNC FUNCTIONS
// ==========================================================================

/**
 * Sync Company Settings across header, footer & contact areas
 */
async function syncCompanySettings() {
  try {
    let settings = DEFAULT_SITE_SETTINGS;

    if (window.AppSupabase) {
      try {
        const dbSettings = await window.AppSupabase.settings.get();
        if (dbSettings) {
          settings = {
            companyName: dbSettings.company_name || DEFAULT_SITE_SETTINGS.companyName,
            tagline: dbSettings.tagline || DEFAULT_SITE_SETTINGS.tagline,
            primaryPhone: dbSettings.primary_phone || DEFAULT_SITE_SETTINGS.primaryPhone,
            secondaryPhone: dbSettings.secondary_phone || DEFAULT_SITE_SETTINGS.secondaryPhone,
            email: dbSettings.email || DEFAULT_SITE_SETTINGS.email,
            backupEmail: dbSettings.backup_email || DEFAULT_SITE_SETTINGS.backupEmail,
            address: dbSettings.address || DEFAULT_SITE_SETTINGS.address,
            contactPerson: dbSettings.contact_person || DEFAULT_SITE_SETTINGS.contactPerson,
            established: dbSettings.established || DEFAULT_SITE_SETTINGS.established,
            experience: dbSettings.experience || DEFAULT_SITE_SETTINGS.experience
          };
        }
      } catch (e) {
        console.warn("Using cached settings due to network:", e);
      }
    }

    const phone = settings.primaryPhone || "+91 8344594952";
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const email = settings.email || "info@a7exims.com";
    const address = settings.address || "2/1154, Bettathapuram, Coimbatore, TN 641104";

    // Top bar contact
    const topBarContact = document.querySelector(".top-bar-contact");
    if (topBarContact) {
      const phoneLink = topBarContact.querySelector('a[href^="tel:"]');
      const emailLink = topBarContact.querySelector('a[href^="mailto:"]');
      if (phoneLink) {
        phoneLink.href = `tel:${cleanPhone}`;
        phoneLink.innerHTML = `📞 ${phone}`;
      }
      if (emailLink) {
        emailLink.href = `mailto:${email}`;
        emailLink.innerHTML = `✉️ ${email}`;
      }
    }

    // Footer contact list
    const footerPhoneLink = document.querySelector('.footer-contact-list a[href^="tel:"]');
    if (footerPhoneLink) {
      footerPhoneLink.href = `tel:${cleanPhone}`;
      footerPhoneLink.textContent = phone;
    }

    const footerEmailLink = document.querySelector('.footer-contact-list a[href^="mailto:"]');
    if (footerEmailLink) {
      footerEmailLink.href = `mailto:${email}`;
      footerEmailLink.textContent = email;
    }

    const footerAddrSpan = document.querySelectorAll(".footer-contact-list li span");
    if (footerAddrSpan && footerAddrSpan.length >= 2) {
      const addrItem = Array.from(footerAddrSpan).find(el => !el.querySelector("a"));
      if (addrItem) {
        addrItem.textContent = address;
      }
    }

    // Floating WhatsApp
    const floatWa = document.querySelector(".floating-whatsapp");
    if (floatWa) {
      const waNumber = cleanPhone.replace("+", "");
      floatWa.href = `https://wa.me/${waNumber}?text=Hello%20A7%20Exims,%20I%20am%20interested%20in%20your%20products.`;
    }
  } catch (err) {
    console.warn("Company settings sync error:", err);
  }
}

/**
 * Synchronize Products Grid (food-products.html & non-food-products.html) from Supabase
 */
async function syncProductsGrid() {
  const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/") || window.location.pathname === "";
  if (isHomePage) return;

  const prodGrid = document.querySelector(".products-5col-grid, .product-grid, .products-grid");
  if (!prodGrid) return;

  const path = window.location.pathname.toLowerCase();
  const pageTitle = (document.querySelector(".section-title")?.textContent || "").toLowerCase();

  let targetType = null;
  if (path.includes("non-food") || pageTitle.includes("non-food") || pageTitle.includes("non food")) {
    targetType = "non-food";
  } else if (path.includes("food") || pageTitle.includes("food")) {
    targetType = "food";
  }

  if (!targetType) return;

  try {
    let products = [];
    if (window.AppSupabase) {
      products = await window.AppSupabase.products.getAll({ type: targetType, status: 'active' });
    }

    if (!products || products.length === 0) {
      prodGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #64748b;">
          <p style="font-size: 16px; font-weight: 600;">No products currently listed under this category.</p>
          <p style="font-size: 13px;">Please check back soon or contact us for custom export enquiries.</p>
        </div>
      `;
      return;
    }

    prodGrid.innerHTML = "";
    products.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-category", prod.category || "powders");
      card.innerHTML = `
        <div class="product-card-thumb">
          <img src="${normalizeImgPath(prod.image)}" alt="${prod.name}" onerror="this.src='assets/images/prod-turmeric-mortar.jpg'">
        </div>
        <div class="product-card-title">${prod.name}</div>
        <div class="product-card-sub">${prod.subtitle || 'pure & natural'}</div>
        <a href="product-detail.html?sku=${encodeURIComponent(prod.id)}" class="btn-view-product">View Product</a>
      `;
      prodGrid.appendChild(card);
    });

    // Setup Category Filter Buttons
    const filterBtns = document.querySelectorAll(".filter-btn");
    const productCards = prodGrid.querySelectorAll(".product-card");

    filterBtns.forEach((btn) => {
      btn.onclick = function () {
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        productCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (filterValue === "all" || category === filterValue) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      };
    });
  } catch (err) {
    console.error("Products grid sync error:", err);
  }
}

/**
 * Synchronize Warehouse & Packaging Facility Gallery (facility.html) from Supabase
 */
async function syncFacilityGrid() {
  const facGrid = document.querySelector(".facility-grid");
  if (!facGrid) return;

  try {
    let facilities = [];
    if (window.AppSupabase) {
      facilities = await window.AppSupabase.facility.getAll();
    }

    if (facilities && facilities.length > 0) {
      facGrid.innerHTML = "";
      facilities.forEach(item => {
        const card = document.createElement("div");
        card.className = "facility-card";
        card.title = "Click to enlarge";
        card.innerHTML = `
          <img src="${normalizeImgPath(item.image)}" alt="${item.title}" onerror="this.src='assets/images/warehouse-1.jpg'">
          <div class="facility-caption" style="display:none;">${item.title}</div>
        `;
        facGrid.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Facility sync error:", err);
  }
}

/**
 * Synchronize Export Certifications Grid (certification.html) from Supabase
 */
async function syncCertificatesGrid() {
  const certGrid = document.querySelector(".cert-grid");
  if (!certGrid) return;

  try {
    let certs = [];
    if (window.AppSupabase) {
      certs = await window.AppSupabase.certificates.getAll();
    }

    if (certs && certs.length > 0) {
      certGrid.innerHTML = "";
      certs.forEach(item => {
        const card = document.createElement("div");
        card.className = "cert-card";
        card.title = `Click to view full ${item.title} Certificate`;
        card.innerHTML = `
          <div class="cert-frame">
            <img src="${normalizeImgPath(item.image)}" alt="${item.title} Certificate" onerror="this.src='assets/images/cert-gst.jpg'">
          </div>
          <div class="cert-title">${item.title}</div>
        `;
        certGrid.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Certificates sync error:", err);
  }
}

/**
 * Synchronize Product Detail Page based on SKU URL param (product-detail.html)
 */
async function syncProductDetail() {
  if (!window.location.pathname.includes("product-detail.html")) return;

  const urlParams = new URLSearchParams(window.location.search);
  const sku = urlParams.get("sku");
  if (!sku) return;

  try {
    let prod = null;
    if (window.AppSupabase) {
      prod = await window.AppSupabase.products.getById(sku);
    }

    if (prod) {
      const heroImg = document.querySelector(".product-detail-hero-img img");
      if (heroImg && prod.image) {
        heroImg.src = normalizeImgPath(prod.image);
        heroImg.alt = prod.name;
      }
      const titleEl = document.querySelector(".product-info-col h2");
      if (titleEl) {
        titleEl.textContent = prod.name;
      }
      const introEl = document.querySelector(".product-intro-text");
      if (introEl && prod.subtitle) {
        introEl.textContent = `${prod.name} (${prod.subtitle}) sourced from premium export grade processing facilities.`;
      }
      const secTitle = document.querySelector(".section-title");
      if (secTitle) {
        secTitle.textContent = prod.type === "non-food" ? "Non-Food Products" : "Food Products";
      }

      // Pre-fill hidden product field in inquiry form
      const inqProductField = document.getElementById("inqProduct");
      if (inqProductField) {
        inqProductField.value = `${prod.name} [${prod.id}]`;
      }
    }
  } catch (err) {
    console.warn("Product detail sync error:", err);
  }
}

// ==========================================================================
// 3. LIGHTBOX CONTROLLER
// ==========================================================================
function initLightbox() {
  const lightbox = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, caption) {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption || "";
      }
      lightbox.classList.add("active");
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("click", function (e) {
    const card = e.target.closest(".cert-card, .facility-card");
    if (card) {
      const img = card.querySelector("img");
      const title = card.querySelector(".cert-title") || card.querySelector(".facility-caption");
      if (img) {
        openLightbox(img.src, title ? title.textContent : "");
      }
    }
  });
}

// ==========================================================================
// 4. TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message) {
  let toast = document.querySelector(".toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ==========================================================================
// 5. PUBLIC FORM HANDLERS (SUPABASE POWERED)
// ==========================================================================
function initHomeContactForm() {
  const contactForm = document.getElementById("homeContactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("contactName")?.value.trim() || "";
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const subject = document.getElementById("contactSubject")?.value.trim() || "";
    const message = document.getElementById("contactMessage")?.value.trim() || "";

    if (!name || !email) {
      showToast("Please enter your name and email address.");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";
    }

    try {
      if (window.AppSupabase) {
        await window.AppSupabase.inquiries.create({
          name,
          email,
          product: subject || "General Website Inquiry",
          message,
          company: "Direct Web Visitor",
          address: "Website Lead",
          phone: "Via Website",
          whatsapp: "Via Website",
          source: "homepage_contact"
        });
      }
      showToast("Thank you! Your message has been saved. Opening WhatsApp...");
    } catch (err) {
      console.error("Error submitting contact inquiry:", err);
      showToast("Message recorded. Connecting with our export team...");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }

    const whatsappText = encodeURIComponent(
      `*New Website Contact Inquiry*\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/918344594952?text=${whatsappText}`, "_blank");
    }, 800);

    contactForm.reset();
  });
}

function initProductInquiryForm() {
  const inquiryForm = document.getElementById("productInquiryForm");
  if (!inquiryForm) return;

  inquiryForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("inqName")?.value.trim() || "";
    const email = document.getElementById("inqEmail")?.value.trim() || "";
    const company = document.getElementById("inqCompany")?.value.trim() || "";
    const address = document.getElementById("inqAddress")?.value.trim() || "";
    const phone = document.getElementById("inqPhone")?.value.trim() || "";
    const contactNo = document.getElementById("inqContactNumber")?.value.trim() || "";
    const whatsappNo = document.getElementById("inqWhatsappNumber")?.value.trim() || "";
    const hands = document.getElementById("inqHands")?.value || "";
    const packing = document.getElementById("inqPackingWt")?.value || "";
    const quantity = document.getElementById("inqQuantity")?.value.trim() || "";

    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get("sku") || "";
    const pageProductTitle = document.querySelector(".product-info-col h2")?.textContent || "Export Product";
    const product = sku ? `${pageProductTitle} (${sku})` : pageProductTitle;

    if (!name || !email || !phone) {
      showToast("Please fill in required fields: Name, Email, and Phone.");
      return;
    }

    const submitBtn = inquiryForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : "Submit Inquiry";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Submitting Lead...";
    }

    try {
      if (window.AppSupabase) {
        await window.AppSupabase.inquiries.create({
          name,
          email,
          company: company || "Export Client",
          address: address || "Not Specified",
          phone: phone,
          whatsapp: whatsappNo || phone,
          product: product,
          hands: hands || "Standard",
          packing: packing || "Standard Export Pack",
          quantity: quantity || "1 Container",
          source: "product_detail"
        });
      }
      showToast("Inquiry submitted successfully! Connecting with export team...");
    } catch (err) {
      console.error("Error submitting product lead:", err);
      showToast("Inquiry recorded. Connecting on WhatsApp...");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }

    const inquiryText = encodeURIComponent(
      `*New Inquiry - Export Product*\n\n` +
      `Product: ${product}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Company: ${company}\n` +
      `Address: ${address}\n` +
      `Phone: ${phone}\n` +
      `Contact No: ${contactNo}\n` +
      `WhatsApp No: ${whatsappNo}\n` +
      `No. of Hands: ${hands}\n` +
      `Packing Wt: ${packing}\n` +
      `Quantity Needed: ${quantity}`
    );

    setTimeout(() => {
      window.open(`https://wa.me/918344594952?text=${inquiryText}`, "_blank");
    }, 800);

    inquiryForm.reset();
  });
}

function initLanguageSwitcher() {
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", function () {
      const selected = this.value;
      if (selected === "ta") {
        showToast("மொழி விருப்பம் தமிழ் என சேமிக்கப்பட்டது.");
      } else {
        showToast("Language set to English.");
      }
    });
  }
}

// ==========================================================================
// 6. MAIN ENGINE RUNNER & OBSERVERS
// ==========================================================================
async function runAllDynamicSync() {
  await syncCompanySettings();
  await syncProductsGrid();
  await syncFacilityGrid();
  await syncCertificatesGrid();
  await syncProductDetail();
}

document.addEventListener("DOMContentLoaded", function () {
  runAllDynamicSync();

  // Mobile Menu Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("open");
    });
  }

  initLightbox();
  initHomeContactForm();
  initProductInquiryForm();
  initLanguageSwitcher();
});

// Re-sync on focus/visibility change
window.addEventListener("focus", function () {
  runAllDynamicSync();
});
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    runAllDynamicSync();
  }
});
