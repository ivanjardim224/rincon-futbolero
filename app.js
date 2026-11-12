const REGULAR_PRICE = 25;
const RETRO_PRICE = 28;
const TRAINING_PRICE = 30;
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
    const savedPlayer = typeof item.playerName === "string" ? item.playerName.trim() : product.player;
    const playerOption = product.printOptions.find((option) => option.name === savedPlayer);
    const customNumber = typeof item.jerseyNumber === "string" && /^\d{1,2}$/.test(item.jerseyNumber)
      ? item.jerseyNumber
      : "";
    const hasNoPrint = product.type === "training" || product.noPrint;
    const playerName = hasNoPrint
      ? "Sin dorsal"
      : playerOption?.name || (product.type !== "retro" && savedPlayer ? savedPlayer : product.player);
    const jerseyNumber = hasNoPrint
      ? ""
      : playerOption?.number || (playerName === savedPlayer && customNumber)
        || product.printOptions.find((option) => option.name === product.player).number;
    const key = `${product.id}::${size || "pendiente"}::${playerName.toLocaleLowerCase("es")}::${jerseyNumber}`;
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
      playerName,
      jerseyNumber,
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
const productPrice = (product) => product.type === "retro"
  ? RETRO_PRICE
  : product.type === "training" ? TRAINING_PRICE : REGULAR_PRICE;
const printDescription = (item) => item.jerseyNumber ? `${item.playerName} · #${item.jerseyNumber}` : "Sin dorsal";

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

function renderFilters() {
  const featuredTeams = ["Barcelona", "Real Madrid", "AC Milan"];
  const teams = [...new Set(products.map((product) => product.team))];
  const orderedTeams = [
    ...featuredTeams.filter((team) => teams.includes(team)),
    ...teams.filter((team) => !featuredTeams.includes(team)).sort((first, second) => first.localeCompare(second, "es")),
  ];
  document.querySelector("#filters").insertAdjacentHTML(
    "beforeend",
    orderedTeams.map((team) => `<button type="button" class="filter-chip" data-filter="${escapeHtml(team)}">${escapeHtml(team)}</button>`).join(""),
  );
}

