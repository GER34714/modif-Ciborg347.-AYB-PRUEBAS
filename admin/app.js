/* =========================
   STATE
========================= */
let currentView = "dashboard";
let currentUserEmail = "";
let currentSafetyMode = "safe";

let categoriesData = [];
let projectsData = [];
let faqsData = [];
let siteContentData = [];
let tagsData = [];
let projectTagMap = new Map();
let siteSettingsData = null;
let projectHistoryData = [];
let settingsHistoryData = [];

let editingProjectId = null;
let editingCategoryId = null;
let editingFaqId = null;

// Paginadores
let projectsPaginator = null;
let projectHistoryPaginator = null;
let settingsHistoryPaginator = null;
let plansPaginator = null;
let approvedReviewsPaginator = null;

// Variables para reseñas
let reviewsData = [];
let approvedReviewsData = [];
let currentEditReviewId = null;
let notificationCheckInterval = null;
let lastPendingCount = 0;

// Variables para planes
let plansData = [];
let editingPlanId = null;

// Elementos DOM (declarados ANTES de usarlos)
const navBtns = document.querySelectorAll(".navBtn");
const viewPanels = document.querySelectorAll(".viewPanel");

/* =========================
   HELPERS
========================= */
function setAuthMsg(msg = "") { authMsg.textContent = msg; }
function setProjectsMsg(msg = "") { projectsMsg.textContent = msg; }
function setProjectFormMsg(msg = "") { projectFormMsg.textContent = msg; }
function setProjectUploadMsg(msg = "", type = "") {
  projectUploadMsg.textContent = msg;
  projectUploadMsg.classList.remove("msg--success", "msg--error");
  if (type) projectUploadMsg.classList.add(type === "success" ? "msg--success" : "msg--error");
}
function setCategoriesMsg(msg = "") { categoriesMsg.textContent = msg; }
function setFaqsMsg(msg = "") { faqsMsg.textContent = msg; }
function setSiteContentMsg(msg = "") { siteContentMsg.textContent = msg; }
function setSiteSettingsMsg(msg = "") { siteSettingsMsg.textContent = msg; }

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function boolText(v) { return v ? "Sí" : "No"; }

function formatDate(date) {
  try {
    return new Date(date).toLocaleString("es-AR");
  } catch {
    return date || "";
  }
}

function switchView(view) {
  currentView = view;
  navBtns.forEach(btn => btn.classList.toggle("is-active", btn.dataset.view === view));
  viewPanels.forEach(panel => { panel.style.display = panel.dataset.panel === view ? "" : "none"; });
}

function fillCategorySelects() {
  const activeCats = categoriesData.slice().sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  const opts = [`<option value="">Elegir...</option>`]
    .concat(activeCats.map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`))
    .join("");
  projectCategorySelect.innerHTML = opts;

  const filterOpts = [`<option value="__all__">📁 Todas</option>`]
    .concat(activeCats.map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`))
    .join("");
  projectCategoryFilter.innerHTML = filterOpts;
}

function fillTagFilter() {
  const filterOpts = [`<option value="__all__">🏷️ Todos</option>`]
    .concat(tagsData.filter(t => t.active).map(tag => `<option value="${tag.id}">${escapeHtml(tag.name)}</option>`))
    .join("");
  projectTagFilter.innerHTML = filterOpts;
}

function fillSiteContentSelect() {
  const opts = [`<option value="">Elegir bloque...</option>`]
    .concat(
      siteContentData
        .slice()
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map(item => `<option value="${item.id}">${escapeHtml(item.key)}</option>`)
    )
    .join("");
  siteContentSelect.innerHTML = opts;
}

function findCategoryName(categoryId) {
  return categoriesData.find(c => String(c.id) === String(categoryId))?.name || "Sin categoría";
}

function getProjectTags(projectId) {
  const ids = projectTagMap.get(String(projectId)) || [];
  return tagsData.filter(tag => ids.includes(String(tag.id)));
}

function renderTagPreview() {
  const raw = parseTagInput(projectTagsInput.value);
  if (!raw.length) {
    projectTagsPreview.innerHTML = "";
    return;
  }
  projectTagsPreview.innerHTML = raw.map(tag => `<span class="miniTag">🏷️ ${escapeHtml(tag)}</span>`).join("");
}

function parseTagInput(value) {
  return Array.from(new Set(
    String(value || "")
      .split(",")
      .map(v => v.trim())
      .filter(Boolean)
  ));
}

function isSensitiveAction(type) {
  return ["delete", "restore", "settings-reset", "bulk", "status-archive"].includes(type);
}

function isMinimalProtectedAction(type) {
  return ["delete", "restore", "settings-reset"].includes(type);
}

async function confirmAction({ message, type = "generic", double = false }) {
  if (currentSafetyMode === "safe") {
    const ok = window.confirm(message);
    if (!ok) return false;
    if (double || isSensitiveAction(type)) {
      return window.confirm("⚠️ Confirmación final: esta acción puede afectar contenido importante. ¿Continuar?");
    }
    return true;
  }

  if (currentSafetyMode === "fast" && isMinimalProtectedAction(type)) {
    return window.confirm(`${message}\n\n⚡ Esta acción mantiene protección mínima obligatoria.`);
  }

  return true;
}

function setModeButtons() {
  safeModeBtn.classList.toggle("is-active", currentSafetyMode === "safe");
  fastModeBtn.classList.toggle("is-active", currentSafetyMode === "fast");
}

function mapStatusLabel(status) {
  const map = {
    draft: "📝 Borrador",
    published: "✅ Publicado",
    featured: "⭐ Destacado",
    archived: "📦 Archivado",
    new: "🆕 Nuevo",
  };
  return map[status] || status;
}

function deriveLegacyFlagsFromStatus(status) {
  return {
    active: status !== "archived",
    highlight: status === "featured",
  };
}

function safeUrl(value) {
  const v = String(value || "").trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function getCurrentUserEmail() {
  const { data } = await sb.auth.getUser();
  return data?.user?.email || "";
}

function buildStorageFilePath(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const titleSlug = slugify(projectTitleInput.value || "proyecto");
  const stamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `projects/${titleSlug || "proyecto"}-${stamp}-${random}.${ext || "jpg"}`;
}

function showLoading(elementId, show = true) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  if (show && element.children.length === 0) {
    element.innerHTML = '<div class="loading-skeleton"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';
  } else if (!show && element.querySelector(".loading-skeleton")) {
    element.innerHTML = "";
  }
}

/* =========================
   PAGINATOR CLASS
========================= */
class Paginator {
  constructor({
    items = [],
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange = null,
    containerId = null,
  }) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.onPageChange = onPageChange;
    this.containerId = containerId;
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.items.slice(start, start + this.itemsPerPage);
  }

  setPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.onPageChange) this.onPageChange(this.paginatedItems, this.currentPage);
    this.renderControls();
  }

  setItemsPerPage(perPage) {
    this.itemsPerPage = perPage;
    this.currentPage = 1;
    if (this.onPageChange) this.onPageChange(this.paginatedItems, this.currentPage);
    this.renderControls();
  }

  updateItems(newItems) {
    this.items = newItems;
    if (this.currentPage > this.totalPages) this.currentPage = Math.max(1, this.totalPages);
    if (this.onPageChange) this.onPageChange(this.paginatedItems, this.currentPage);
    this.renderControls();
  }

  renderControls() {
    const container = this.containerId ? document.getElementById(this.containerId) : null;
    if (!container) return;

    if (this.totalPages <= 1) {
      container.style.display = "none";
      return;
    }

    container.style.display = "flex";
    
    let html = `
      <button class="pagination__first" ${this.currentPage === 1 ? "disabled" : ""} data-tooltip="Primera página">«</button>
      <button class="pagination__prev" ${this.currentPage === 1 ? "disabled" : ""} data-tooltip="Página anterior">‹</button>
    `;

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);
    if (endPage - startPage < 4 && startPage > 1) startPage = Math.max(1, endPage - 4);

    if (startPage > 1) html += `<button class="pagination__page" data-page="1">1</button>${startPage > 2 ? '<span>...</span>' : ''}`;
    
    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="pagination__page ${i === this.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < this.totalPages) html += `${endPage < this.totalPages - 1 ? '<span>...</span>' : ''}<button class="pagination__page" data-page="${this.totalPages}">${this.totalPages}</button>`;
    
    html += `
      <button class="pagination__next" ${this.currentPage === this.totalPages ? "disabled" : ""} data-tooltip="Página siguiente">›</button>
      <button class="pagination__last" ${this.currentPage === this.totalPages ? "disabled" : ""} data-tooltip="Última página">»</button>
      <span class="pagination__info">📊 ${this.items.length} items · Pág ${this.currentPage} de ${this.totalPages}</span>
      <select class="per-page-select">
        <option value="5" ${this.itemsPerPage === 5 ? "selected" : ""}>5 por página</option>
        <option value="10" ${this.itemsPerPage === 10 ? "selected" : ""}>10 por página</option>
        <option value="20" ${this.itemsPerPage === 20 ? "selected" : ""}>20 por página</option>
        <option value="50" ${this.itemsPerPage === 50 ? "selected" : ""}>50 por página</option>
      </select>
    `;

    container.innerHTML = html;

    container.querySelector(".pagination__first")?.addEventListener("click", () => this.setPage(1));
    container.querySelector(".pagination__prev")?.addEventListener("click", () => this.setPage(this.currentPage - 1));
    container.querySelector(".pagination__next")?.addEventListener("click", () => this.setPage(this.currentPage + 1));
    container.querySelector(".pagination__last")?.addEventListener("click", () => this.setPage(this.totalPages));
    container.querySelectorAll(".pagination__page").forEach(btn => {
      btn.addEventListener("click", () => this.setPage(parseInt(btn.dataset.page)));
    });
    container.querySelector(".per-page-select")?.addEventListener("change", (e) => {
      this.setItemsPerPage(parseInt(e.target.value));
    });
  }
}

