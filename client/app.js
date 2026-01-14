// -------------------- CONFIG --------------------
const API_BASE = "http://localhost:3000";
const RESOURCE = "products";

// -------------------- DOM --------------------
const listMount = document.getElementById("listMount");
const refreshBtn = document.getElementById("refreshBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// Theme
const themeToggle = document.getElementById("themeToggle");

// Auth
const userPillLabel = document.getElementById("userPillLabel");
const loginCustomerBtn = document.getElementById("loginCustomerBtn");
const loginAdminBtn = document.getElementById("loginAdminBtn");
const logoutBtn = document.getElementById("logoutBtn");
const roleLabel = document.getElementById("roleLabel");

// Categories
const catButtons = document.querySelectorAll(".hm-cat");

// Admin panel
const adminAddBtn = document.getElementById("adminAddBtn");
const adminPanel = document.getElementById("adminPanel");
const adminCloseBtn = document.getElementById("adminCloseBtn");

// Form
const form = document.getElementById("productForm");
const editingIdEl = document.getElementById("editingId");
const nameEl = document.getElementById("name");
const categoryEl = document.getElementById("category");
const priceEl = document.getElementById("price");
const imageUrlEl = document.getElementById("imageUrl");
const stockEl = document.getElementById("stock");
const tagColorEl = document.getElementById("tagColor");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

// Feedback modal
const feedbackModal = new bootstrap.Modal(document.getElementById("messageModal"));
const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");

// Cart offcanvas
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");

// -------------------- STATE --------------------
let allProducts = [];
let activeCategory = "Alla";
let role = localStorage.getItem("hm_role") || "guest"; // guest|customer|admin
let cart = loadCart(); // { [id]: qty }

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  syncRoleUI();
  syncCartUI();
  await loadAndRender();
});

// -------------------- THEME --------------------
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("hm_theme", theme);
}
function initTheme() {
  const saved = localStorage.getItem("hm_theme") || "dark";
  setTheme(saved);
  if (themeToggle) themeToggle.checked = (saved === "dark");
}
if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    setTheme(themeToggle.checked ? "dark" : "light");
  });
}

// -------------------- AUTH (UI role) --------------------
function setRole(newRole) {
  role = newRole;
  localStorage.setItem("hm_role", role);
  syncRoleUI();
  renderFromState();
}
function syncRoleUI() {
  const label = role === "admin" ? "Admin" : role === "customer" ? "Kund" : "Profil";
  if (userPillLabel) userPillLabel.textContent = label;
  if (roleLabel) roleLabel.textContent = role === "admin" ? "Admin" : role === "customer" ? "Kund" : "Gäst";

  if (logoutBtn) logoutBtn.classList.toggle("d-none", role === "guest");
  if (adminAddBtn) adminAddBtn.classList.toggle("d-none", role !== "admin");
  if (adminPanel && role !== "admin") adminPanel.classList.add("d-none");
}
if (loginCustomerBtn) loginCustomerBtn.addEventListener("click", () => setRole("customer"));
if (loginAdminBtn) loginAdminBtn.addEventListener("click", () => setRole("admin"));
if (logoutBtn) logoutBtn.addEventListener("click", () => setRole("guest"));

// -------------------- CATEGORY FILTER --------------------
catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category || "Alla";
    renderFromState();
  });
});

// -------------------- UI EVENTS --------------------
if (refreshBtn) refreshBtn.addEventListener("click", loadAndRender);
if (searchInput) searchInput.addEventListener("input", renderFromState);
if (sortSelect) sortSelect.addEventListener("change", renderFromState);

if (adminAddBtn) {
  adminAddBtn.addEventListener("click", () => {
    if (adminPanel) adminPanel.classList.remove("d-none");
    clearForm();
    adminPanel?.scrollIntoView({ behavior: "smooth" });
  });
}
if (adminCloseBtn) adminCloseBtn.addEventListener("click", () => adminPanel?.classList.add("d-none"));
if (clearBtn) clearBtn.addEventListener("click", clearForm);

// -------------------- LOAD PRODUCTS (R) --------------------
async function loadAndRender() {
  try {
    allProducts = await apiGetAll();
    renderFromState();
    // update cart if products refreshed
    syncCartUI();
  } catch (err) {
    showMessage("Fel", err?.message ?? "Kunde inte hämta produkter.");
  }
}

