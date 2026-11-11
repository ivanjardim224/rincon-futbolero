const PRICE = 25;
const WHATSAPP_URL = "https://wa.me/584241568055";
const CART_KEY = "rincon-futbolero-cart-v1";

if (!Array.isArray(window.RINCON_PRODUCTS)) {
  throw new Error("No se pudo cargar el catálogo. Comprueba catalog.js.");
}

const products = window.RINCON_PRODUCTS;
const shirtSizes = ["S", "M", "L", "XL", "Niño"];

function readStoredArray(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key} desde el almacenamiento local.`, error);
    return fallback;
  }
}

function normalizeCart(items) {
  const normalized = new Map();
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const productId = item.productId || item.id;
    const product = products.find((candidate) => candidate.id === productId);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isFinite(quantity) || quantity <= 0) return;
    const size = shirtSizes.includes(item.size) ? item.size : "";
    const key = `${product.id}::${size || "pendiente"}`;
    const existing = normalized.get(key);
    if (existing) {
      existing.quantity += quantity;
      return;
    }
    normalized.set(key, {
      productId: product.id,
      size,
      name: product.name,
      image: product.image,
      quantity,
    });
  });
  return [...normalized.values()];
}

let cart = normalizeCart(readStoredArray(CART_KEY, []));
let currentFilter = "Todas";
let searchQuery = "";

const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
const cartDrawer = document.querySelector("#cart-drawer");
const backdrop = document.querySelector("#drawer-backdrop");
const toast = document.querySelector("#toast");
const shirtPreview = document.querySelector("#shirt-preview");
const openShirtPreviewButton = document.querySelector("#open-shirt-preview");
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function saveArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key} en el almacenamiento local.`, error);
    showToast("No se pudo guardar en este navegador. Libera espacio e inténtalo otra vez.");
    throw error;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function filteredProducts() {
  const query = searchQuery.trim().toLocaleLowerCase("es");
  return products.filter((product) => {
    const matchesCategory = currentFilter === "Todas"
      || (currentFilter === "Otros" ? product.category === "Otros" : product.category === currentFilter);
    const matchesSearch = !query || `${product.name} ${product.team} ${product.player}`.toLocaleLowerCase("es").includes(query);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <span class="product-tag">${escapeHtml(product.tag || "NUEVA")}</span>
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-info-heading"><div><span class="product-team">${escapeHtml(product.team)}</span><h3>${escapeHtml(product.name)}</h3></div><strong class="product-price">$25</strong></div>
        <p class="product-player-name">ESTAMPADO <strong>${escapeHtml(product.player)}</strong></p>
        <div class="product-order">
          <label class="product-size-picker"><span>TALLA</span><select class="product-size" aria-label="Talla para ${escapeHtml(product.name)}"><option value="" selected disabled>Elige talla</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="Niño">Niño</option></select></label>
          <button class="quick-add" type="button" data-add-product="${escapeHtml(product.id)}">＋ Añadir</button>
        </div>
      </div>
      <div class="product-meta"><span>Unisex · Tallas sujetas a disponibilidad</span><span>Precio único</span></div>
    </article>
  `).join("");
  resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "modelo" : "modelos"}`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function cartItemKey(item) {
  return `${item.productId || item.id}::${item.size || "pendiente"}`;
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = itemCount * PRICE;
  document.querySelector("#cart-count").textContent = String(itemCount);
  document.querySelector("#cart-subtotal").textContent = currency.format(subtotal);
  document.querySelector("#cart-total").textContent = currency.format(subtotal);
  document.querySelector("#cart-empty").hidden = itemCount > 0;
  document.querySelector("#cart-summary").hidden = itemCount === 0;
  document.querySelector("#cart-items").innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${escapeHtml(item.image)}" alt="" />
      <div class="cart-item-info"><strong>${escapeHtml(item.name)}</strong><small>Estampado: ${escapeHtml(products.find((product) => product.id === item.productId).player)} · ${currency.format(PRICE)}</small><label class="cart-size-picker"><span>Talla</span><select data-cart-size="${escapeHtml(cartItemKey(item))}" aria-label="Talla para ${escapeHtml(item.name)}"><option value="" ${item.size ? "" : "selected"}>Elige...</option><option value="S" ${item.size === "S" ? "selected" : ""}>S</option><option value="M" ${item.size === "M" ? "selected" : ""}>M</option><option value="L" ${item.size === "L" ? "selected" : ""}>L</option><option value="XL" ${item.size === "XL" ? "selected" : ""}>XL</option><option value="Niño" ${item.size === "Niño" ? "selected" : ""}>Niño</option></select></label><div class="quantity-control"><button type="button" data-cart-change="${escapeHtml(cartItemKey(item))}" data-amount="-1" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button type="button" data-cart-change="${escapeHtml(cartItemKey(item))}" data-amount="1" aria-label="Agregar una unidad">+</button></div></div>
      <button class="remove-cart-item" type="button" data-cart-remove="${escapeHtml(cartItemKey(item))}" aria-label="Eliminar ${escapeHtml(item.name)}">×</button>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function openCart() {
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    const product = products.find((candidate) => candidate.id === addButton.dataset.addProduct);
    if (!product) return;
    const sizePicker = addButton.closest(".product-card").querySelector(".product-size");
    const size = sizePicker.value;
    if (!size) {
      showToast("Elige la talla antes de agregar la camiseta.");
      sizePicker.focus();
      return;
    }
    const key = `${product.id}::${size}`;
    const existing = cart.find((item) => cartItemKey(item) === key);
    if (existing) existing.quantity += 1;
    else cart.push({ productId: product.id, size, name: product.name, image: product.image, quantity: 1 });
    saveArray(CART_KEY, cart);
    renderCart();
    sizePicker.value = "";
    showToast("¡Camiseta añadida a tu carrito!");
  }
});

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderProducts();
});