/* =========================
   AUTH
========================= */
async function whitelistCheck() {
  const email = await getCurrentUserEmail();
  if (!email) return { ok: false, reason: "No hay sesión activa." };

  const { data: row, error } = await sb
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) return { ok: false, reason: "No se pudo verificar admin_users." };
  if (!row?.email) return { ok: false, reason: "Tu email no está autorizado en admin_users." };
  return { ok: true, email };
}

async function loadAdminPreferences() {
  if (!currentUserEmail) return;
  const { data, error } = await sb
    .from("admin_preferences")
    .select("*")
    .eq("user_email", currentUserEmail)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (!data) {
    const { error: insertError } = await sb.from("admin_preferences").insert([{
      user_email: currentUserEmail,
      safety_mode: "safe",
      updated_at: new Date().toISOString(),
    }]);
    if (!insertError) {
      currentSafetyMode = "safe";
      setModeButtons();
    }
    return;
  }

  currentSafetyMode = data.safety_mode || "safe";
  setModeButtons();
}

async function updateAdminSafetyMode(mode) {
  currentSafetyMode = mode;
  setModeButtons();
  if (!currentUserEmail) return;

  const { error } = await sb
    .from("admin_preferences")
    .upsert({
      user_email: currentUserEmail,
      safety_mode: mode,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_email" });

  if (error) console.error(error);
}

async function guardAdmin() {
  const { data } = await sb.auth.getSession();
  const session = data?.session;

  if (!session) {
    authBox.style.display = "";
    adminBox.style.display = "none";
    userEmail.textContent = "";
    currentUserEmail = "";
    return;
  }

  const check = await whitelistCheck();
  if (!check.ok) {
    setAuthMsg(check.reason);
    await sb.auth.signOut();
    authBox.style.display = "";
    adminBox.style.display = "none";
    userEmail.textContent = "";
    return;
  }

  currentUserEmail = check.email;
  userEmail.textContent = check.email;
  authBox.style.display = "none";
  adminBox.style.display = "";
  setAuthMsg("");

  await loadAdminPreferences();
  await loadAll();
}

loginBtn.addEventListener("click", async () => {
  setAuthMsg("Ingresando...");
  const email = (emailInput.value || "").trim();
  const password = passInput.value || "";
  if (!email || !password) return setAuthMsg("Completá email y password.");

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return setAuthMsg(`No autenticado: ${error.message}`);
  await guardAdmin();
});

logoutBtn.addEventListener("click", async () => {
  await sb.auth.signOut();
  await guardAdmin();
});

sb.auth.onAuthStateChange(() => { guardAdmin(); });

safeModeBtn.addEventListener("click", () => updateAdminSafetyMode("safe"));
fastModeBtn.addEventListener("click", () => updateAdminSafetyMode("fast"));

/* =========================
   LOADERS
========================= */
async function loadCategories() {
  const { data, error } = await sb.from("categories").select("*").order("order_index", { ascending: true });
  if (error) return setCategoriesMsg(`No se pudieron cargar categorías: ${error.message}`);
  categoriesData = data || [];
  fillCategorySelects();
  renderCategoriesList();
}

async function loadTags() {
  const { data, error } = await sb.from("tags").select("*").order("name", { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  tagsData = data || [];
  fillTagFilter();
}

async function loadProjects() {
  showLoading("projectsList", true);
  
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    setProjectsMsg(`No se pudieron cargar proyectos: ${error.message}`);
    showLoading("projectsList", false);
    return;
  }
  
  projectsData = data || [];
  await loadProjectTags();
  updateDashboardStats();
  renderDashboardRecent();
  renderProjectsList();
  showLoading("projectsList", false);
}

async function loadProjectTags() {
  if (!projectsData.length) {
    projectTagMap = new Map();
    return;
  }

  const projectIds = projectsData.map(p => p.id);
  const { data, error } = await sb
    .from("project_tags")
    .select("project_id, tag_id")
    .in("project_id", projectIds);

  if (error) {
    console.error(error);
    projectTagMap = new Map();
    return;
  }

  const map = new Map();
  (data || []).forEach(row => {
    const key = String(row.project_id);
    const list = map.get(key) || [];
    list.push(String(row.tag_id));
    map.set(key, list);
  });
  projectTagMap = map;
}

async function loadFaqs() {
  const { data, error } = await sb.from("faqs").select("*").order("order_index", { ascending: true });
  if (error) return setFaqsMsg(`No se pudieron cargar FAQs: ${error.message}`);
  faqsData = data || [];
  renderFaqsList();
}

async function loadSiteContent() {
  const { data, error } = await sb.from("site_content").select("*").order("order_index", { ascending: true });
  if (error) return setSiteContentMsg(`No se pudo cargar site_content: ${error.message}`);
  siteContentData = data || [];
  fillSiteContentSelect();
}

async function loadSiteSettings() {
  const { data, error } = await sb.from("site_settings").select("*").eq("id", "global").maybeSingle();
  if (error) return setSiteSettingsMsg(`No se pudo cargar site_settings: ${error.message}`);
  siteSettingsData = data || { id: "global" };
  fillSiteSettingsForm();
}

async function loadHistory() {
  const [projectsRes, settingsRes] = await Promise.all([
    sb.from("project_history").select("*").order("created_at", { ascending: false }),
    sb.from("site_settings_history").select("*").order("created_at", { ascending: false }),
  ]);

  if (!projectsRes.error) projectHistoryData = projectsRes.data || [];
  if (!settingsRes.error) settingsHistoryData = settingsRes.data || [];

  renderProjectHistory();
  renderSettingsHistory();
}

async function loadAll() {
  await Promise.all([
    loadCategories(),
    loadTags(),
    loadProjects(),
    loadFaqs(),
    loadSiteContent(),
    loadSiteSettings(),
    loadHistory(),
  ]);
  if (document.getElementById("plansList")) await loadPlansAdmin();
}

/* =========================
   RENDER (con paginación)
========================= */
function updateDashboardStats() {
  statProjects.textContent = String(projectsData.length);
  statActive.textContent = String(projectsData.filter(p => p.status === "published").length);
  statHighlight.textContent = String(projectsData.filter(p => p.status === "featured" || p.highlight).length);
  statHome.textContent = String(projectsData.filter(p => p.featured_home).length);
  statPortfolio.textContent = String(projectsData.filter(p => p.featured_portfolio).length);
  statCategories.textContent = String(categoriesData.filter(c => c.active).length);
}

function renderProjectBadges(project) {
  const tags = getProjectTags(project.id);
  const parts = [`<span class="statusBadge statusBadge--${escapeHtml(project.status || "published")}">${mapStatusLabel(project.status || "published")}</span>`];
  tags.slice(0, 3).forEach(tag => {
    parts.push(`<span class="miniTag">🏷️ ${escapeHtml(tag.name)}</span>`);
  });
  return parts.join("");
}

function renderDashboardRecent() {
  const list = projectsData.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);
  if (!list.length) {
    dashboardRecentList.innerHTML = `<div class="emptyState">🚀 Todavía no hay proyectos cargados.</div>`;
    return;
  }

  dashboardRecentList.innerHTML = list.map(project => `
    <article class="listCard">
      <div class="listCard__thumb"><img src="${escapeHtml(project.image_url || "")}" alt="${escapeHtml(project.title)}" loading="lazy" /></div>
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(project.title)}</div>
        <div class="listCard__meta">📁 ${escapeHtml(findCategoryName(project.category_id))} · 🔧 ${escapeHtml(project.solution_type || "")}</div>
        <div class="listCard__badges">${renderProjectBadges(project)}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-project="${project.id}" data-tooltip="Editar proyecto">✏️ Editar</button>
      </div>
    </article>
  `).join("");

  dashboardRecentList.querySelectorAll("[data-edit-project]").forEach(btn => {
    btn.addEventListener("click", () => openProjectForEdit(btn.getAttribute("data-edit-project")));
  });
}

function renderProjectsList() {
  const q = (projectSearchInput.value || "").trim().toLowerCase();
  const cat = projectCategoryFilter.value;
  const type = projectTypeFilter.value;
  const status = projectStatusFilter.value;
  const tag = projectTagFilter.value;

  let list = projectsData.slice();

  if (q) {
    list = list.filter(project => {
      const hay = `${project.title} ${project.short_description} ${project.full_description || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (cat !== "__all__") list = list.filter(project => String(project.category_id) === String(cat));
  if (type !== "__all__") list = list.filter(project => project.solution_type === type);
  if (status !== "__all__") list = list.filter(project => (project.status || "published") === status);
  if (tag !== "__all__") list = list.filter(project => {
    const tagIds = projectTagMap.get(String(project.id)) || [];
    return tagIds.includes(String(tag));
  });

  list.sort((a, b) => {
    const ai = a.order_index ?? 0;
    const bi = b.order_index ?? 0;
    if (ai !== bi) return ai - bi;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!projectsPaginator) {
    projectsPaginator = new Paginator({
      items: list,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: (paginatedItems) => {
        renderProjectsListPage(paginatedItems);
      },
      containerId: "projectsPagination",
    });
  } else {
    projectsPaginator.updateItems(list);
  }
  
  projectsPaginator.setPage(1);
}

function renderProjectsListPage(projects) {
  if (!projects.length) {
    projectsList.innerHTML = `<div class="emptyState">🔍 No hay proyectos para mostrar con esos filtros.</div>`;
    return;
  }

  projectsList.innerHTML = projects.map(project => `
    <article class="listCard" data-tooltip="📅 Última modificación: ${formatDate(project.updated_at)}">
      <div class="listCard__thumb">
        <img src="${escapeHtml(project.image_url || "")}" alt="${escapeHtml(project.title)}" loading="lazy" />
      </div>
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(project.title)}</div>
        <div class="listCard__meta">📁 ${escapeHtml(findCategoryName(project.category_id))} · 🔧 ${escapeHtml(project.solution_type || "")}</div>
        <div class="listCard__meta">🔢 Orden: ${project.order_index ?? 0} · 📅 ${formatDate(project.created_at)}</div>
        <div class="listCard__badges">${renderProjectBadges(project)}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" data-edit-project="${project.id}" data-tooltip="Editar proyecto">✏️</button>
        <button class="btn btn--ghost btn--small" data-duplicate-project="${project.id}" data-tooltip="Duplicar proyecto">📋</button>
        <button class="btn btn--ghost btn--small" data-toggle-project="${project.id}" data-tooltip="${project.active ? 'Desactivar' : 'Activar'}">${project.active ? "🔴" : "🟢"}</button>
        <button class="btn btn--danger btn--small" data-delete-project="${project.id}" data-tooltip="Archivar proyecto">🗑️</button>
      </div>
    </article>
  `).join("");

  projectsList.querySelectorAll("[data-edit-project]").forEach(btn => {
    btn.addEventListener("click", () => openProjectForEdit(btn.getAttribute("data-edit-project")));
  });
  projectsList.querySelectorAll("[data-duplicate-project]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const project = projectsData.find(p => String(p.id) === String(btn.getAttribute("data-duplicate-project")));
      if (project) await duplicateProject(project);
    });
  });
  projectsList.querySelectorAll("[data-toggle-project]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const project = projectsData.find(p => String(p.id) === String(btn.getAttribute("data-toggle-project")));
      if (project) await toggleProjectActive(project);
    });
  });
  projectsList.querySelectorAll("[data-delete-project]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const project = projectsData.find(p => String(p.id) === String(btn.getAttribute("data-delete-project")));
      if (project) await deleteProject(project);
    });
  });
}

function resetProjectForm() {
  editingProjectId = null;
  projectFormTitle.textContent = "✨ Nueva web";
  projectSaveBtn.textContent = "Publicar";
  projectDeleteBtn.style.display = "none";
  projectDuplicateBtn.style.display = "none";

  projectImageUrlInput.value = "";
  if (projectImageFileInput) projectImageFileInput.value = "";
  projectPreviewImg.removeAttribute("src");
  projectTitleInput.value = "";
  projectDemoUrlInput.value = "";
  projectCategorySelect.value = "";
  projectTypeSelect.value = "";
  projectStatusSelect.value = "published";
  projectTagsInput.value = "";
  projectShortDescInput.value = "";
  projectFullDescInput.value = "";
  projectPreviewTypeSelect.value = "image";
  projectOrderInput.value = "0";
  projectActiveInput.checked = true;
  projectHighlightInput.checked = false;
  projectFeaturedHomeInput.checked = false;
  projectFeaturedPortfolioInput.checked = false;
  projectAdvancedBox.style.display = "none";
  projectAdvancedToggleBtn.textContent = "🔧 Abrir ajustes avanzados";
  renderTagPreview();
  setProjectFormMsg("");
  if (projectUploadMsg) setProjectUploadMsg("");
}

function fillProjectForm(project) {
  editingProjectId = project.id;
  projectFormTitle.textContent = "✏️ Editar web";
  projectSaveBtn.textContent = "Guardar cambios";
  projectDeleteBtn.style.display = "";
  projectDuplicateBtn.style.display = "";

  projectImageUrlInput.value = project.image_url || "";
  if (project.image_url) projectPreviewImg.src = project.image_url;
  projectTitleInput.value = project.title || "";
  projectDemoUrlInput.value = project.demo_url || "";
  projectCategorySelect.value = project.category_id || "";
  projectTypeSelect.value = project.solution_type || "";
  projectStatusSelect.value = project.status || "published";
  projectTagsInput.value = getProjectTags(project.id).map(t => t.name).join(", ");
  projectShortDescInput.value = project.short_description || "";
  projectFullDescInput.value = project.full_description || "";
  projectPreviewTypeSelect.value = project.preview_type || "image";
  projectOrderInput.value = String(project.order_index ?? 0);
  projectActiveInput.checked = !!project.active;
  projectHighlightInput.checked = !!project.highlight;
  projectFeaturedHomeInput.checked = !!project.featured_home;
  projectFeaturedPortfolioInput.checked = !!project.featured_portfolio;
  renderTagPreview();
  setProjectFormMsg("");
  if (projectUploadMsg) setProjectUploadMsg("");
}

function openProjectForEdit(id) {
  const project = projectsData.find(p => String(p.id) === String(id));
  if (!project) return;
  fillProjectForm(project);
  switchView("new-project");
}

function renderCategoriesList() {
  const list = categoriesData.slice().sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  if (!list.length) {
    categoriesList.innerHTML = `<div class="emptyState">📂 No hay categorías cargadas.</div>`;
    return;
  }

  categoriesList.innerHTML = list.map(cat => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">📁 ${escapeHtml(cat.name)}</div>
        <div class="listCard__meta">🔗 Slug: ${escapeHtml(cat.slug)}</div>
        <div class="listCard__meta">${cat.active ? "🟢 Activa" : "🔴 Inactiva"} · 🔢 Orden: ${cat.order_index ?? 0}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-category="${cat.id}" data-tooltip="Editar categoría">✏️</button>
        <button class="btn btn--ghost btn--small" type="button" data-toggle-category="${cat.id}" data-tooltip="${cat.active ? 'Desactivar' : 'Activar'}">${cat.active ? "🔴" : "🟢"}</button>
      </div>
    </article>
  `).join("");

  categoriesList.querySelectorAll("[data-edit-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = categoriesData.find(c => String(c.id) === String(btn.getAttribute("data-edit-category")));
      if (!cat) return;
      editingCategoryId = cat.id;
      categoryNameInput.value = cat.name || "";
      categorySlugInput.value = cat.slug || "";
      categoryOrderInput.value = String(cat.order_index ?? 0);
      categoryActiveInput.checked = !!cat.active;
      setCategoriesMsg("");
    });
  });

  categoriesList.querySelectorAll("[data-toggle-category]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const cat = categoriesData.find(c => String(c.id) === String(btn.getAttribute("data-toggle-category")));
      if (!cat) return;
      const ok = await confirmAction({ message: `¿Actualizar categoría "${cat.name}"?`, type: "generic" });
      if (!ok) return;

      const { error } = await sb.from("categories").update({
        active: !cat.active,
        updated_at: new Date().toISOString(),
      }).eq("id", cat.id);

      if (error) return setCategoriesMsg(`No se pudo actualizar la categoría: ${error.message}`);
      setCategoriesMsg("✅ Categoría actualizada.");
      await loadCategories();
      await loadProjects();
    });
  });
}

