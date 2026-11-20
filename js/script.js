/**
 * NEXA PORTFOLIO — script.js
 * Vanilla JavaScript (No Frameworks)
 * Handles: Portfolio Interactions & Integrated Admin CMS
 * Bagas Adrian Saputra (NEXA)
 */

/* ============================================================
   1. CONSTANTS & DEFAULT DATA (Based on Bagas Adrian Saputra CV)
   ============================================================ */
const STORAGE_KEY = "nexa_cms_data";
const ADMIN_PASSWORD = "nexa2024"; // ✏️ Ganti password admin di sini

const DEFAULT_DATA = {
  brandName: "NEXA",
  identity: {
    headline1: "Turning Ideas Into",
    headline2: "Digital Experiences.",
    heroDesc: "Mahasiswa yang berdedikasi di bidang desain grafis dan teknologi digital. Berpengalaman menggunakan Adobe Creative Suite dan Microsoft Office, serta aktif mendalami Web Development dan UI/UX Design untuk menciptakan solusi visual yang komunikatif dan profesional.",
    heroStatus: "Mahasiswa Aktif",
    heroLocation: "Purwokerto, Indonesia"
  },
  about: {
    name: "Bagas Adrian Saputra",
    title: "Mahasiswa • Graphic Designer • Web Learner",
    greeting: "Halo, saya Bagas Adrian Saputra 👋",
    p1: "Saya adalah mahasiswa yang berbasis di wilayah Purwokerto dengan minat mendalam pada perancangan identitas visual, media promosi, dan dunia digital. Saya telah terbiasa bekerja menggunakan Adobe Photoshop, Illustrator, Premiere Pro, serta aplikasi produktivitas Microsoft Office untuk menyelesaikan berbagai kebutuhan organisasi maupun proyek freelance.",
    p2: "Seiring dengan pesatnya perkembangan teknologi digital, saya juga sedang antusias memperluas wawasan ke bidang UI/UX Design menggunakan Figma serta dasar-dasar Web Development (HTML, CSS, JavaScript). Saya percaya bahwa perpaduan antara kepekaan visual dan logika pemrograman dapat menghasilkan produk digital yang memikat sekaligus fungsional.",
    tags: "Graphic Design, Branding & Visual Identity, UI/UX Exploration, Web Development, Social Media Creative, Digital Marketing"
  },
  projects: [
    {
      id: 1,
      title: "Brand Identity & Promosi UMKM",
      category: "graphic",
      desc: "Perancangan identitas visual komprehensif untuk bisnis lokal, mulai dari logo resmi, color palette, packaging mockup, hingga materi promosi media sosial.",
      tech: "Adobe Illustrator, Photoshop, Canva"
    },
    {
      id: 2,
      title: "Social Media Feed & Event Publication",
      category: "graphic",
      desc: "Rangkaian desain feeds Instagram, banner digital, dan poster publikasi kegiatan kampus & kepanitiaan dengan layout visual yang eye-catching dan harmonis.",
      tech: "Adobe Photoshop, Illustrator, Layouting"
    },
    {
      id: 3,
      title: "Mobile App Wireframe & UI Prototype",
      category: "uiux",
      desc: "Eksplorasi perancangan antarmuka aplikasi mobile produktivitas mahasiswa dengan pendekatan clean UI, komponen reusable, dan alur interaksi intuitif.",
      tech: "Figma, Wireframing, Prototyping"
    },
    {
      id: 4,
      title: "NEXA — Modern Minimalist Landing Page",
      category: "web",
      desc: "Website portfolio responsif yang dibangun dengan semantic HTML5, modern CSS3, dan Vanilla JavaScript tanpa framework, dilengkapi panel manajemen konten lokal.",
      tech: "HTML5, CSS3, Vanilla JS"
    },
    {
      id: 5,
      title: "Digital Marketing & Sales Promotion",
      category: "business",
      desc: "Strategi publikasi dan kampanye pemasaran digital untuk meningkatkan awareness produk lokal melalui copywriting tertarget dan visual promosi kreatif.",
      tech: "Digital Marketing, Copywriting, MS Excel"
    },
    {
      id: 6,
      title: "Sistem Informasi Pengelolaan Data",
      category: "academic",
      desc: "Proyek tugas kuliah yang mencakup pembuatan dokumentasi sistem, perancangan basis data relasional, dan simulasi alur operasional akademik.",
      tech: "Database, MS Office, Flowchart"
    }
  ],
  contact: {
    email: "bagasadrian@example.com",
    instagram: "@bagas_adrian",
    linkedin: "Bagas Adrian Saputra",
    github: "github.com/bagasadrian"
  },
  photos: {
    profile: "", // Base64 jika diunggah via admin
    projects: {} // { 1: base64, 2: base64, ... }
  }
};