document.querySelector("#search-input").addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderProducts();
});

document.querySelector("#cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-cart-change]");
  const removeButton = event.target.closest("[data-cart-remove]");
  if (quantityButton) {
    const item = cart.find((candidate) => cartItemKey(candidate) === quantityButton.dataset.cartChange);
    if (item) item.quantity += Number(quantityButton.dataset.amount);
    cart = cart.filter((candidate) => candidate.quantity > 0);
    saveArray(CART_KEY, cart);
    renderCart();
  }
  if (removeButton) {
    cart = cart.filter((item) => cartItemKey(item) !== removeButton.dataset.cartRemove);
    saveArray(CART_KEY, cart);
    renderCart();
  }
});

document.querySelector("#cart-items").addEventListener("change", (event) => {
  const sizePicker = event.target.closest("[data-cart-size]");
  if (!sizePicker) return;
  const item = cart.find((candidate) => cartItemKey(candidate) === sizePicker.dataset.cartSize);
  if (!item) return;
  item.size = sizePicker.value;
  const matchingItem = cart.find((candidate) => candidate !== item
    && cartItemKey(candidate) === cartItemKey(item));
  if (matchingItem) {
    matchingItem.quantity += item.quantity;
    cart = cart.filter((candidate) => candidate !== item);
  }
  saveArray(CART_KEY, cart);
  renderCart();
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (cart.length === 0) return;
  const itemWithoutSize = cart.find((item) => !item.size);
  if (itemWithoutSize) {
    showToast("Selecciona la talla de cada camiseta antes de continuar.");
    document.querySelector("#cart-items [data-cart-size]").focus();
    return;
  }
  const lines = cart.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return `• ${item.quantity} x ${item.name} · Estampado: ${product.player} · Talla ${item.size} — ${currency.format(item.quantity * PRICE)}`;
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * PRICE, 0);
  const message = `¡Hola, Rincón Futbolero! Quiero consultar este pedido:\n\n${lines.join("\n")}\n\nTotal: ${currency.format(total)}\n¿Me confirman disponibilidad y tallas?`;
  window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
openShirtPreviewButton.addEventListener("click", () => {
  shirtPreview.hidden = false;
  document.body.classList.add("image-modal-open");
  shirtPreview.focus();
});
document.querySelector("#close-shirt-preview").addEventListener("click", closeShirtPreview);
shirtPreview.addEventListener("click", (event) => {
  if (event.target === shirtPreview) closeShirtPreview();
});
document.querySelector("#browse-products").addEventListener("click", () => {
  closeCart();
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});
backdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.getAttribute("aria-hidden") === "false") closeCart();
  if (event.key === "Escape" && !shirtPreview.hidden) closeShirtPreview();
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

function closeShirtPreview() {
  shirtPreview.hidden = true;
  document.body.classList.remove("image-modal-open");
  openShirtPreviewButton.focus();
}

renderProducts();
renderCart();