function resetCategoryForm() {
  editingCategoryId = null;
  categoryNameInput.value = "";
  categorySlugInput.value = "";
  categoryOrderInput.value = "0";
  categoryActiveInput.checked = true;
  setCategoriesMsg("");
}

function renderFaqsList() {
  const list = faqsData.slice().sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  if (!list.length) {
    faqsList.innerHTML = `<div class="emptyState">❓ No hay FAQs cargadas.</div>`;
    return;
  }

  faqsList.innerHTML = list.map(faq => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">❓ ${escapeHtml(faq.question)}</div>
        <div class="listCard__meta">💬 ${escapeHtml(faq.answer.substring(0, 100))}${faq.answer.length > 100 ? "..." : ""}</div>
        <div class="listCard__meta">${faq.active ? "🟢 Activa" : "🔴 Inactiva"} · 🔢 Orden: ${faq.order_index ?? 0}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-faq="${faq.id}" data-tooltip="Editar FAQ">✏️</button>
        <button class="btn btn--ghost btn--small" type="button" data-toggle-faq="${faq.id}" data-tooltip="${faq.active ? 'Desactivar' : 'Activar'}">${faq.active ? "🔴" : "🟢"}</button>
      </div>
    </article>
  `).join("");

  faqsList.querySelectorAll("[data-edit-faq]").forEach(btn => {
    btn.addEventListener("click", () => {
      const faq = faqsData.find(f => String(f.id) === String(btn.getAttribute("data-edit-faq")));
      if (!faq) return;
      editingFaqId = faq.id;
      faqQuestionInput.value = faq.question || "";
      faqAnswerInput.value = faq.answer || "";
      faqOrderInput.value = String(faq.order_index ?? 0);
      faqActiveInput.checked = !!faq.active;
      setFaqsMsg("");
    });
  });

  faqsList.querySelectorAll("[data-toggle-faq]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const faq = faqsData.find(f => String(f.id) === String(btn.getAttribute("data-toggle-faq")));
      if (!faq) return;
      const ok = await confirmAction({ message: `¿Actualizar FAQ?`, type: "generic" });
      if (!ok) return;

      const { error } = await sb.from("faqs").update({
        active: !faq.active,
        updated_at: new Date().toISOString(),
      }).eq("id", faq.id);

      if (error) return setFaqsMsg(`No se pudo actualizar la FAQ: ${error.message}`);
      setFaqsMsg("✅ FAQ actualizada.");
      await loadFaqs();
    });
  });
}

function resetFaqForm() {
  editingFaqId = null;
  faqQuestionInput.value = "";
  faqAnswerInput.value = "";
  faqOrderInput.value = "0";
  faqActiveInput.checked = true;
  setFaqsMsg("");
}

function fillSiteContentFormById(id) {
  const item = siteContentData.find(x => String(x.id) === String(id));
  if (!item) return;

  siteContentTitleInput.value = item.title || "";
  siteContentSubtitleInput.value = item.subtitle || "";
  siteContentBodyInput.value = item.content || "";
  siteContentImageUrlInput.value = item.image_url || "";
  siteContentCtaLabelInput.value = item.cta_label || "";
  siteContentCtaUrlInput.value = item.cta_url || "";
  siteContentOrderInput.value = String(item.order_index ?? 0);
  siteContentActiveInput.checked = !!item.active;
  setSiteContentMsg("");
}

function fillSiteSettingsForm() {
  const s = siteSettingsData || {};
  siteTitleInput.value = s.site_title || "";
  siteTaglineInput.value = s.site_tagline || "";
  heroBadgeInput.value = s.hero_badge || "";
  heroTitleInput.value = s.hero_title || "";
  heroSubtitleInput.value = s.hero_subtitle || "";
  heroCtaLabelInput.value = s.hero_cta_label || "";
  heroCtaUrlInput.value = s.hero_cta_url || "";
  logoUrlInput.value = s.logo_url || "";
  heroLogoUrlInput.value = s.hero_logo_url || "";
  footerLogoUrlInput.value = s.footer_logo_url || "";
  faviconUrlInput.value = s.favicon_url || "";
  backgroundImageUrlInput.value = s.background_image_url || "";
  heroImageUrlInput.value = s.hero_image_url || "";
  heroOverlayUrlInput.value = s.hero_overlay_url || "";
  heroVideoUrlInput.value = s.hero_video_url || "";
  whatsappNumberInput.value = s.whatsapp_number || "";
  emailContactInput.value = s.email_contact || "";
  instagramUrlInput.value = s.instagram_url || "";
  facebookUrlInput.value = s.facebook_url || "";
  tiktokUrlInput.value = s.tiktok_url || "";
  useHeroVideoInput.checked = !!s.use_hero_video;
  useBackgroundImageInput.checked = !!s.use_background_image;
}

function renderProjectHistory() {
  if (!projectHistoryData.length) {
    projectHistoryList.innerHTML = `<div class="emptyState">📜 No hay historial de proyectos.</div>`;
    if (projectHistoryPaginator) projectHistoryPaginator.updateItems([]);
    return;
  }

  if (!projectHistoryPaginator) {
    projectHistoryPaginator = new Paginator({
      items: projectHistoryData,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: (paginatedItems) => {
        renderProjectHistoryPage(paginatedItems);
      },
      containerId: "projectHistoryPagination",
    });
  } else {
    projectHistoryPaginator.updateItems(projectHistoryData);
  }
  
  projectHistoryPaginator.setPage(1);
}

function renderProjectHistoryPage(items) {
  if (!items.length) {
    projectHistoryList.innerHTML = `<div class="emptyState">📜 No hay historial de proyectos.</div>`;
    return;
  }

  projectHistoryList.innerHTML = items.map(item => {
    const snap = item.snapshot || {};
    const title = snap.title || `Proyecto ${item.project_id}`;
    return `
      <article class="listCard listCard--compact">
        <div class="listCard__body">
          <div class="listCard__title">📌 ${escapeHtml(title)}</div>
          <div class="listCard__meta">⚡ ${escapeHtml(item.action_type)} · ${formatDate(item.created_at)}</div>
          <div class="listCard__meta">👤 Por: ${escapeHtml(item.changed_by || "admin")}</div>
        </div>
        <div class="listCard__actions">
          <button class="btn btn--ghost btn--small" data-restore-project-history="${item.id}" data-tooltip="Restaurar esta versión">↩️ Restaurar</button>
        </div>
      </article>
    `;
  }).join("");

  projectHistoryList.querySelectorAll("[data-restore-project-history]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const item = projectHistoryData.find(x => String(x.id) === String(btn.getAttribute("data-restore-project-history")));
      if (item) await restoreProjectFromHistory(item);
    });
  });
}

function renderSettingsHistory() {
  if (!settingsHistoryData.length) {
    settingsHistoryList.innerHTML = `<div class="emptyState">⚙️ No hay historial de settings.</div>`;
    if (settingsHistoryPaginator) settingsHistoryPaginator.updateItems([]);
    return;
  }

  if (!settingsHistoryPaginator) {
    settingsHistoryPaginator = new Paginator({
      items: settingsHistoryData,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: (paginatedItems) => {
        renderSettingsHistoryPage(paginatedItems);
      },
      containerId: "settingsHistoryPagination",
    });
  } else {
    settingsHistoryPaginator.updateItems(settingsHistoryData);
  }
  
  settingsHistoryPaginator.setPage(1);
}

function renderSettingsHistoryPage(items) {
  if (!items.length) {
    settingsHistoryList.innerHTML = `<div class="emptyState">⚙️ No hay historial de settings.</div>`;
    return;
  }

  settingsHistoryList.innerHTML = items.map(item => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">⚙️ Settings globales</div>
        <div class="listCard__meta">📝 ${escapeHtml(item.action_type)} · ${formatDate(item.created_at)}</div>
        <div class="listCard__meta">👤 Por: ${escapeHtml(item.changed_by || "admin")}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" data-restore-settings-history="${item.id}" data-tooltip="Restaurar esta configuración">↩️ Restaurar</button>
      </div>
    </article>
  `).join("");

  settingsHistoryList.querySelectorAll("[data-restore-settings-history]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const item = settingsHistoryData.find(x => String(x.id) === String(btn.getAttribute("data-restore-settings-history")));
      if (item) await restoreSettingsFromHistory(item);
    });
  });
}

