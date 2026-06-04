const SUPABASE_URL = "https://fhxcumwhgtfirznnznjx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const sb = window.supabase.createClient(
  "https://fhxcumwhgtfirznnznjx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoeGN1bXdoZ3RmaXJ6bm56bmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTYyNzEsImV4cCI6MjA4MzU3MjI3MX0.7z1B099L4yrA9k1JxwvYGCABzqiqYtkUClI3E8wQ2zA"
);

/* =========================
   DOM
========================= */
const authBox = document.getElementById("authBox");
const adminBox = document.getElementById("adminBox");

const emailInput = document.getElementById("emailInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMsg = document.getElementById("authMsg");
const userEmail = document.getElementById("userEmail");

const safeModeBtn = document.getElementById("safeModeBtn");
const fastModeBtn = document.getElementById("fastModeBtn");

const navBtns = document.querySelectorAll(".navBtn");
const viewPanels = document.querySelectorAll(".viewPanel");
const quickNewProjectBtn = document.getElementById("quickNewProjectBtn");

const dashboardRefreshBtn = document.getElementById("dashboardRefreshBtn");
const dashboardNewBtn = document.getElementById("dashboardNewBtn");
const dashboardSeeProjectsBtn = document.getElementById("dashboardSeeProjectsBtn");
const statProjects = document.getElementById("statProjects");
const statActive = document.getElementById("statActive");
const statHighlight = document.getElementById("statHighlight");
const statHome = document.getElementById("statHome");
const statPortfolio = document.getElementById("statPortfolio");
const statCategories = document.getElementById("statCategories");
const dashboardRecentList = document.getElementById("dashboardRecentList");

const projectsRefreshBtn = document.getElementById("projectsRefreshBtn");
const projectsNewBtn = document.getElementById("projectsNewBtn");
const projectSearchInput = document.getElementById("projectSearchInput");
const projectCategoryFilter = document.getElementById("projectCategoryFilter");
const projectTypeFilter = document.getElementById("projectTypeFilter");
const projectStatusFilter = document.getElementById("projectStatusFilter");
const projectTagFilter = document.getElementById("projectTagFilter");
const projectsMsg = document.getElementById("projectsMsg");
const projectsList = document.getElementById("projectsList");

const projectFormTitle = document.getElementById("projectFormTitle");
const projectFormResetBtn = document.getElementById("projectFormResetBtn");
const projectDuplicateBtn = document.getElementById("projectDuplicateBtn");
const projectImageUrlInput = document.getElementById("projectImageUrlInput");
const projectImageFileInput = document.getElementById("projectImageFileInput");
const projectUploadBtn = document.getElementById("projectUploadBtn");
const projectUploadMsg = document.getElementById("projectUploadMsg");
const projectPreviewImg = document.getElementById("projectPreviewImg");
const projectTitleInput = document.getElementById("projectTitleInput");
const projectDemoUrlInput = document.getElementById("projectDemoUrlInput");
const projectCategorySelect = document.getElementById("projectCategorySelect");
const projectTypeSelect = document.getElementById("projectTypeSelect");
const projectStatusSelect = document.getElementById("projectStatusSelect");
const projectTagsInput = document.getElementById("projectTagsInput");
const projectTagsPreview = document.getElementById("projectTagsPreview");
const projectShortDescInput = document.getElementById("projectShortDescInput");
const projectActiveInput = document.getElementById("projectActiveInput");
const projectHighlightInput = document.getElementById("projectHighlightInput");
const projectFeaturedHomeInput = document.getElementById("projectFeaturedHomeInput");
const projectFeaturedPortfolioInput = document.getElementById("projectFeaturedPortfolioInput");
const projectAdvancedToggleBtn = document.getElementById("projectAdvancedToggleBtn");
const projectAdvancedBox = document.getElementById("projectAdvancedBox");
const projectFullDescInput = document.getElementById("projectFullDescInput");
const projectPreviewTypeSelect = document.getElementById("projectPreviewTypeSelect");
const projectOrderInput = document.getElementById("projectOrderInput");
const projectSaveBtn = document.getElementById("projectSaveBtn");
const projectDeleteBtn = document.getElementById("projectDeleteBtn");
const projectFormMsg = document.getElementById("projectFormMsg");

const categoriesRefreshBtn = document.getElementById("categoriesRefreshBtn");
const categoryNameInput = document.getElementById("categoryNameInput");
const categorySlugInput = document.getElementById("categorySlugInput");
const categoryOrderInput = document.getElementById("categoryOrderInput");
const categoryActiveInput = document.getElementById("categoryActiveInput");
const categorySaveBtn = document.getElementById("categorySaveBtn");
const categoryResetBtn = document.getElementById("categoryResetBtn");
const categoriesMsg = document.getElementById("categoriesMsg");
const categoriesList = document.getElementById("categoriesList");

const siteContentRefreshBtn = document.getElementById("siteContentRefreshBtn");
const siteContentSelect = document.getElementById("siteContentSelect");
const siteContentTitleInput = document.getElementById("siteContentTitleInput");
const siteContentSubtitleInput = document.getElementById("siteContentSubtitleInput");
const siteContentBodyInput = document.getElementById("siteContentBodyInput");
const siteContentImageUrlInput = document.getElementById("siteContentImageUrlInput");
const siteContentCtaLabelInput = document.getElementById("siteContentCtaLabelInput");
const siteContentCtaUrlInput = document.getElementById("siteContentCtaUrlInput");
const siteContentOrderInput = document.getElementById("siteContentOrderInput");
const siteContentActiveInput = document.getElementById("siteContentActiveInput");
const siteContentSaveBtn = document.getElementById("siteContentSaveBtn");
const siteContentMsg = document.getElementById("siteContentMsg");

const siteSettingsRefreshBtn = document.getElementById("siteSettingsRefreshBtn");
const siteTitleInput = document.getElementById("siteTitleInput");
const siteTaglineInput = document.getElementById("siteTaglineInput");
const heroBadgeInput = document.getElementById("heroBadgeInput");
const heroTitleInput = document.getElementById("heroTitleInput");
const heroSubtitleInput = document.getElementById("heroSubtitleInput");
const heroCtaLabelInput = document.getElementById("heroCtaLabelInput");
const heroCtaUrlInput = document.getElementById("heroCtaUrlInput");
const logoUrlInput = document.getElementById("logoUrlInput");
const heroLogoUrlInput = document.getElementById("heroLogoUrlInput");
const footerLogoUrlInput = document.getElementById("footerLogoUrlInput");
const faviconUrlInput = document.getElementById("faviconUrlInput");
const backgroundImageUrlInput = document.getElementById("backgroundImageUrlInput");
const heroImageUrlInput = document.getElementById("heroImageUrlInput");
const heroOverlayUrlInput = document.getElementById("heroOverlayUrlInput");
const heroVideoUrlInput = document.getElementById("heroVideoUrlInput");
const whatsappNumberInput = document.getElementById("whatsappNumberInput");
const emailContactInput = document.getElementById("emailContactInput");
const instagramUrlInput = document.getElementById("instagramUrlInput");
const facebookUrlInput = document.getElementById("facebookUrlInput");
const tiktokUrlInput = document.getElementById("tiktokUrlInput");
const useHeroVideoInput = document.getElementById("useHeroVideoInput");
const useBackgroundImageInput = document.getElementById("useBackgroundImageInput");
const siteSettingsSaveBtn = document.getElementById("siteSettingsSaveBtn");
const siteSettingsMsg = document.getElementById("siteSettingsMsg");

const historyRefreshBtn = document.getElementById("historyRefreshBtn");
const projectHistoryList = document.getElementById("projectHistoryList");
const settingsHistoryList = document.getElementById("settingsHistoryList");

const faqsRefreshBtn = document.getElementById("faqsRefreshBtn");
const faqQuestionInput = document.getElementById("faqQuestionInput");
const faqAnswerInput = document.getElementById("faqAnswerInput");
const faqOrderInput = document.getElementById("faqOrderInput");
const faqActiveInput = document.getElementById("faqActiveInput");
const faqSaveBtn = document.getElementById("faqSaveBtn");
const faqResetBtn = document.getElementById("faqResetBtn");
const faqsMsg = document.getElementById("faqsMsg");
const faqsList = document.getElementById("faqsList");

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

  const filterOpts = [`<option value="__all__">Todas</option>`]
    .concat(activeCats.map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`))
    .join("");
  projectCategoryFilter.innerHTML = filterOpts;
}

function fillTagFilter() {
  const filterOpts = [`<option value="__all__">Todos</option>`]
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
  projectTagsPreview.innerHTML = raw.map(tag => `<span class="miniTag">${escapeHtml(tag)}</span>`).join("");
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
      return window.confirm("Confirmación final: esta acción puede afectar contenido importante. ¿Continuar?");
    }
    return true;
  }

  if (currentSafetyMode === "fast" && isMinimalProtectedAction(type)) {
    return window.confirm(`${message}\n\nEsta acción mantiene protección mínima obligatoria.`);
  }

  return true;
}

function setModeButtons() {
  safeModeBtn.classList.toggle("is-active", currentSafetyMode === "safe");
  fastModeBtn.classList.toggle("is-active", currentSafetyMode === "fast");
}

function mapStatusLabel(status) {
  const map = {
    draft: "Borrador",
    published: "Publicado",
    featured: "Destacado",
    archived: "Archivado",
    new: "Nuevo",
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
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return setProjectsMsg(`No se pudieron cargar proyectos: ${error.message}`);
  projectsData = data || [];
  await loadProjectTags();
  renderProjectsList();
  updateDashboardStats();
  renderDashboardRecent();
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
    sb.from("project_history").select("*").order("created_at", { ascending: false }).limit(20),
    sb.from("site_settings_history").select("*").order("created_at", { ascending: false }).limit(10),
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
}

/* =========================
   RENDER
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
  const parts = [`<span class="statusBadge statusBadge--${escapeHtml(project.status || "published")}">${escapeHtml(mapStatusLabel(project.status || "published"))}</span>`];
  tags.slice(0, 3).forEach(tag => {
    parts.push(`<span class="miniTag">${escapeHtml(tag.name)}</span>`);
  });
  return parts.join("");
}

function renderDashboardRecent() {
  const list = projectsData.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);
  if (!list.length) {
    dashboardRecentList.innerHTML = `<div class="emptyState">Todavía no hay proyectos cargados.</div>`;
    return;
  }

  dashboardRecentList.innerHTML = list.map(project => `
    <article class="listCard">
      <div class="listCard__thumb"><img src="${escapeHtml(project.image_url || "")}" alt="${escapeHtml(project.title)}" /></div>
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(project.title)}</div>
        <div class="listCard__meta">${escapeHtml(findCategoryName(project.category_id))} · ${escapeHtml(project.solution_type || "")}</div>
        <div class="listCard__badges">${renderProjectBadges(project)}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-project="${project.id}">Editar</button>
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

  if (!list.length) {
    projectsList.innerHTML = `<div class="emptyState">No hay proyectos para mostrar con esos filtros.</div>`;
    return;
  }

  projectsList.innerHTML = list.map(project => `
    <article class="listCard">
      <div class="listCard__thumb"><img src="${escapeHtml(project.image_url || "")}" alt="${escapeHtml(project.title)}" /></div>
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(project.title)}</div>
        <div class="listCard__meta">${escapeHtml(findCategoryName(project.category_id))} · ${escapeHtml(project.solution_type || "")}</div>
        <div class="listCard__meta">Orden: ${project.order_index ?? 0} · ${formatDate(project.created_at)}</div>
        <div class="listCard__badges">${renderProjectBadges(project)}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-project="${project.id}">Editar</button>
        <button class="btn btn--ghost btn--small" type="button" data-duplicate-project="${project.id}">Duplicar</button>
        <button class="btn btn--ghost btn--small" type="button" data-toggle-project="${project.id}">${project.active ? "Desactivar" : "Activar"}</button>
        <button class="btn btn--danger btn--small" type="button" data-delete-project="${project.id}">Archivar</button>
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
  projectFormTitle.textContent = "Nueva web";
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
  projectAdvancedToggleBtn.textContent = "Abrir ajustes avanzados";
  renderTagPreview();
  setProjectFormMsg("");
  if (projectUploadMsg) setProjectUploadMsg("");
}

function fillProjectForm(project) {
  editingProjectId = project.id;
  projectFormTitle.textContent = "Editar web";
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
    categoriesList.innerHTML = `<div class="emptyState">No hay categorías cargadas.</div>`;
    return;
  }

  categoriesList.innerHTML = list.map(cat => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(cat.name)}</div>
        <div class="listCard__meta">Slug: ${escapeHtml(cat.slug)}</div>
        <div class="listCard__meta">Activa: ${boolText(cat.active)} · Orden: ${cat.order_index ?? 0}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-category="${cat.id}">Editar</button>
        <button class="btn btn--ghost btn--small" type="button" data-toggle-category="${cat.id}">${cat.active ? "Desactivar" : "Activar"}</button>
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
      setCategoriesMsg("Categoría actualizada.");
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
    faqsList.innerHTML = `<div class="emptyState">No hay FAQs cargadas.</div>`;
    return;
  }

  faqsList.innerHTML = list.map(faq => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">${escapeHtml(faq.question)}</div>
        <div class="listCard__meta">${escapeHtml(faq.answer)}</div>
        <div class="listCard__meta">Activa: ${boolText(faq.active)} · Orden: ${faq.order_index ?? 0}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-edit-faq="${faq.id}">Editar</button>
        <button class="btn btn--ghost btn--small" type="button" data-toggle-faq="${faq.id}">${faq.active ? "Desactivar" : "Activar"}</button>
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
      setFaqsMsg("FAQ actualizada.");
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
    projectHistoryList.innerHTML = `<div class="emptyState">No hay historial de proyectos.</div>`;
    return;
  }

  projectHistoryList.innerHTML = projectHistoryData.map(item => {
    const snap = item.snapshot || {};
    const title = snap.title || `Proyecto ${item.project_id}`;
    return `
      <article class="listCard listCard--compact">
        <div class="listCard__body">
          <div class="listCard__title">${escapeHtml(title)}</div>
          <div class="listCard__meta">${escapeHtml(item.action_type)} · ${formatDate(item.created_at)}</div>
          <div class="listCard__meta">Por: ${escapeHtml(item.changed_by || "admin")}</div>
        </div>
        <div class="listCard__actions">
          <button class="btn btn--ghost btn--small" type="button" data-restore-project-history="${item.id}">Restaurar</button>
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
    settingsHistoryList.innerHTML = `<div class="emptyState">No hay historial de settings.</div>`;
    return;
  }

  settingsHistoryList.innerHTML = settingsHistoryData.map(item => `
    <article class="listCard listCard--compact">
      <div class="listCard__body">
        <div class="listCard__title">Settings globales</div>
        <div class="listCard__meta">${escapeHtml(item.action_type)} · ${formatDate(item.created_at)}</div>
        <div class="listCard__meta">Por: ${escapeHtml(item.changed_by || "admin")}</div>
      </div>
      <div class="listCard__actions">
        <button class="btn btn--ghost btn--small" type="button" data-restore-settings-history="${item.id}">Restaurar</button>
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

  setProjectsMsg("Proyecto restaurado.");
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
  setSiteSettingsMsg("Settings restaurados.");
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
  setProjectUploadMsg("Subiendo imagen...", "success");

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
    setProjectUploadMsg("Imagen subida y URL completada.", "success");
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
  projectAdvancedToggleBtn.textContent = open ? "Abrir ajustes avanzados" : "Cerrar ajustes avanzados";
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

  if (!image_url) return setProjectFormMsg("Falta la URL de imagen.");
  if (!title) return setProjectFormMsg("Falta el título.");
  if (!demo_url) return setProjectFormMsg("Falta el link demo.");
  if (!category_id) return setProjectFormMsg("Elegí una categoría.");
  if (!solution_type) return setProjectFormMsg("Elegí un tipo de solución.");
  if (!short_description) return setProjectFormMsg("Falta la descripción corta.");

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
    setProjectFormMsg("Proyecto publicado.");
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

    setProjectFormMsg("Proyecto actualizado.");
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
  setProjectsMsg("Proyecto actualizado.");
  await loadProjects();
  await loadHistory();
}

async function deleteProject(project) {
  const ok = await confirmAction({
    message: `¿Archivar "${project.title}"? No se borra físico, se oculta y queda restaurable.`,
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
  setProjectsMsg("Proyecto archivado.");
  await loadProjects();
  await loadHistory();
  resetProjectForm();
  switchView("projects");
}

async function duplicateProject(project) {
  const ok = await confirmAction({ message: `¿Duplicar "${project.title}"?`, type: "generic" });
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

  setProjectsMsg("Proyecto duplicado.");
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
  if (!name) return setCategoriesMsg("Falta el nombre.");
  if (!slug) return setCategoriesMsg("Falta el slug.");

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
    setCategoriesMsg("Categoría creada.");
  } else {
    const { error } = await sb.from("categories").update(payload).eq("id", editingCategoryId);
    if (error) return setCategoriesMsg(`No se pudo actualizar la categoría: ${error.message}`);
    setCategoriesMsg("Categoría actualizada.");
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
  if (!question) return setFaqsMsg("Falta la pregunta.");
  if (!answer) return setFaqsMsg("Falta la respuesta.");

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
    setFaqsMsg("FAQ creada.");
  } else {
    const { error } = await sb.from("faqs").update(payload).eq("id", editingFaqId);
    if (error) return setFaqsMsg(`No se pudo actualizar la FAQ: ${error.message}`);
    setFaqsMsg("FAQ actualizada.");
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
  if (!id) return setSiteContentMsg("Elegí un bloque.");

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

  setSiteContentMsg("Bloque actualizado.");
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

  setSiteSettingsMsg("Settings globales actualizados.");
  await loadSiteSettings();
  await loadHistory();
});

/* =========================
   HISTORY
========================= */
historyRefreshBtn.addEventListener("click", loadHistory);

/* =========================
   NAV
========================= */
navBtns.forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

/* =========================
   INIT
========================= */
guardAdmin();
 