// Current active CMS state
let currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));

/* ============================================================
   2. INITIALIZATION ON DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  applyDataToDOM();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavHighlight();
  initScrollReveal();
  initProjectFilter();
  initProjectModal();
  initBackToTop();
  initAdminCMS();
  initCopyrightYear();
});

/* ============================================================
   3. DATA MANAGEMENT (LOCALSTORAGE)
   ============================================================ */
function loadStoredData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      currentData = deepMerge(DEFAULT_DATA, parsed);
    } catch (e) {
      console.warn("Gagal memuat data dari LocalStorage:", e);
      currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }
}

function saveDataToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    showAdminToast("Perubahan berhasil disimpan!");
  } catch (e) {
    alert("Gagal menyimpan data (mungkin kuota penyimpanan browser penuh karena ukuran foto terlalu besar). Coba gunakan gambar dengan resolusi lebih kecil.");
    console.error(e);
  }
}

function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === "object" && !Array.isArray(item));
}

/* ============================================================
   4. APPLY DATA TO DOM (Render Real-Time)
   ============================================================ */
function applyDataToDOM() {
  // Brand Logo & Page Title
  const brandEls = document.querySelectorAll("#brand-logo, #footer-logo, #footer-copy-brand");
  brandEls.forEach(el => {
    if (el) el.textContent = currentData.brandName || "NEXA";
  });
  document.title = `${currentData.brandName || "NEXA"} — ${currentData.about.name} | Personal Portfolio`;

  // Hero Section
  setTextSafe("hero-headline1", currentData.identity.headline1);
  setTextSafe("hero-headline2", currentData.identity.headline2);
  setTextSafe("hero-desc", currentData.identity.heroDesc);
  setTextSafe("hero-status", currentData.identity.heroStatus);
  setTextSafe("hero-location", currentData.identity.heroLocation);

  // About Section
  setTextSafe("about-name", currentData.about.name);
  setTextSafe("about-title", currentData.about.title);
  setTextSafe("about-greeting", currentData.about.greeting);
  setTextSafe("about-p1", currentData.about.p1);
  setTextSafe("about-p2", currentData.about.p2);

  // About Tags
  const tagsContainer = document.getElementById("about-tags-container");
  if (tagsContainer && currentData.about.tags) {
    const tagList = currentData.about.tags.split(",").map(t => t.trim()).filter(Boolean);
    tagsContainer.innerHTML = tagList.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  }

  // Profile Photos
  const heroImg = document.getElementById("hero-profile-img");
  const aboutImg = document.getElementById("about-profile-img");
  const fallbackHero = document.getElementById("hero-profile-fallback");
  const fallbackAbout = document.getElementById("about-photo-fallback");

  if (currentData.photos && currentData.photos.profile) {
    if (heroImg) {
      heroImg.src = currentData.photos.profile;
      heroImg.style.display = "block";
    }
    if (aboutImg) {
      aboutImg.src = currentData.photos.profile;
      aboutImg.style.display = "block";
    }
    if (fallbackHero) fallbackHero.style.display = "none";
    if (fallbackAbout) fallbackAbout.style.display = "none";
  }

  // Projects
  if (Array.isArray(currentData.projects)) {
    currentData.projects.forEach(proj => {
      const card = document.querySelector(`.project-card[data-project-id="${proj.id}"]`);
      if (!card) return;

      // Category attribute & badge
      card.setAttribute("data-category", proj.category);
      const catEl = card.querySelector(`[data-proj-cat="${proj.id}"]`);
      if (catEl) catEl.textContent = formatCategoryLabel(proj.category);

      // Title & Desc
      const titleEl = card.querySelector(`[data-proj-title="${proj.id}"]`);
      if (titleEl) titleEl.textContent = proj.title;

      const descEl = card.querySelector(`[data-proj-desc="${proj.id}"]`);
      if (descEl) descEl.textContent = proj.desc;

      // Tech Tags
      const techContainer = card.querySelector(`[data-proj-tech="${proj.id}"]`);
      if (techContainer && proj.tech) {
        const techs = proj.tech.split(",").map(t => t.trim()).filter(Boolean);
        techContainer.innerHTML = techs.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join("");
      }

      // Project Photo (if uploaded)
      const pImg = card.querySelector(`[data-proj-img="${proj.id}"]`);
      if (pImg && currentData.photos.projects && currentData.photos.projects[proj.id]) {
        pImg.src = currentData.photos.projects[proj.id];
        card.querySelector(".project-card__thumb").classList.remove("no-img");
      }
    });
  }

  // Contact Info
  setTextSafe("contact-val-email", currentData.contact.email);
  setTextSafe("contact-val-instagram", currentData.contact.instagram);
  setTextSafe("contact-val-linkedin", currentData.contact.linkedin);
  setTextSafe("contact-val-github", currentData.contact.github);

  const emailLink = document.getElementById("contact-link-email");
  const emailCta = document.getElementById("contact-cta-btn");
  if (emailLink) emailLink.href = `mailto:${currentData.contact.email}`;
  if (emailCta) emailCta.href = `mailto:${currentData.contact.email}`;

  const igLink = document.getElementById("contact-link-instagram");
  if (igLink) {
    const handle = currentData.contact.instagram.replace("@", "");
    igLink.href = currentData.contact.instagram.startsWith("http") ? currentData.contact.instagram : `https://instagram.com/${handle}`;
  }

  const inLink = document.getElementById("contact-link-linkedin");
  if (inLink && currentData.contact.linkedin.startsWith("http")) {
    inLink.href = currentData.contact.linkedin;
  }

  const gitLink = document.getElementById("contact-link-github");
  if (gitLink) {
    const url = currentData.contact.github.startsWith("http") ? currentData.contact.github : `https://${currentData.contact.github}`;
    gitLink.href = url;
  }
}