/* =========================
   HISTORIAL
========================= */
async function snapshotProject(project, actionType) {
  if (!project?.id) return;
  await sb.from("project_history").insert([{
    project_id: project.id,
    action_type: actionType,
    snapshot: project,
    changed_by: currentUserEmail || null,
  }]);
}

async function snapshotSiteSettings(settings, actionType = "update") {
  if (!settings?.id) return;
  await sb.from("site_settings_history").insert([{
    settings_id: settings.id,
    action_type: actionType,
    snapshot: settings,
    changed_by: currentUserEmail || null,
  }]);
}

async function restoreProjectFromHistory(item) {
  const ok = await confirmAction({
    message: `¿Restaurar la versión previa de "${item.snapshot?.title || "proyecto"}"?`,
    type: "restore",
    double: true,
  });
  if (!ok) return;

  const snap = { ...(item.snapshot || {}) };
  delete snap.id;
  delete snap.created_at;
  snap.updated_at = new Date().toISOString();
  snap.deleted_at = null;

  const { error } = await sb.from("projects").update(snap).eq("id", item.project_id);
  if (error) return setProjectsMsg(`No se pudo restaurar: ${error.message}`);

  const { data: restored } = await sb.from("projects").select("*").eq("id", item.project_id).maybeSingle();
  if (restored) await snapshotProject(restored, "restore");

  setProjectsMsg("✅ Proyecto restaurado.");
  await loadProjects();
  await loadHistory();
}

async function restoreSettingsFromHistory(item) {
  const ok = await confirmAction({
    message: "¿Restaurar esta versión de settings globales?",
    type: "restore",
    double: true,
  });
  if (!ok) return;

  const snap = { ...(item.snapshot || {}) };
  snap.id = "global";
  snap.updated_at = new Date().toISOString();
  snap.updated_by = currentUserEmail || null;

  const { error } = await sb.from("site_settings").upsert([snap], { onConflict: "id" });
  if (error) return setSiteSettingsMsg(`No se pudo restaurar settings: ${error.message}`);

  await snapshotSiteSettings(snap, "restore");
  setSiteSettingsMsg("✅ Settings restaurados.");
  await loadSiteSettings();
  await loadHistory();
}

/* =========================
   TAGS
========================= */
async function upsertTagsAndBindings(projectId, names) {
  const cleaned = parseTagInput(names.join(", "));
  if (!projectId) return;

  const tagIds = [];

  for (const name of cleaned) {
    const slug = slugify(name);
    let existing = tagsData.find(t => t.slug === slug);

    if (!existing) {
      const { data, error } = await sb.from("tags").insert([{
        name,
        slug,
        active: true,
        updated_at: new Date().toISOString(),
      }]).select("*").single();

      if (error) throw new Error(`No se pudo crear tag "${name}": ${error.message}`);
      existing = data;
      tagsData.push(data);
    }

    tagIds.push(existing.id);
  }

  await sb.from("project_tags").delete().eq("project_id", projectId);

  if (tagIds.length) {
    const rows = tagIds.map(tagId => ({ project_id: projectId, tag_id: tagId }));
    const { error } = await sb.from("project_tags").insert(rows);
    if (error) throw new Error(`No se pudieron guardar los tags: ${error.message}`);
  }
}

/* =========================
   UPLOAD STORAGE
========================= */
async function uploadImageToStorage() {
  if (!projectImageFileInput || !projectUploadBtn || !projectUploadMsg) return;
  setProjectUploadMsg("");

  const file = projectImageFileInput.files?.[0];
  if (!file) return setProjectUploadMsg("Seleccioná una imagen primero.", "error");
  if (!file.type.startsWith("image/")) return setProjectUploadMsg("El archivo debe ser una imagen.", "error");
  if (file.size > 8 * 1024 * 1024) return setProjectUploadMsg("La imagen supera 8MB.", "error");

  projectUploadBtn.disabled = true;
  setProjectUploadMsg("📤 Subiendo imagen...", "success");

  try {
    const filePath = buildStorageFilePath(file);

    const { error: uploadError } = await sb
      .storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message || "No se pudo subir la imagen.");
    }

    const { data: publicData } = sb.storage.from("project-images").getPublicUrl(filePath);
    const publicUrl = publicData?.publicUrl || "";

    if (!publicUrl) {
      throw new Error("No se pudo obtener la URL pública.");
    }

    projectImageUrlInput.value = publicUrl;
    projectPreviewImg.src = publicUrl;
    setProjectUploadMsg("✅ Imagen subida y URL completada.", "success");
  } catch (error) {
    setProjectUploadMsg(error instanceof Error ? error.message : "No se pudo subir la imagen.", "error");
  } finally {
    projectUploadBtn.disabled = false;
  }
}

/* =========================
   PROJECTS CRUD
========================= */
projectImageUrlInput.addEventListener("input", () => {
  const value = safeUrl(projectImageUrlInput.value);
  if (value) projectPreviewImg.src = value;
  else projectPreviewImg.removeAttribute("src");
});

if (projectImageFileInput) {
  projectImageFileInput.addEventListener("change", () => {
    const file = projectImageFileInput.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    projectPreviewImg.src = localUrl;
  });
}

if (projectUploadBtn) {
  projectUploadBtn.addEventListener("click", uploadImageToStorage);
}

projectAdvancedToggleBtn.addEventListener("click", () => {
  const open = projectAdvancedBox.style.display !== "none";
  projectAdvancedBox.style.display = open ? "none" : "";
  projectAdvancedToggleBtn.textContent = open ? "🔧 Abrir ajustes avanzados" : "🔧 Cerrar ajustes avanzados";
});

