/**
 * AXCES SEVEN EXIMS - ADMIN PANEL CORE JAVASCRIPT
 * Supabase-Powered Authentication, Database CRUD & Storage Operations
 */

// ==========================================================================
// 1. IMAGE PATH NORMALIZER FOR ADMIN VIEWS
// ==========================================================================
function adminImgPath(path) {
  if (!path) return "../assets/images/prod-turmeric-mortar.jpg";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const isInAdminFolder = window.location.pathname.includes("/admin/") || window.location.pathname.startsWith("admin/");
  let clean = path.replace(/^(\.\.\/)+/, "").replace(/^(\.\/)+/, "");
  return isInAdminFolder ? `../${clean}` : clean;
}

// ==========================================================================
// 2. AUTHENTICATION CONTROLLER (SUPABASE AUTH)
// ==========================================================================
async function checkAuth() {
  const isLoginPage = window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("admin-login.html");
  
  if (!window.AppSupabase) return;

  try {
    const session = await window.AppSupabase.auth.getSession();
    const isLoggedIn = !!session;

    if (!isLoggedIn && !isLoginPage) {
      const loginTarget = window.location.pathname.includes("/admin/") ? "login.html" : "admin/login.html";
      window.location.href = loginTarget;
    } else if (isLoggedIn && isLoginPage) {
      const dashTarget = window.location.pathname.includes("/admin/") ? "index.html" : "admin/index.html";
      window.location.href = dashTarget;
    } else if (isLoggedIn) {
      const user = session.user;
      const userEmailEl = document.querySelector(".user-name");
      if (userEmailEl && user.email) {
        userEmailEl.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
      }
    }
  } catch (err) {
    console.warn("Auth check error:", err);
  }
}

async function handleLogin(usernameOrEmail, password) {
  if (!window.AppSupabase) throw new Error("Supabase is not initialized");

  // If user entered 'admin' or username without @, map to admin@a7exims.com
  let email = usernameOrEmail.trim();
  if (!email.includes("@")) {
    if (email === "admin") {
      email = "admin@a7exims.com";
    } else {
      email = `${email}@a7exims.com`;
    }
  }

  const data = await window.AppSupabase.auth.signIn(email, password);
  return data;
}

async function handleLogout() {
  if (window.AppSupabase) {
    await window.AppSupabase.auth.signOut();
  }
  const loginTarget = window.location.pathname.includes("/admin/") ? "login.html" : "admin/login.html";
  window.location.href = loginTarget;
}

// ==========================================================================
// 3. TOAST NOTIFICATION HELPER
// ==========================================================================
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 4. DYNAMIC BADGES UPDATER
// ==========================================================================
async function updateAdminBadges() {
  if (!window.AppSupabase) return;

  try {
    const inquiries = await window.AppSupabase.inquiries.getAll();
    const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
    const inquiryBadges = document.querySelectorAll(".inquiry-new-count");
    inquiryBadges.forEach((b) => {
      b.textContent = newInquiriesCount;
      b.style.display = newInquiriesCount > 0 ? "inline-block" : "none";
    });

    const products = await window.AppSupabase.products.getAll();
    const foodCount = products.filter(p => (p.type || '').includes('food') && !(p.type || '').includes('non')).length;
    const nonFoodCount = products.filter(p => (p.type || '').includes('non')).length;

    const sideProdEl = document.getElementById("sideProdCount") || document.getElementById("sideProdBadge");
    if (sideProdEl) sideProdEl.textContent = products.length;

    const sideFoodEl = document.getElementById("sideFoodBadge");
    if (sideFoodEl) sideFoodEl.textContent = foodCount;

    const sideNonFoodEl = document.getElementById("sideNonFoodBadge");
    if (sideNonFoodEl) sideNonFoodEl.textContent = nonFoodCount;
  } catch (err) {
    console.warn("Badge update error:", err);
  }
}

// ==========================================================================
// 5. GLOBAL PAGE INITIALIZER
// ==========================================================================
document.addEventListener("DOMContentLoaded", async function () {
  await checkAuth();
  await updateAdminBadges();

  // Sidebar Mobile Toggle
  const sidebarToggle = document.getElementById("sidebarToggleBtn");
  const sidebar = document.querySelector(".admin-sidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Logout Buttons
  document.querySelectorAll(".btn-logout-action").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out of the Admin Panel?")) {
        await handleLogout();
      }
    });
  });
});