function setTextSafe(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function formatCategoryLabel(cat) {
  const map = {
    graphic: "Graphic Design",
    uiux: "UI/UX Design",
    web: "Web Development",
    business: "Business Project",
    academic: "Academic Project"
  };
  return map[cat] || cat;
}

/* ============================================================
   5. NAVBAR & MOBILE MENU
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });
}

function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!hamburger || !mobileMenu) return;

  function toggleMenu(isOpen) {
    hamburger.classList.toggle("open", isOpen);
    mobileMenu.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.contains("open");
    toggleMenu(!isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });
}

/* ============================================================
   6. SMOOTH SCROLLING & ACTIVE NAV
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 72;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: "smooth"
        });
      }
    });
  });
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === currentId) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/* ============================================================
   7. SCROLL REVEAL (INTERSECTION OBSERVER)
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   8. PROJECT FILTERING & DETAIL MODAL
   ============================================================ */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("projects-empty");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      const filter = btn.getAttribute("data-filter");
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
      }
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById("proj-detail-modal");
  const closeBtn = document.getElementById("proj-detail-close");
  const detailButtons = document.querySelectorAll(".view-detail-btn");

  if (!modal) return;

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = parseInt(btn.getAttribute("data-detail-id"), 10);
      const proj = currentData.projects.find(p => p.id === pid);
      if (!proj) return;

      document.getElementById("modal-proj-cat").textContent = formatCategoryLabel(proj.category);
      document.getElementById("modal-proj-title").textContent = proj.title;
      document.getElementById("modal-proj-desc").textContent = proj.desc;

      const techBox = document.getElementById("modal-proj-tech");
      if (techBox && proj.tech) {
        const techs = proj.tech.split(",").map(t => t.trim()).filter(Boolean);
        techBox.innerHTML = techs.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join("");
      }

      modal.classList.add("open");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
}

/* ============================================================
   9. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btt = document.getElementById("back-to-top");
  if (!btt) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btt.classList.add("show");
    } else {
      btt.classList.remove("show");
    }
  }, { passive: true });

  btt.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function initCopyrightYear() {
  const yr = document.getElementById("current-year");
  if (yr) yr.textContent = new Date().getFullYear();
}

/* ============================================================
   10. INTEGRATED ADMIN CMS PANEL LOGIC
   ============================================================ */