projectTagsInput.addEventListener("input", renderTagPreview);

projectFormResetBtn.addEventListener("click", resetProjectForm);
dashboardNewBtn.addEventListener("click", () => { resetProjectForm(); switchView("new-project"); });
projectsNewBtn.addEventListener("click", () => { resetProjectForm(); switchView("new-project"); });
quickNewProjectBtn.addEventListener("click", () => { resetProjectForm(); switchView("new-project"); });

projectDuplicateBtn.addEventListener("click", async () => {
  if (!editingProjectId) return;
  const project = projectsData.find(p => String(p.id) === String(editingProjectId));
  if (project) await duplicateProject(project);
});

projectSaveBtn.addEventListener("click", async () => {
  setProjectFormMsg("");

  const image_url = safeUrl(projectImageUrlInput.value);
  const title = (projectTitleInput.value || "").trim();
  const demo_url = safeUrl(projectDemoUrlInput.value);
  const category_id = projectCategorySelect.value || null;
  const solution_type = projectTypeSelect.value || "";
  const short_description = (projectShortDescInput.value || "").trim();
  const full_description = (projectFullDescInput.value || "").trim();
  const preview_type = projectPreviewTypeSelect.value || "image";
  const order_index = Number(projectOrderInput.value || 0);
  const status = projectStatusSelect.value || "published";
  const tags = parseTagInput(projectTagsInput.value);

  if (!image_url) return setProjectFormMsg("❌ Falta la URL de imagen.");
  if (!title) return setProjectFormMsg("❌ Falta el título.");
  if (!demo_url) return setProjectFormMsg("❌ Falta el link demo.");
  if (!category_id) return setProjectFormMsg("❌ Elegí una categoría.");
  if (!solution_type) return setProjectFormMsg("❌ Elegí un tipo de solución.");
  if (!short_description) return setProjectFormMsg("❌ Falta la descripción corta.");

  const legacy = deriveLegacyFlagsFromStatus(status);
  const payload = {
    image_url,
    title,
    demo_url,
    category_id,
    solution_type,
    short_description,
    full_description: full_description || null,
    preview_type,
    order_index: Number.isNaN(order_index) ? 0 : order_index,
    status,
    active: projectActiveInput.checked && legacy.active,
    highlight: projectHighlightInput.checked || legacy.highlight,
    featured_home: projectFeaturedHomeInput.checked,
    featured_portfolio: projectFeaturedPortfolioInput.checked,
    updated_at: new Date().toISOString(),
  };

  const ok = await confirmAction({
    message: editingProjectId ? `¿Guardar cambios en "${title}"?` : `¿Crear "${title}"?`,
    type: "generic",
  });
  if (!ok) return;

  if (!editingProjectId) {
    const { data, error } = await sb.from("projects").insert([payload]).select("*").single();
    if (error) return setProjectFormMsg(`No se pudo publicar: ${error.message}`);

    try {
      await upsertTagsAndBindings(data.id, tags);
    } catch (tagError) {
      console.error(tagError);
      setProjectFormMsg(tagError instanceof Error ? tagError.message : "Proyecto creado pero fallaron los tags.");
      await loadTags();
      await loadProjects();
      return;
    }

    await snapshotProject(data, "create");
    setProjectFormMsg("✅ Proyecto publicado.");
  } else {
    const current = projectsData.find(p => String(p.id) === String(editingProjectId));
    if (current) await snapshotProject(current, "update");

    const { data, error } = await sb.from("projects").update(payload).eq("id", editingProjectId).select("*").single();
    if (error) return setProjectFormMsg(`No se pudo guardar: ${error.message}`);

    try {
      await upsertTagsAndBindings(editingProjectId, tags);
    } catch (tagError) {
      console.error(tagError);
      setProjectFormMsg(tagError instanceof Error ? tagError.message : "Proyecto actualizado pero fallaron los tags.");
      await loadTags();
      await loadProjects();
      return;
    }

    setProjectFormMsg("✅ Proyecto actualizado.");
  }

  await loadTags();
  await loadProjects();
  await loadHistory();
  resetProjectForm();
  switchView("projects");
});

projectDeleteBtn.addEventListener("click", async () => {
  if (!editingProjectId) return;
  const project = projectsData.find(p => String(p.id) === String(editingProjectId));
  if (project) await deleteProject(project);
});

async function toggleProjectActive(project) {
  const ok = await confirmAction({ message: `¿Actualizar estado activo de "${project.title}"?`, type: "generic" });
  if (!ok) return;

  await snapshotProject(project, "status_change");
  const { error } = await sb.from("projects").update({
    active: !project.active,
    updated_at: new Date().toISOString(),
  }).eq("id", project.id);

  if (error) return setProjectsMsg(`No se pudo actualizar el proyecto: ${error.message}`);
  setProjectsMsg("✅ Proyecto actualizado.");
  await loadProjects();
  await loadHistory();
}