function renderFromState() {
  const q = (searchInput?.value ?? "").trim().toLowerCase();
  let items = [...allProducts];

  if (activeCategory !== "Alla") {
    items = items.filter(p => String(p.category ?? "") === activeCategory);
  }

  if (q) {
    items = items.filter(p =>
      String(p.name ?? "").toLowerCase().includes(q) ||
      String(p.category ?? "").toLowerCase().includes(q)
    );
  }

  items = sortProducts(items, sortSelect?.value ?? "popular");
  renderProducts(items);
}

// List must be created dynamically
function renderProducts(products) {
  listMount.innerHTML = "";

  if (!products.length) {
    listMount.innerHTML = `<div class="alert alert-info">Inga produkter matchar.</div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "row g-3";

  for (const p of products) {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-xl-4";

    const card = document.createElement("div");
    card.className = "card shadow-sm hm-product";
    card.dataset.id = p.id;
    card.style.borderLeftColor = p.tagColor || "#ff3d6a";

    const img = p.imageUrl
      ? `<img class="hm-product__img" src="${escapeAttr(p.imageUrl)}" alt="${escapeAttr(p.name)}">`
      : `<div class="hm-product__img d-flex align-items-center justify-content-center text-muted">Ingen bild</div>`;

    const adminBtns = (role === "admin")
      ? `
        <button class="btn btn-sm btn-outline-secondary js-edit" type="button">Ändra</button>
        <button class="btn btn-sm btn-outline-danger js-delete" type="button">Ta bort</button>
      `
      : "";

    card.innerHTML = `
      <div class="card-body">
        ${img}

        <!-- name + price under image -->
        <div class="mt-3 d-flex justify-content-between align-items-start gap-2">
          <div class="fw-semibold">${escapeHtml(p.name)}</div>
          <div class="fw-bold">${formatSEK(p.price)}</div>
        </div>

        <div class="text-muted small">
          ${escapeHtml(p.category)} • Lager: ${Number(p.stock ?? 0)}
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-sm btn-hm-primary js-addcart" type="button">
            <i class="bi bi-cart-plus me-1"></i> Lägg i varukorg
          </button>

          <div class="d-flex gap-2">
            ${adminBtns}
          </div>
        </div>
      </div>
    `;

    col.appendChild(card);
    grid.appendChild(col);
  }

  listMount.appendChild(grid);
}

// Event delegation for addcart/edit/delete
listMount.addEventListener("click", async (e) => {
  const card = e.target.closest(".hm-product");
  if (!card) return;

  const id = String(card.dataset.id);

  if (e.target.closest(".js-addcart")) {
    addToCart(id, 1);
    return;
  }

  if (role !== "admin") return;

  if (e.target.classList.contains("js-delete")) {
    try {
      await apiDelete(id);
      showMessage("Borttagen", "Produkten togs bort.");
      await loadAndRender();
    } catch (err) {
      showMessage("Fel", err?.message ?? "Kunde inte ta bort.");
    }
  }

  if (e.target.classList.contains("js-edit")) {
    try {
      const product = await apiGetOne(id);
      fillFormForEdit(product);
      adminPanel?.classList.remove("d-none");
      adminPanel?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      showMessage("Fel", err?.message ?? "Kunde inte hämta produkt för edit.");
    }
  }
});

// -------------------- ADMIN FORM (C + U) --------------------
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (role !== "admin") return showMessage("Åtkomst nekad", "Endast admin kan spara produkter.");

    const payload = {
      name: nameEl.value.trim(),
      category: categoryEl.value,
      price: Number(priceEl.value),
      imageUrl: imageUrlEl.value.trim(),
      stock: Number(stockEl.value),
      tagColor: tagColorEl.value
    };

    const editingId = editingIdEl.value.trim();

    try {
      if (editingId) {
        await apiUpdate({ id: Number(editingId), ...payload });
        showMessage("Uppdaterad", "Produkten uppdaterades.");
      } else {
        await apiCreate(payload);
        showMessage("Skapad", "Produkten skapades.");
      }

      clearForm();
      await loadAndRender();
    } catch (err) {
      showMessage("Fel", err?.message ?? "Något gick fel.");
    }
  });
}

function fillFormForEdit(p) {
  editingIdEl.value = p.id;
  nameEl.value = p.name ?? "";
  categoryEl.value = p.category ?? "Övrigt";
  priceEl.value = p.price ?? 0;
  imageUrlEl.value = p.imageUrl ?? "";
  stockEl.value = p.stock ?? 0;
  tagColorEl.value = p.tagColor ?? "#ff3d6a";
  submitBtn.textContent = "Uppdatera";
}

function clearForm() {
  editingIdEl.value = "";
  form.reset();
  tagColorEl.value = "#ff3d6a";
  submitBtn.textContent = "Spara";
}

// -------------------- CART --------------------
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("hm_cart") || "{}");
  } catch {
    return {};
  }
}
function saveCart() {
  localStorage.setItem("hm_cart", JSON.stringify(cart));
}
function getCartCount() {
  return Object.values(cart).reduce((sum, q) => sum + Number(q), 0);
}
function syncCartBadge() {
  const count = getCartCount();
  if (!cartCountEl) return;
  cartCountEl.textContent = String(count);
  cartCountEl.classList.toggle("d-none", count === 0);
}
function syncCartUI() {
  if (!cartItemsEl || !cartTotalEl) return;

  const entries = Object.entries(cart);
  cartItemsEl.innerHTML = "";

  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<div class="text-muted">Varukorgen är tom.</div>`;
    cartTotalEl.textContent = formatSEK(0);
    syncCartBadge();
    return;
  }

  let total = 0;

  for (const [id, qty] of entries) {
    const p = allProducts.find(x => String(x.id) === String(id));
    if (!p) continue;

    const line = Number(p.price ?? 0) * Number(qty);
    total += line;

    const row = document.createElement("div");
    row.className = "d-flex justify-content-between align-items-start gap-2 mb-3";

    row.innerHTML = `
      <div class="flex-grow-1">
        <div class="fw-semibold">${escapeHtml(p.name)}</div>
        <div class="text-muted small">${formatSEK(p.price)} / st</div>

        <div class="d-flex align-items-center gap-2 mt-2">
          <button class="btn btn-sm btn-outline-secondary js-dec" type="button">-</button>
          <span class="fw-semibold">${Number(qty)}</span>
          <button class="btn btn-sm btn-outline-secondary js-inc" type="button">+</button>
          <button class="btn btn-sm btn-outline-danger ms-auto js-remove" type="button">Ta bort</button>
        </div>
      </div>
      <div class="fw-bold text-end">${formatSEK(line)}</div>
    `;

    row.querySelector(".js-dec").addEventListener("click", () => setCartQty(id, Number(qty) - 1));
    row.querySelector(".js-inc").addEventListener("click", () => setCartQty(id, Number(qty) + 1));
    row.querySelector(".js-remove").addEventListener("click", () => removeFromCart(id));

    cartItemsEl.appendChild(row);
  }

  cartTotalEl.textContent = formatSEK(total);
  syncCartBadge();
}