function filteredProducts() {
  const query = searchQuery.trim().toLocaleLowerCase("es");
  return products.filter((product) => {
    const matchesTeam = currentFilter === "Todas" || product.team === currentFilter;
    const playerNames = product.printOptions.map((option) => option.name).join(" ");
    const matchesSearch = !query || `${product.name} ${product.team} ${playerNames}`.toLocaleLowerCase("es").includes(query);
    return matchesTeam && matchesSearch;
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
        <div class="product-info-heading"><div><span class="product-team">${escapeHtml(product.team)} · ${product.type === "retro" ? "RETRO" : product.type === "training" ? "ENTRENAMIENTO" : product.noPrint ? "EDICIÓN ESPECIAL" : "TEMPORADA"}</span><h3>${escapeHtml(product.name)}</h3></div><strong class="product-price">${currency.format(productPrice(product))}</strong></div>
        <button class="product-detail-button" type="button" data-product-details="${escapeHtml(product.id)}">Ver camiseta en detalle <span aria-hidden="true">⌕</span></button>
        <div class="product-order">
          <label class="product-size-picker"><span>TALLA</span><select class="product-size" aria-label="Talla para ${escapeHtml(product.name)}"><option value="" selected disabled>Elige talla</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="Niño">Niño</option></select></label>
          ${product.type === "training" || product.noPrint
    ? `<div class="training-no-dorsal">${product.type === "training" ? "Suéter de entrenamiento · Sin dorsal" : "Sin dorsal ni estampado"}</div>`
    : `<label class="product-print-picker"><span>${product.type === "retro" ? "ESTAMPADO RETRO" : "JUGADOR · DORSAL INCLUIDO"}</span><select class="product-player-select" aria-label="Jugador y dorsal para ${escapeHtml(product.name)}" ${product.type === "retro" ? "disabled" : ""}>${product.printOptions.map((option) => `<option value="${escapeHtml(option.name)}" data-jersey-number="${escapeHtml(option.number)}" ${option.name === product.player ? "selected" : ""}>${escapeHtml(option.name)} · #${escapeHtml(option.number)}</option>`).join("")}${product.type === "retro" ? "" : '<option value="__other__">Otro jugador</option>'}</select></label>`}
          ${product.type === "retro" ? "" : `<div class="other-player-fields" hidden><label class="product-print-picker"><span>NOMBRE DEL JUGADOR</span><input class="other-player-name" type="text" maxlength="30" autocomplete="off" placeholder="Escribe el nombre" aria-label="Nombre del otro jugador para ${escapeHtml(product.name)}" /></label><label class="product-print-picker"><span>DORSAL</span><input class="other-player-number" type="text" inputmode="numeric" maxlength="2" pattern="[0-9]{1,2}" placeholder="Ej. 10" aria-label="Dorsal del otro jugador para ${escapeHtml(product.name)}" /></label></div>`}
          <button class="quick-add" type="button" data-add-product="${escapeHtml(product.id)}">＋ Añadir</button>
        </div>
      </div>
      <div class="product-meta"><span>Unisex · Tallas sujetas a disponibilidad</span><span>${product.type === "retro" ? "Colección retro" : product.type === "training" || product.noPrint ? "Sin dorsal" : "Temporada regular"}</span></div>
    </article>
  `).join("");
  resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "modelo" : "modelos"}`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function cartItemKey(item) {
  return `${item.productId || item.id}::${item.size || "pendiente"}::${(item.playerName || "").toLocaleLowerCase("es")}::${item.jerseyNumber || ""}`;
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return total + item.quantity * productPrice(product);
  }, 0);
  document.querySelector("#cart-count").textContent = String(itemCount);
  document.querySelector("#cart-subtotal").textContent = currency.format(subtotal);
  document.querySelector("#cart-total").textContent = currency.format(subtotal);
  document.querySelector("#cart-empty").hidden = itemCount > 0;
  document.querySelector("#cart-summary").hidden = itemCount === 0;
  document.querySelector("#cart-items").innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${escapeHtml(item.image)}" alt="" />
      <div class="cart-item-info"><strong>${escapeHtml(item.name)}</strong><small>Estampado: ${escapeHtml(printDescription(item))} · ${currency.format(productPrice(products.find((product) => product.id === item.productId)))}</small><label class="cart-size-picker"><span>Talla</span><select data-cart-size="${escapeHtml(cartItemKey(item))}" aria-label="Talla para ${escapeHtml(item.name)}"><option value="" ${item.size ? "" : "selected"}>Elige...</option><option value="S" ${item.size === "S" ? "selected" : ""}>S</option><option value="M" ${item.size === "M" ? "selected" : ""}>M</option><option value="L" ${item.size === "L" ? "selected" : ""}>L</option><option value="XL" ${item.size === "XL" ? "selected" : ""}>XL</option><option value="Niño" ${item.size === "Niño" ? "selected" : ""}>Niño</option></select></label><div class="quantity-control"><button type="button" data-cart-change="${escapeHtml(cartItemKey(item))}" data-amount="-1" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button type="button" data-cart-change="${escapeHtml(cartItemKey(item))}" data-amount="1" aria-label="Agregar una unidad">+</button></div></div>
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
  const detailsButton = event.target.closest("[data-product-details]");
  if (detailsButton) {
    const product = products.find((candidate) => candidate.id === detailsButton.dataset.productDetails);
    if (product) openProductPreview(product, detailsButton);
    return;
  }
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    const product = products.find((candidate) => candidate.id === addButton.dataset.addProduct);
    if (!product) return;
    const card = addButton.closest(".product-card");
    const sizePicker = card.querySelector(".product-size");
    const playerPicker = card.querySelector(".product-player-select");
    const size = sizePicker.value;
    if (!size) {
      showToast("Elige la talla antes de agregar la camiseta.");
      sizePicker.focus();
      return;
    }
    const hasNoPrint = product.type === "training" || product.noPrint;
    const isCustomPlayer = !hasNoPrint && playerPicker.value === "__other__";
    const customFields = card.querySelector(".other-player-fields");
    const customName = customFields?.querySelector(".other-player-name");
    const customNumber = customFields?.querySelector(".other-player-number");
    const playerName = hasNoPrint ? "Sin dorsal" : isCustomPlayer ? customName.value.trim() : playerPicker.value;
    const jerseyNumber = hasNoPrint ? "" : isCustomPlayer ? customNumber.value.trim() : playerPicker.selectedOptions[0].dataset.jerseyNumber;
    if (isCustomPlayer && !playerName) {
      showToast("Escribe el nombre del jugador.");
      customName.focus();
      return;
    }
    if (isCustomPlayer && !/^\d{1,2}$/.test(jerseyNumber)) {
      showToast("Escribe un dorsal válido de 0 a 99.");
      customNumber.focus();
      return;
    }
    const key = cartItemKey({ productId: product.id, size, playerName, jerseyNumber });
    const existing = cart.find((item) => cartItemKey(item) === key);
    if (existing) existing.quantity += 1;
    else cart.push({ productId: product.id, size, name: product.name, image: product.image, playerName, jerseyNumber, quantity: 1 });
    saveArray(CART_KEY, cart);
    renderCart();
    sizePicker.value = "";
    if (playerPicker) playerPicker.value = product.player;
    if (customFields) {
      customName.value = "";
      customNumber.value = "";
      customFields.hidden = true;
    }
    showToast("¡Camiseta añadida a tu carrito!");
  }
});