async function deleteProject(project) {
  const ok = await confirmAction({
    message: `📦 ¿Archivar "${project.title}"? No se borra físico, se oculta y queda restaurable.`,
    type: "delete",
    double: true,
  });
  if (!ok) return;

  await snapshotProject(project, "delete");

  const { error } = await sb.from("projects").update({
    status: "archived",
    active: false,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", project.id);

  if (error) return setProjectsMsg(`No se pudo archivar el proyecto: ${error.message}`);
  setProjectsMsg("📦 Proyecto archivado.");
  await loadProjects();
  await loadHistory();
  resetProjectForm();
  switchView("projects");
}

async function duplicateProject(project) {
  const ok = await confirmAction({ message: `📋 ¿Duplicar "${project.title}"?`, type: "generic" });
  if (!ok) return;

  const clonePayload = {
    image_url: project.image_url,
    title: `${project.title} (copia)`,
    demo_url: project.demo_url,
    category_id: project.category_id,
    solution_type: project.solution_type,
    short_description: project.short_description,
    full_description: project.full_description,
    preview_type: project.preview_type,
    order_index: project.order_index,
    active: false,
    highlight: false,
    featured_home: false,
    featured_portfolio: false,
    status: "draft",
    duplicated_from: project.id,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("projects").insert([clonePayload]).select("*").single();
  if (error) return setProjectsMsg(`No se pudo duplicar: ${error.message}`);

  const tags = getProjectTags(project.id);
  await upsertTagsAndBindings(data.id, tags.map(t => t.name));
  await snapshotProject(data, "duplicate");

  setProjectsMsg("✅ Proyecto duplicado.");
  await loadTags();
  await loadProjects();
  await loadHistory();
}

/* =========================
   FILTERS
========================= */
projectsRefreshBtn.addEventListener("click", loadProjects);
dashboardRefreshBtn.addEventListener("click", loadAll);
dashboardSeeProjectsBtn.addEventListener("click", () => switchView("projects"));
projectSearchInput.addEventListener("input", renderProjectsList);
projectCategoryFilter.addEventListener("change", renderProjectsList);
projectTypeFilter.addEventListener("change", renderProjectsList);
projectStatusFilter.addEventListener("change", renderProjectsList);
projectTagFilter.addEventListener("change", renderProjectsList);

/* =========================
   CATEGORIES CRUD
========================= */
categoryNameInput.addEventListener("input", () => {
  if (!categorySlugInput.dataset.manuallyEdited) categorySlugInput.value = slugify(categoryNameInput.value);
});
categorySlugInput.addEventListener("input", () => { categorySlugInput.dataset.manuallyEdited = "true"; });
categoryResetBtn.addEventListener("click", () => { categorySlugInput.dataset.manuallyEdited = ""; resetCategoryForm(); });
categoriesRefreshBtn.addEventListener("click", loadCategories);

categorySaveBtn.addEventListener("click", async () => {
  setCategoriesMsg("");
  const name = (categoryNameInput.value || "").trim();
  const slug = slugify(categorySlugInput.value || categoryNameInput.value);
  const order_index = Number(categoryOrderInput.value || 0);
  const active = categoryActiveInput.checked;
  if (!name) return setCategoriesMsg("❌ Falta el nombre.");
  if (!slug) return setCategoriesMsg("❌ Falta el slug.");

  const payload = {
    name,
    slug,
    order_index: Number.isNaN(order_index) ? 0 : order_index,
    active,
    updated_at: new Date().toISOString(),
  };

  const ok = await confirmAction({ message: editingCategoryId ? `¿Guardar categoría "${name}"?` : `¿Crear categoría "${name}"?`, type: "generic" });
  if (!ok) return;

  if (!editingCategoryId) {
    const { error } = await sb.from("categories").insert([payload]);
    if (error) return setCategoriesMsg(`No se pudo guardar la categoría: ${error.message}`);
    setCategoriesMsg("✅ Categoría creada.");
  } else {
    const { error } = await sb.from("categories").update(payload).eq("id", editingCategoryId);
    if (error) return setCategoriesMsg(`No se pudo actualizar la categoría: ${error.message}`);
    setCategoriesMsg("✅ Categoría actualizada.");
  }

  categorySlugInput.dataset.manuallyEdited = "";
  resetCategoryForm();
  await loadCategories();
  await loadProjects();
});

/* =========================
   FAQS CRUD
========================= */
faqsRefreshBtn.addEventListener("click", loadFaqs);
faqResetBtn.addEventListener("click", resetFaqForm);

faqSaveBtn.addEventListener("click", async () => {
  setFaqsMsg("");
  const question = (faqQuestionInput.value || "").trim();
  const answer = (faqAnswerInput.value || "").trim();
  const order_index = Number(faqOrderInput.value || 0);
  const active = faqActiveInput.checked;
  if (!question) return setFaqsMsg("❌ Falta la pregunta.");
  if (!answer) return setFaqsMsg("❌ Falta la respuesta.");

  const payload = {
    question,
    answer,
    order_index: Number.isNaN(order_index) ? 0 : order_index,
    active,
    updated_at: new Date().toISOString(),
  };

  const ok = await confirmAction({ message: editingFaqId ? "¿Guardar FAQ?" : "¿Crear FAQ?", type: "generic" });
  if (!ok) return;

  if (!editingFaqId) {
    const { error } = await sb.from("faqs").insert([payload]);
    if (error) return setFaqsMsg(`No se pudo guardar la FAQ: ${error.message}`);
    setFaqsMsg("✅ FAQ creada.");
  } else {
    const { error } = await sb.from("faqs").update(payload).eq("id", editingFaqId);
    if (error) return setFaqsMsg(`No se pudo actualizar la FAQ: ${error.message}`);
    setFaqsMsg("✅ FAQ actualizada.");
  }

  resetFaqForm();
  await loadFaqs();
});

/* =========================
   SITE CONTENT CRUD
========================= */
siteContentRefreshBtn.addEventListener("click", loadSiteContent);

siteContentSelect.addEventListener("change", () => {
  const id = siteContentSelect.value;
  if (!id) {
    siteContentTitleInput.value = "";
    siteContentSubtitleInput.value = "";
    siteContentBodyInput.value = "";
    siteContentImageUrlInput.value = "";
    siteContentCtaLabelInput.value = "";
    siteContentCtaUrlInput.value = "";
    siteContentOrderInput.value = "0";
    siteContentActiveInput.checked = true;
    setSiteContentMsg("");
    return;
  }
  fillSiteContentFormById(id);
});

siteContentSaveBtn.addEventListener("click", async () => {
  setSiteContentMsg("");
  const id = siteContentSelect.value;
  if (!id) return setSiteContentMsg("❌ Elegí un bloque.");

  const payload = {
    title: (siteContentTitleInput.value || "").trim() || null,
    subtitle: (siteContentSubtitleInput.value || "").trim() || null,
    content: (siteContentBodyInput.value || "").trim() || null,
    image_url: safeUrl(siteContentImageUrlInput.value),
    cta_label: (siteContentCtaLabelInput.value || "").trim() || null,
    cta_url: safeUrl(siteContentCtaUrlInput.value),
    order_index: Number(siteContentOrderInput.value || 0) || 0,
    active: siteContentActiveInput.checked,
    updated_at: new Date().toISOString(),
  };

  const ok = await confirmAction({ message: "¿Guardar bloque de contenido global?", type: "generic" });
  if (!ok) return;

  const { error } = await sb.from("site_content").update(payload).eq("id", id);
  if (error) return setSiteContentMsg(`No se pudo guardar el bloque: ${error.message}`);

  setSiteContentMsg("✅ Bloque actualizado.");
  await loadSiteContent();
  siteContentSelect.value = id;
  fillSiteContentFormById(id);
});

/* =========================
   SITE SETTINGS CRUD
========================= */
siteSettingsRefreshBtn.addEventListener("click", loadSiteSettings);

siteSettingsSaveBtn.addEventListener("click", async () => {
  setSiteSettingsMsg("");

  const payload = {
    id: "global",
    site_title: (siteTitleInput.value || "").trim() || null,
    site_tagline: (siteTaglineInput.value || "").trim() || null,
    hero_badge: (heroBadgeInput.value || "").trim() || null,
    hero_title: (heroTitleInput.value || "").trim() || null,
    hero_subtitle: (heroSubtitleInput.value || "").trim() || null,
    hero_cta_label: (heroCtaLabelInput.value || "").trim() || null,
    hero_cta_url: safeUrl(heroCtaUrlInput.value),
    logo_url: safeUrl(logoUrlInput.value),
    hero_logo_url: safeUrl(heroLogoUrlInput.value),
    footer_logo_url: safeUrl(footerLogoUrlInput.value),
    favicon_url: safeUrl(faviconUrlInput.value),
    background_image_url: safeUrl(backgroundImageUrlInput.value),
    hero_image_url: safeUrl(heroImageUrlInput.value),
    hero_overlay_url: safeUrl(heroOverlayUrlInput.value),
    hero_video_url: safeUrl(heroVideoUrlInput.value),
    whatsapp_number: (whatsappNumberInput.value || "").trim() || null,
    email_contact: (emailContactInput.value || "").trim() || null,
    instagram_url: safeUrl(instagramUrlInput.value),
    facebook_url: safeUrl(facebookUrlInput.value),
    tiktok_url: safeUrl(tiktokUrlInput.value),
    use_hero_video: useHeroVideoInput.checked,
    use_background_image: useBackgroundImageInput.checked,
    updated_at: new Date().toISOString(),
    updated_by: currentUserEmail || null,
  };

  const ok = await confirmAction({
    message: "¿Guardar settings visuales globales?",
    type: "generic",
  });
  if (!ok) return;

  if (siteSettingsData?.id) await snapshotSiteSettings(siteSettingsData, "update");

  const { error } = await sb.from("site_settings").upsert([payload], { onConflict: "id" });
  if (error) return setSiteSettingsMsg(`No se pudo guardar settings: ${error.message}`);

  setSiteSettingsMsg("✅ Settings globales actualizados.");
  await loadSiteSettings();
  await loadHistory();
});

/* =========================
   HISTORY
========================= */
historyRefreshBtn.addEventListener("click", loadHistory);

/* =========================
   KEYBOARD SHORTCUTS
========================= */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K para buscar proyectos
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (projectSearchInput) {
      projectSearchInput.focus();
      switchView("projects");
    }
  }
  
  // Ctrl/Cmd + N para nuevo proyecto
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    resetProjectForm();
    switchView("new-project");
  }
  
  // Esc para limpiar búsqueda
  if (e.key === "Escape" && document.activeElement === projectSearchInput) {
    projectSearchInput.value = "";
    renderProjectsList();
  }
});

/* =========================
   NAV
========================= */
navBtns.forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

/* =========================
   REVIEWS (RESEÑAS) - MEJORADO
========================= */

async function loadPendingReviews() {
  const container = document.getElementById("reviewsPendingList");
  if (!container) return;
  
  container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';
  
  try {
    const { data, error } = await sb
      .from("reviews")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      setReviewsMsg(`❌ Error: ${error.message}`, true);
      container.innerHTML = `<div class="emptyState">⚠️ Error al cargar reseñas. ¿La tabla 'reviews' existe?</div>`;
      return;
    }
    
    reviewsData = data || [];
    updatePendingStats();
    renderPendingReviews();
  } catch (err) {
    console.error("Exception loading reviews:", err);
    container.innerHTML = `<div class="emptyState">⚠️ Error: ${err.message}</div>`;
  }
}

function updatePendingStats() {
  const pendingCount = reviewsData.length;
  const pendingCountEl = document.getElementById("pendingCount");
  if (pendingCountEl) {
    pendingCountEl.textContent = pendingCount;
  }
  const pendingBadge = document.getElementById("pendingBadge");
  if (pendingBadge) {
    if (pendingCount > 0) {
      pendingBadge.textContent = pendingCount;
      pendingBadge.style.display = "inline-block";
    } else {
      pendingBadge.style.display = "none";
    }
  }
}

function setReviewsMsg(msg, isError = false) {
  const msgEl = document.getElementById("reviewsPendingMsg");
  if (!msgEl) return;
  
  msgEl.textContent = msg;
  msgEl.classList.remove("msg--success", "msg--error");
  msgEl.classList.add(isError ? "msg--error" : "msg--success");
  
  setTimeout(() => {
    if (msgEl.textContent === msg) {
      msgEl.textContent = "";
      msgEl.classList.remove("msg--success", "msg--error");
    }
  }, 4000);
}

function renderPendingReviews() {
  const container = document.getElementById("reviewsPendingList");
  if (!container) return;
  
  if (!reviewsData.length) {
    container.innerHTML = `<div class="emptyState">✅ No hay reseñas pendientes de moderación.</div>`;
    return;
  }
  
  container.innerHTML = `
    <table class="reviews-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Calificación</th>
          <th>Reseña</th>
          <th>Proyecto</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${reviewsData.map(review => `
          <tr>
            <td data-label="Usuario">
              <strong>${escapeHtml(review.user_name || "Anónimo")}</strong>
              ${review.user_email ? `<br/><small>${escapeHtml(review.user_email)}</small>` : ""}
            </td>
            <td data-label="Calificación">
              ${"⭐".repeat(review.rating)} (${review.rating}/5)
            </td>
            <td data-label="Reseña">
              ${review.title ? `<strong>${escapeHtml(review.title)}</strong><br/>` : ""}
              ${escapeHtml((review.comment || "").substring(0, 200))}${(review.comment || "").length > 200 ? "..." : ""}
            </td>
            <td data-label="Proyecto">
              ${review.project_id ? escapeHtml(review.project_title || `Proyecto ${review.project_id}`) : "Opinión general"}
            </td>
            <td data-label="Fecha">
              <small>${formatDate(review.created_at)}</small>
            </td>
            <td data-label="Acciones" class="action-btns">
              <button class="btn btn--small btn--ghost" data-edit-review="${review.id}" style="border-color:var(--cyan);">✏️ Editar</button>
              <button class="btn btn--success btn--small" data-approve-review="${review.id}">✅ Aprobar</button>
              <button class="btn btn--danger btn--small" data-reject-review="${review.id}">❌ Rechazar</button>
             </td>
           </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  
  container.querySelectorAll("[data-approve-review]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-approve-review");
      await approveReview(id);
    });
  });
  
  container.querySelectorAll("[data-reject-review]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-reject-review");
      await rejectReview(id);
    });
  });
  
  container.querySelectorAll("[data-edit-review]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit-review");
      const review = reviewsData.find(r => String(r.id) === String(id));
      if (review) openEditModal(review);
    });
  });
}

async function approveReview(reviewId) {
  const ok = await confirmAction({
    message: "✅ ¿Aprobar esta reseña? Se publicará automáticamente en el sitio.",
    type: "generic",
  });
  if (!ok) return;
  
  setReviewsMsg("⏳ Aprobando reseña...");
  
  const { error } = await sb
    .from("reviews")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: currentUserEmail,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);
  
  if (error) {
    setReviewsMsg(`❌ Error al aprobar: ${error.message}`, true);
    return;
  }
  
  setReviewsMsg("✅ Reseña aprobada y publicada correctamente.");
  await loadPendingReviews();
  if (typeof loadApprovedReviews === "function") await loadApprovedReviews();
  checkNewReviewsNotification();
}