function addToCart(id, qty = 1) {
  cart[id] = (cart[id] || 0) + qty;
  saveCart();
  syncCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  syncCartUI();
}

function setCartQty(id, qty) {
  if (qty <= 0) return removeFromCart(id);
  cart[id] = qty;
  saveCart();
  syncCartUI();
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = {};
    saveCart();
    syncCartUI();
  });
}

// -------------------- HELPERS --------------------
function showMessage(title, body) {
  messageTitle.textContent = title;
  messageBody.textContent = body;
  feedbackModal.show();
}

function sortProducts(items, mode) {
  const arr = [...items];
  if (mode === "priceAsc") arr.sort((a, b) => Number(a.price) - Number(b.price));
  if (mode === "priceDesc") arr.sort((a, b) => Number(b.price) - Number(a.price));
  if (mode === "stockDesc") arr.sort((a, b) => Number(b.stock) - Number(a.stock));
  return arr;
}

function formatSEK(value) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" })
    .format(Number(value ?? 0));
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

// -------------------- API --------------------
async function apiGetAll() {
  const res = await fetch(`${API_BASE}/${RESOURCE}`);
  if (!res.ok) throw new Error("GET /products misslyckades.");
  return res.json();
}

async function apiGetOne(id) {
  const res = await fetch(`${API_BASE}/${RESOURCE}/${id}`);
  if (!res.ok) throw new Error("GET /products/:id misslyckades.");
  return res.json();
}

async function apiCreate(payload) {
  const res = await fetch(`${API_BASE}/${RESOURCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("POST /products misslyckades.");
  return res.json();
}

async function apiUpdate(payload) {
  const res = await fetch(`${API_BASE}/${RESOURCE}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("PUT /products misslyckades.");
  return res.json();
}

async function apiDelete(id) {
  const res = await fetch(`${API_BASE}/${RESOURCE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE /products/:id misslyckades.");
  return res.json();
}