productGrid.addEventListener("change", (event) => {
  const playerPicker = event.target.closest(".product-player-select");
  if (!playerPicker) return;
  const customFields = playerPicker.closest(".product-order").querySelector(".other-player-fields");
  if (customFields) customFields.hidden = playerPicker.value !== "__other__";
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
    return `• ${item.quantity} x ${item.name} · Estampado: ${printDescription(item)} · Talla ${item.size} — ${currency.format(item.quantity * productPrice(product))}`;
  });
  const total = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + item.quantity * productPrice(product);
  }, 0);
  const message = `¡Hola, Rincón Futbolero! Quiero consultar este pedido:\n\n${lines.join("\n")}\n\nTotal: ${currency.format(total)}\n¿Me confirman disponibilidad y tallas?`;
  window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
openShirtPreviewButton.addEventListener("click", () => {
  previewReturnFocus = openShirtPreviewButton;
  document.querySelector("#shirt-preview-title").textContent = "Camiseta del Real Madrid";
  document.querySelector("#shirt-preview-image").src = openShirtPreviewButton.querySelector("img").src;
  document.querySelector("#shirt-preview-image").alt = "Camiseta del Real Madrid ampliada";
  document.querySelector("#shirt-preview-details").hidden = true;
  document.querySelector("#shirt-preview-gallery").hidden = true;
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

let previewReturnFocus = openShirtPreviewButton;

function openProductPreview(product, trigger) {
  previewReturnFocus = trigger;
  const images = [product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])];
  const previewImage = document.querySelector("#shirt-preview-image");
  document.querySelector("#shirt-preview-title").textContent = product.name;
  previewImage.src = product.image;
  previewImage.alt = `${product.name}, vista ampliada`;
  const details = document.querySelector("#shirt-preview-details");
  const availablePlayers = product.printOptions.map((option) => `${option.name} #${option.number}`).join(", ");
  const productDescription = product.type === "training"
    ? "Suéter de entrenamiento sin dorsal ni personalización"
    : product.noPrint
      ? "Edición floral sin dorsal ni estampado"
    : product.type === "retro"
      ? `Estampado retro fijo: ${availablePlayers}`
      : `Elige un jugador o escribe otro con su dorsal: ${availablePlayers}`;
  const productType = product.type === "retro" ? "Retro" : product.type === "training" ? "Entrenamiento" : "Temporada regular";
  details.innerHTML = `<span>${escapeHtml(product.team)} · ${productType}</span><strong>${currency.format(productPrice(product))}</strong><small>${escapeHtml(productDescription)} · Tallas S, M, L, XL y Niño (sujetas a disponibilidad).</small>`;
  details.hidden = false;
  const gallery = document.querySelector("#shirt-preview-gallery");
  gallery.innerHTML = images.length > 1
    ? images.map((image, index) => `<button class="preview-thumbnail${index === 0 ? " active" : ""}" type="button" data-preview-image="${escapeHtml(image)}" aria-label="Ver imagen ${index + 1} de ${escapeHtml(product.name)}"><img src="${escapeHtml(image)}" alt="" /></button>`).join("")
    : "";
  gallery.hidden = images.length < 2;
  shirtPreview.hidden = false;
  document.body.classList.add("image-modal-open");
  shirtPreview.focus();
}

document.querySelector("#shirt-preview-gallery").addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-preview-image]");
  if (!thumbnail) return;
  document.querySelector("#shirt-preview-image").src = thumbnail.dataset.previewImage;
  document.querySelectorAll(".preview-thumbnail").forEach((button) => button.classList.toggle("active", button === thumbnail));
});

function closeShirtPreview() {
  shirtPreview.hidden = true;
  document.body.classList.remove("image-modal-open");
  previewReturnFocus.focus();
}

renderFilters();
renderProducts();
renderCart();