async function rejectReview(reviewId) {
  const ok = await confirmAction({
    message: "❌ ¿Rechazar esta reseña? Se eliminará permanentemente y no se podrá recuperar.",
    type: "delete",
    double: true,
  });
  if (!ok) return;
  
  setReviewsMsg("⏳ Eliminando reseña...");
  
  const { error } = await sb
    .from("reviews")
    .delete()
    .eq("id", reviewId);
  
  if (error) {
    setReviewsMsg(`❌ Error al rechazar: ${error.message}`, true);
    return;
  }
  
  setReviewsMsg("❌ Reseña rechazada y eliminada.");
  await loadPendingReviews();
  if (typeof loadApprovedReviews === "function") await loadApprovedReviews();
  checkNewReviewsNotification();
}

// NOTIFICACIONES VISUALES
async function checkNewReviewsNotification() {
  if (!sb || !currentUserEmail) return;
  
  try {
    const { data, error } = await sb
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    
    if (error) throw error;
    
    const currentCount = data?.length || 0;
    
    if (pendingBadge) {
      if (currentCount > 0) {
        pendingBadge.textContent = currentCount;
        pendingBadge.style.display = "inline-block";
      } else {
        pendingBadge.style.display = "none";
      }
    }
    
    if (currentCount > lastPendingCount && lastPendingCount > 0) {
      mostrarNotificacion(`✨ Tienes ${currentCount - lastPendingCount} reseña(s) nueva(s) para moderar`);
    }
    
    lastPendingCount = currentCount;
    
  } catch (err) {
    console.error("Error checking reviews:", err);
  }
}

function mostrarNotificacion(mensaje) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #00d4ff, #8b5cf6);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: bold;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  `;
  toast.textContent = `🔔 ${mensaje}`;
  
  if (!document.querySelector("#notificationStyle")) {
    const style = document.createElement("style");
    style.id = "notificationStyle";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  toast.addEventListener("click", () => {
    if (typeof switchView === "function") {
      switchView("reviews-pending");
    }
    cerrarNotificacion(toast);
  });
  
  setTimeout(() => cerrarNotificacion(toast), 8000);
}

function cerrarNotificacion(toast) {
  toast.style.animation = "slideOut 0.3s ease";
  setTimeout(() => toast.remove(), 300);
}

function iniciarNotificaciones() {
  if (notificationCheckInterval) clearInterval(notificationCheckInterval);
  checkNewReviewsNotification();
  notificationCheckInterval = setInterval(checkNewReviewsNotification, 15000);
}

// PANEL DE RESEÑAS APROBADAS
async function loadApprovedReviews() {
  const container = document.getElementById("reviewsApprovedList");
  if (!container) return;
  
  container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';
  
  try {
    const { data, error } = await sb
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("approved_at", { ascending: false });
    
    if (error) throw error;
    
    approvedReviewsData = data || [];
    renderApprovedReviews();
  } catch (err) {
    console.error("Error loading approved reviews:", err);
    container.innerHTML = `<div class="emptyState">⚠️ Error al cargar reseñas aprobadas.</div>`;
  }
}

function renderApprovedReviews() {
  let filtered = [...approvedReviewsData];
  const searchTerm = document.getElementById("approvedSearchInput")?.value.toLowerCase() || "";
  const ratingFilter = document.getElementById("approvedRatingFilter")?.value || "all";
  const sortFilter = document.getElementById("approvedSortFilter")?.value || "recent";
  
  if (searchTerm) {
    filtered = filtered.filter(r => 
      (r.user_name || "").toLowerCase().includes(searchTerm) ||
      (r.comment || "").toLowerCase().includes(searchTerm)
    );
  }
  
  if (ratingFilter !== "all") {
    filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
  }
  
  switch(sortFilter) {
    case "oldest":
      filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case "rating_high":
      filtered.sort((a,b) => b.rating - a.rating);
      break;
    case "rating_low":
      filtered.sort((a,b) => a.rating - b.rating);
      break;
    default:
      filtered.sort((a,b) => new Date(b.approved_at || b.created_at) - new Date(a.approved_at || a.created_at));
  }
  
  if (!approvedReviewsPaginator) {
    approvedReviewsPaginator = new Paginator({
      items: filtered,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: (paginatedItems) => {
        renderApprovedReviewsPage(paginatedItems);
      },
      containerId: "reviewsApprovedPagination",
    });
  } else {
    approvedReviewsPaginator.updateItems(filtered);
  }
  
  approvedReviewsPaginator.setPage(1);
}