function initAdminCMS() {
  const trigger = document.getElementById("admin-trigger");
  const overlay = document.getElementById("admin-overlay");
  const pwdModal = document.getElementById("admin-pwd-modal");
  const pwdForm = document.getElementById("admin-login-form");
  const pwdInput = document.getElementById("admin-pwd-input");
  const pwdError = document.getElementById("admin-pwd-error");
  const pwdCancel = document.getElementById("admin-pwd-cancel");
  const drawer = document.getElementById("admin-drawer");
  const drawerClose = document.getElementById("admin-drawer-close");
  const saveBtn = document.getElementById("adm-btn-save");
  const resetBtn = document.getElementById("adm-btn-reset");

  // Status login dalam sesi
  let isAuthenticated = sessionStorage.getItem("nexa_admin_auth") === "true";

  // Trigger click
  if (trigger) {
    trigger.addEventListener("click", () => {
      if (isAuthenticated) {
        openAdminDrawer();
      } else {
        openPwdModal();
      }
    });
  }

  // Password Modal Controls
  function openPwdModal() {
    pwdModal.classList.add("open");
    overlay.classList.add("open");
    pwdInput.value = "";
    pwdError.style.display = "none";
    setTimeout(() => pwdInput.focus(), 150);
  }

  function closePwdModal() {
    pwdModal.classList.remove("open");
    if (!drawer.classList.contains("open")) {
      overlay.classList.remove("open");
    }
  }

  if (pwdCancel) pwdCancel.addEventListener("click", closePwdModal);

  // Submit Password
  if (pwdForm) {
    pwdForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = pwdInput.value.trim();
      if (entered === ADMIN_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem("nexa_admin_auth", "true");
        closePwdModal();
        openAdminDrawer();
      } else {
        pwdError.style.display = "block";
        pwdInput.focus();
      }
    });
  }

  // Drawer Controls
  function openAdminDrawer() {
    populateAdminForms();
    drawer.classList.add("open");
    overlay.classList.add("open");
  }

  function closeAdminDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  if (drawerClose) drawerClose.addEventListener("click", closeAdminDrawer);
  if (overlay) {
    overlay.addEventListener("click", () => {
      closePwdModal();
      closeAdminDrawer();
    });
  }

  // Admin Tabs
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add("active");
    });
  });

  // Populate Forms
  function populateAdminForms() {
    // Identity
    setValueSafe("adm-brand-name", currentData.brandName);
    setValueSafe("adm-headline-1", currentData.identity.headline1);
    setValueSafe("adm-headline-2", currentData.identity.headline2);
    setValueSafe("adm-hero-desc", currentData.identity.heroDesc);
    setValueSafe("adm-hero-status", currentData.identity.heroStatus);
    setValueSafe("adm-hero-location", currentData.identity.heroLocation);

    // About
    setValueSafe("adm-about-name", currentData.about.name);
    setValueSafe("adm-about-title", currentData.about.title);
    setValueSafe("adm-about-greeting", currentData.about.greeting);
    setValueSafe("adm-about-p1", currentData.about.p1);
    setValueSafe("adm-about-p2", currentData.about.p2);
    setValueSafe("adm-about-tags", currentData.about.tags);

    // Projects
    if (Array.isArray(currentData.projects)) {
      currentData.projects.forEach(p => {
        setValueQuery(`.adm-p-title[data-p="${p.id}"]`, p.title);
        setValueQuery(`.adm-p-cat[data-p="${p.id}"]`, p.category);
        setValueQuery(`.adm-p-desc[data-p="${p.id}"]`, p.desc);
        setValueQuery(`.adm-p-tech[data-p="${p.id}"]`, p.tech);
      });
    }

    // Contact
    setValueSafe("adm-contact-email", currentData.contact.email);
    setValueSafe("adm-contact-instagram", currentData.contact.instagram);
    setValueSafe("adm-contact-linkedin", currentData.contact.linkedin);
    setValueSafe("adm-contact-github", currentData.contact.github);

    // Photo Preview
    const previewWrapper = document.getElementById("profile-preview-wrapper");
    const previewImg = document.getElementById("profile-preview-img");
    if (currentData.photos && currentData.photos.profile) {
      previewImg.src = currentData.photos.profile;
      previewWrapper.style.display = "flex";
    } else {
      previewWrapper.style.display = "none";
    }
  }

  function setValueSafe(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  }

  function setValueQuery(selector, val) {
    const el = document.querySelector(selector);
    if (el && val !== undefined) el.value = val;
  }

  // Handle Photo Upload (Profile)
  const profileUpload = document.getElementById("adm-upload-profile");
  if (profileUpload) {
    profileUpload.addEventListener("change", function() {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        currentData.photos.profile = e.target.result;
        const previewImg = document.getElementById("profile-preview-img");
        const previewWrapper = document.getElementById("profile-preview-wrapper");
        previewImg.src = e.target.result;
        previewWrapper.style.display = "flex";
        applyDataToDOM();
        saveDataToStorage();
      };
      reader.readAsDataURL(file);
    });
  }

  // Reset Profile Photo
  const resetPhotoBtn = document.getElementById("adm-reset-profile-photo");
  if (resetPhotoBtn) {
    resetPhotoBtn.addEventListener("click", () => {
      currentData.photos.profile = "";
      document.getElementById("profile-preview-wrapper").style.display = "none";
      const heroImg = document.getElementById("hero-profile-img");
      const aboutImg = document.getElementById("about-profile-img");
      if (heroImg) heroImg.src = "assets/images/profile.jpg";
      if (aboutImg) aboutImg.src = "assets/images/profile.jpg";
      saveDataToStorage();
    });
  }

  // Handle Project Photos Upload
  document.querySelectorAll(".adm-upload-proj").forEach(input => {
    input.addEventListener("change", function() {
      const pnum = parseInt(this.getAttribute("data-proj"), 10);
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        if (!currentData.photos.projects) currentData.photos.projects = {};
        currentData.photos.projects[pnum] = e.target.result;
        applyDataToDOM();
        saveDataToStorage();
      };
      reader.readAsDataURL(file);
    });
  });

  // Save Button
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      // Collect Identity
      currentData.brandName = document.getElementById("adm-brand-name").value.trim() || "NEXA";
      currentData.identity.headline1 = document.getElementById("adm-headline-1").value;
      currentData.identity.headline2 = document.getElementById("adm-headline-2").value;
      currentData.identity.heroDesc = document.getElementById("adm-hero-desc").value;
      currentData.identity.heroStatus = document.getElementById("adm-hero-status").value;
      currentData.identity.heroLocation = document.getElementById("adm-hero-location").value;

      // Collect About
      currentData.about.name = document.getElementById("adm-about-name").value;
      currentData.about.title = document.getElementById("adm-about-title").value;
      currentData.about.greeting = document.getElementById("adm-about-greeting").value;
      currentData.about.p1 = document.getElementById("adm-about-p1").value;
      currentData.about.p2 = document.getElementById("adm-about-p2").value;
      currentData.about.tags = document.getElementById("adm-about-tags").value;

      // Collect Projects
      currentData.projects.forEach(p => {
        const titleInput = document.querySelector(`.adm-p-title[data-p="${p.id}"]`);
        const catInput = document.querySelector(`.adm-p-cat[data-p="${p.id}"]`);
        const descInput = document.querySelector(`.adm-p-desc[data-p="${p.id}"]`);
        const techInput = document.querySelector(`.adm-p-tech[data-p="${p.id}"]`);

        if (titleInput) p.title = titleInput.value;
        if (catInput) p.category = catInput.value;
        if (descInput) p.desc = descInput.value;
        if (techInput) p.tech = techInput.value;
      });

      // Collect Contact
      currentData.contact.email = document.getElementById("adm-contact-email").value;
      currentData.contact.instagram = document.getElementById("adm-contact-instagram").value;
      currentData.contact.linkedin = document.getElementById("adm-contact-linkedin").value;
      currentData.contact.github = document.getElementById("adm-contact-github").value;

      // Apply to UI & Save
      applyDataToDOM();
      saveDataToStorage();
    });
  }

  // Reset Default Button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengembalikan semua teks dan foto ke pengaturan bawaan awal?")) {
        localStorage.removeItem(STORAGE_KEY);
        currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        applyDataToDOM();
        populateAdminForms();
        showAdminToast("Pengaturan berhasil direset ke default!");
      }
    });
  }
}

function showAdminToast(msg) {
  const toast = document.getElementById("admin-toast");
  const toastText = document.getElementById("admin-toast-text");
  if (!toast) return;

  if (toastText) toastText.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