function renderApprovedReviewsPage(reviews) {
  const container = document.getElementById("reviewsApprovedList");
  if (!container) return;
  
  if (!reviews.length) {
    container.innerHTML = `<div class="emptyState">📭 No hay reseñas aprobadas para mostrar.</div>`;
    return;
  }
  
  container.innerHTML = `
    <table class="reviews-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Calificación</th>
          <th>Reseña</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        ${reviews.map(review => `
          <tr>
            <td data-label="Usuario"><strong>${escapeHtml(review.user_name || "Anónimo")}</strong>${review.user_email ? `<br/><small>${escapeHtml(review.user_email)}</small>` : ""}</td>
            <td data-label="Calificación">${"⭐".repeat(review.rating)} (${review.rating}/5)</td>
            <td data-label="Reseña">${review.title ? `<strong>${escapeHtml(review.title)}</strong><br/>` : ""}${escapeHtml((review.comment || "").substring(0, 200))}${(review.comment || "").length > 200 ? "..." : ""}</td>
            <td data-label="Fecha"><small>${formatDate(review.approved_at || review.created_at)}</small></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// EDICIÓN DE RESEÑA
function openEditModal(review) {
  currentEditReviewId = review.id;
  
  document.getElementById("editReviewName").value = review.user_name || "";
  document.getElementById("editReviewComment").value = review.comment || "";
  document.getElementById("editReviewId").value = review.id;
  
  const stars = document.querySelectorAll("#editRatingStars span");
  stars.forEach((star, idx) => {
    star.style.color = idx < review.rating ? "#f5b042" : "#4a4a6a";
    star.textContent = idx < review.rating ? "★" : "☆";
  });
  
  window.currentEditRating = review.rating;
  
  stars.forEach(star => {
    star.onclick = () => {
      const rating = parseInt(star.dataset.rating);
      window.currentEditRating = rating;
      stars.forEach((s, i) => {
        s.style.color = i < rating ? "#f5b042" : "#4a4a6a";
        s.textContent = i < rating ? "★" : "☆";
      });
    };
  });
  
  document.getElementById("editReviewModal").style.display = "flex";
}

async function saveEditedReviewAndApprove() {
  const reviewId = document.getElementById("editReviewId").value;
  const newComment = document.getElementById("editReviewComment").value.trim();
  const newRating = window.currentEditRating || 5;
  
  if (!newComment) {
    setReviewsMsg("❌ El comentario no puede estar vacío", true);
    return;
  }
  
  const ok = await confirmAction({
    message: "✅ ¿Aprobar esta reseña con los cambios realizados?",
    type: "generic",
  });
  if (!ok) return;
  
  setReviewsMsg("⏳ Guardando cambios y aprobando...");
  
  const { error } = await sb
    .from("reviews")
    .update({
      comment: newComment,
      rating: newRating,
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: currentUserEmail,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);
  
  if (error) {
    setReviewsMsg(`❌ Error: ${error.message}`, true);
    return;
  }
  
  setReviewsMsg("✅ Reseña editada y aprobada correctamente.");
  document.getElementById("editReviewModal").style.display = "none";
  
  await loadPendingReviews();
  await loadApprovedReviews();
}

function exportReviewsToCSV() {
  if (!approvedReviewsData.length) {
    setReviewsMsg("No hay reseñas para exportar.", true);
    return;
  }
  
  const headers = ["ID", "Usuario", "Email", "Calificación", "Comentario", "Fecha de Aprobación", "Aprobado por"];
  const rows = approvedReviewsData.map(r => [
    r.id,
    r.user_name || "",
    r.user_email || "",
    r.rating,
    `"${(r.comment || "").replace(/"/g, '""')}"`,
    r.approved_at || r.created_at,
    r.approved_by || ""
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", `reseñas_aprobadas_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  setReviewsMsg("✅ CSV exportado correctamente.");
}

/* =========================
   ADMINISTRACIÓN DE PLANES
========================= */

async function loadPlansAdmin() {
  const container = document.getElementById("plansList");
  if (!container) return;
  
  container.innerHTML = '<div class="loading-skeleton"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';
  
  try {
    const { data, error } = await sb
      .from("service_plans")
      .select("*")
      .order("order_index", { ascending: true });
    
    if (error) throw error;
    
    plansData = data || [];
    renderPlansList();
  } catch (err) {
    console.error("Error loading plans:", err);
    container.innerHTML = `<div class="emptyState">⚠️ Error al cargar planes: ${err.message}</div>`;
  }
}

function renderPlansList() {
  const container = document.getElementById("plansList");
  if (!container) return;
  
  if (!plansData.length) {
    container.innerHTML = `<div class="emptyState">💰 No hay planes cargados. Creá uno nuevo.</div>`;
    if (plansPaginator) plansPaginator.updateItems([]);
    return;
  }
  
  if (!plansPaginator) {
    plansPaginator = new Paginator({
      items: plansData,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: (paginatedItems) => {
        renderPlansListPage(paginatedItems);
      },
      containerId: "plansPagination",
    });
  } else {
    plansPaginator.updateItems(plansData);
  }
  
  plansPaginator.setPage(1);
}

function renderPlansListPage(plans) {
  const container = document.getElementById("plansList");
  if (!container) return;
  
  if (!plans.length) {
    container.innerHTML = `<div class="emptyState">💰 No hay planes para mostrar.</div>`;
    return;
  }
  
  container.innerHTML = plans.map(plan => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">💰 ${escapeHtml(plan.name)}</div>
        <div class="listCard__meta">${escapeHtml(plan.icon || '📦')} · ${escapeHtml(plan.price || 'Precio no definido')} · Orden: ${plan.order_index || 0}</div>
        <div class="listCard__meta">${plan.active ? '🟢 Activo' : '🔴 Inactivo'}</div>
        <div class="listCard__badges">
          ${plan.features?.slice(0, 3).map(f => `<span class="miniTag">${escapeHtml(f)}</span>`).join('') || ''}
          ${plan.features?.length > 3 ? `<span class="miniTag">+${plan.features.length - 3}</span>` : ''}
        </div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" data-edit-plan="${plan.id}" data-tooltip="Editar plan">✏️</button>
        <button class="btn btn--ghost btn--small" data-duplicate-plan="${plan.id}" data-tooltip="Duplicar plan">📋</button>
        <button class="btn btn--danger btn--small" data-delete-plan="${plan.id}" data-tooltip="Eliminar plan">🗑️</button>
      </div>
    </article>
  `).join("");
  
  container.querySelectorAll("[data-edit-plan]").forEach(btn => {
    btn.addEventListener("click", () => openPlanModal(btn.getAttribute("data-edit-plan")));
  });
  container.querySelectorAll("[data-duplicate-plan]").forEach(btn => {
    btn.addEventListener("click", () => duplicatePlan(btn.getAttribute("data-duplicate-plan")));
  });
  container.querySelectorAll("[data-delete-plan]").forEach(btn => {
    btn.addEventListener("click", () => deletePlan(btn.getAttribute("data-delete-plan")));
  });
}

function openPlanModal(id = null) {
  editingPlanId = id;
  const modal = document.getElementById("planModal");
  const title = document.getElementById("planModalTitle");
  
  if (!id) {
    title.textContent = "📝 Nuevo Plan";
    document.getElementById("planId").value = "";
    document.getElementById("planName").value = "";
    document.getElementById("planSlug").value = "";
    document.getElementById("planDescription").value = "";
    document.getElementById("planPrice").value = "";
    document.getElementById("planIcon").value = "📦";
    document.getElementById("planFeaturesInput").value = "";
    document.getElementById("planCtaText").value = "Consultar →";
    document.getElementById("planOrder").value = "0";
    document.getElementById("planActive").checked = true;
  } else {
    const plan = plansData.find(p => String(p.id) === String(id));
    if (!plan) return;
    title.textContent = `✏️ Editar: ${plan.name}`;
    document.getElementById("planId").value = plan.id;
    document.getElementById("planName").value = plan.name || "";
    document.getElementById("planSlug").value = plan.slug || "";
    document.getElementById("planDescription").value = plan.description || "";
    document.getElementById("planPrice").value = plan.price || "";
    document.getElementById("planIcon").value = plan.icon || "📦";
    document.getElementById("planFeaturesInput").value = (plan.features || []).join(", ");
    document.getElementById("planCtaText").value = plan.cta_text || "Consultar →";
    document.getElementById("planOrder").value = plan.order_index || 0;
    document.getElementById("planActive").checked = plan.active !== false;
  }
  
  modal.style.display = "flex";
}

async function savePlan() {
  const id = document.getElementById("planId").value;
  const name = document.getElementById("planName").value.trim();
  let slug = document.getElementById("planSlug").value.trim();
  const description = document.getElementById("planDescription").value.trim();
  const price = document.getElementById("planPrice").value.trim();
  const icon = document.getElementById("planIcon").value.trim() || "📦";
  const featuresInput = document.getElementById("planFeaturesInput").value;
  const features = featuresInput.split(",").map(f => f.trim()).filter(Boolean);
  const cta_text = document.getElementById("planCtaText").value.trim() || "Consultar →";
  const order_index = parseInt(document.getElementById("planOrder").value) || 0;
  const active = document.getElementById("planActive").checked;
  
  if (!name) {
    setPlansMsg("❌ El nombre del plan es obligatorio", true);
    return;
  }
  
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  
  const payload = { name, slug, description, price, icon, features, cta_text, order_index, active, updated_at: new Date().toISOString() };
  
  const ok = await confirmAction({
    message: id ? `¿Guardar cambios en "${name}"?` : `¿Crear el plan "${name}"?`,
    type: "generic",
  });
  if (!ok) return;
  
  setPlansMsg("⏳ Guardando...");
  
  try {
    if (id) {
      const { error } = await sb.from("service_plans").update(payload).eq("id", id);
      if (error) throw error;
      setPlansMsg("✅ Plan actualizado correctamente.");
    } else {
      const { error } = await sb.from("service_plans").insert([payload]);
      if (error) throw error;
      setPlansMsg("✅ Plan creado correctamente.");
    }
    
    document.getElementById("planModal").style.display = "none";
    await loadPlansAdmin();
  } catch (err) {
    setPlansMsg(`❌ Error: ${err.message}`, true);
  }
}

async function duplicatePlan(id) {
  const original = plansData.find(p => String(p.id) === String(id));
  if (!original) return;
  
  const ok = await confirmAction({
    message: `📋 ¿Duplicar el plan "${original.name}"?`,
    type: "generic",
  });
  if (!ok) return;
  
  const newName = `${original.name} (copia)`;
  const newSlug = `${original.slug}-copia-${Date.now()}`;
  
  const payload = {
    name: newName,
    slug: newSlug,
    description: original.description,
    price: original.price,
    icon: original.icon,
    features: original.features,
    cta_text: original.cta_text,
    order_index: (original.order_index || 0) + 1,
    active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  try {
    const { error } = await sb.from("service_plans").insert([payload]);
    if (error) throw error;
    setPlansMsg("✅ Plan duplicado correctamente.");
    await loadPlansAdmin();
  } catch (err) {
    setPlansMsg(`❌ Error al duplicar: ${err.message}`, true);
  }
}

async function deletePlan(id) {
  const plan = plansData.find(p => String(p.id) === String(id));
  if (!plan) return;
  
  const ok = await confirmAction({
    message: `⚠️ ¿Eliminar permanentemente el plan "${plan.name}"? Esta acción no se puede deshacer.`,
    type: "delete",
    double: true,
  });
  if (!ok) return;
  
  setPlansMsg("⏳ Eliminando...");
  
  try {
    const { error } = await sb.from("service_plans").delete().eq("id", id);
    if (error) throw error;
    setPlansMsg("✅ Plan eliminado correctamente.");
    await loadPlansAdmin();
  } catch (err) {
    setPlansMsg(`❌ Error al eliminar: ${err.message}`, true);
  }
}

function setPlansMsg(msg, isError = false) {
  const msgEl = document.getElementById("plansMsg");
  if (!msgEl) return;
  msgEl.textContent = msg;
  msgEl.classList.remove("msg--success", "msg--error");
  msgEl.classList.add(isError ? "msg--error" : "msg--success");
  setTimeout(() => {
    if (msgEl.textContent === msg) {
      msgEl.textContent = "";
      msgEl.classList.remove("msg--success", "msg--error");
    }
  }, 4000);
}

/* =========================
   MENÚ HAMBURGUESA PARA ADMIN
========================= */
function initSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.querySelector(".sidebar");
  
  if (!toggleBtn || !sidebar) return;
  
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
  
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 980) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    }
  });
  
  document.querySelectorAll(".navBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        sidebar.classList.remove("open");
      }
    });
  });
}

/* =========================
   INTEGRACIÓN CON LOADALL Y SWITCHVIEW
========================= */
const originalLoadAll = window.loadAll;
window.loadAll = async function() {
  if (originalLoadAll) await originalLoadAll();
  if (document.getElementById("plansList")) {
    await loadPlansAdmin();
  }
  if (document.getElementById("reviewsApprovedList")) {
    await loadApprovedReviews();
  }
  iniciarNotificaciones();
};

const originalSwitchView = window.switchView;
window.switchView = function(view) {
  if (originalSwitchView) originalSwitchView(view);
  if (view === "reviews-pending" && document.getElementById("reviewsPendingList")) {
    setTimeout(() => loadPendingReviews(), 100);
  }
  if (view === "reviews-approved" && document.getElementById("reviewsApprovedList")) {
    setTimeout(() => loadApprovedReviews(), 100);
  }
  if (view === "plans" && document.getElementById("plansList")) {
    setTimeout(() => loadPlansAdmin(), 100);
  }
};

/* =========================
   EVENT LISTENERS EXTRA
========================= */
document.getElementById("reviewsApprovedRefreshBtn")?.addEventListener("click", () => {
  loadApprovedReviews();
});

document.getElementById("exportReviewsBtn")?.addEventListener("click", () => {
  exportReviewsToCSV();
});

document.getElementById("approvedSearchInput")?.addEventListener("input", () => {
  renderApprovedReviews();
});

document.getElementById("approvedRatingFilter")?.addEventListener("change", () => {
  renderApprovedReviews();
});

document.getElementById("approvedSortFilter")?.addEventListener("change", () => {
  renderApprovedReviews();
});

document.getElementById("saveEditReviewBtn")?.addEventListener("click", saveEditedReviewAndApprove);
document.getElementById("cancelEditReviewBtn")?.addEventListener("click", () => {
  document.getElementById("editReviewModal").style.display = "none";
});

document.getElementById("plansRefreshBtn")?.addEventListener("click", () => loadPlansAdmin());
document.getElementById("plansNewBtn")?.addEventListener("click", () => openPlanModal());
document.getElementById("planSaveBtn")?.addEventListener("click", () => savePlan());
document.getElementById("planCancelBtn")?.addEventListener("click", () => {
  document.getElementById("planModal").style.display = "none";
});

document.getElementById("planName")?.addEventListener("input", function() {
  const slugInput = document.getElementById("planSlug");
  if (slugInput && !slugInput.dataset.manuallyEdited) {
    slugInput.value = this.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
});
document.getElementById("planSlug")?.addEventListener("input", function() {
  this.dataset.manuallyEdited = "true";
});

initSidebarToggle();

console.log("✅ Admin panel completamente cargado");
