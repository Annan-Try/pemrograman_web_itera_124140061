/* =========================================================
   Mini POS - Kasir & Keranjang Belanja Sederhana
   =========================================================
   Struktur kode dibagi menjadi beberapa bagian:
   1. State & Konstanta
   2. Referensi Elemen DOM
   3. Util / Helper (format, localStorage)
   4. Validasi Form
   5. Manajemen Keranjang (CRUD + render)
   6. Kalkulator (subtotal, diskon, total, kembalian)
   7. Event Listeners & Inisialisasi
   ========================================================= */

/* ===================== 1. STATE & KONSTANTA ===================== */
const CART_STORAGE_KEY = "miniPos_cart";
const PROMO_CODE = "HEMAT10";
const MIN_NAME_LENGTH = 3;
const MIN_PRICE = 500;
const MIN_QTY = 1;
const AUTO_DISCOUNT_THRESHOLD = 50000;
const DISCOUNT_PERCENT = 10;

let cart = [];
let isPromoApplied = false;
let currentFinalTotal = 0;

/* ===================== 2. REFERENSI ELEMEN DOM ===================== */
const itemForm = document.getElementById("item-form");
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const qtyInput = document.getElementById("item-qty");

const errorName = document.getElementById("error-name");
const errorPrice = document.getElementById("error-price");
const errorQty = document.getElementById("error-qty");

const cartBody = document.getElementById("cart-body");
const emptyCartMessage = document.getElementById("empty-cart-message");
const cartTable = document.getElementById("cart-table");

const btnReset = document.getElementById("btn-reset");

const promoInput = document.getElementById("promo-code");
const btnApplyPromo = document.getElementById("btn-apply-promo");
const promoMessage = document.getElementById("promo-message");

const summarySubtotal = document.getElementById("summary-subtotal");
const summaryDiscount = document.getElementById("summary-discount");
const summaryTotal = document.getElementById("summary-total");
const discountPercentLabel = document.getElementById("discount-percent");

const paymentInput = document.getElementById("payment-amount");
const summaryChange = document.getElementById("summary-change");
const paymentMessage = document.getElementById("payment-message");
const changeRow = document.querySelector(".change-row");

/* ===================== 3. UTIL / HELPER ===================== */

/** Format angka menjadi format Rupiah, mis. 15000 -> "Rp 15.000" */
function formatRupiah(number) {
  const value = Number.isFinite(number) ? number : 0;
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

/** Membuat ID unik sederhana untuk setiap item keranjang */
function generateItemId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Memuat data keranjang dari localStorage */
function loadCartFromStorage() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  try {
    cart = stored ? JSON.parse(stored) : [];
  } catch (err) {
    cart = [];
  }
}

/** Menyimpan data keranjang saat ini ke localStorage */
function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/* ===================== 4. VALIDASI FORM ===================== */

/**
 * Memvalidasi input form barang.
 * Mengembalikan objek { valid: boolean, errors: { name, price, qty } }
 */
function validateItemForm(name, priceRaw, qtyRaw) {
  const errors = { name: "", price: "", qty: "" };
  let valid = true;

  if (!name || name.trim().length < MIN_NAME_LENGTH) {
    errors.name = `Nama barang wajib diisi, minimal ${MIN_NAME_LENGTH} karakter.`;
    valid = false;
  }

  const price = Number(priceRaw);
  if (priceRaw === "" || Number.isNaN(price) || price < MIN_PRICE) {
    errors.price = `Harga wajib berupa angka positif, minimal Rp ${MIN_PRICE.toLocaleString("id-ID")}.`;
    valid = false;
  }

  const qty = Number(qtyRaw);
  if (qtyRaw === "" || Number.isNaN(qty) || !Number.isInteger(qty) || qty < MIN_QTY) {
    errors.qty = `Qty wajib berupa angka bulat, minimal ${MIN_QTY}.`;
    valid = false;
  }

  return { valid, errors };
}

/** Menampilkan pesan error di bawah masing-masing input */
function displayFormErrors(errors) {
  errorName.textContent = errors.name;
  errorPrice.textContent = errors.price;
  errorQty.textContent = errors.qty;

  nameInput.classList.toggle("input-error", Boolean(errors.name));
  priceInput.classList.toggle("input-error", Boolean(errors.price));
  qtyInput.classList.toggle("input-error", Boolean(errors.qty));
}

/** Membersihkan seluruh pesan error form */
function clearFormErrors() {
  displayFormErrors({ name: "", price: "", qty: "" });
}

/* ===================== 5. MANAJEMEN KERANJANG ===================== */

/** Menangani submit form tambah barang */
function handleAddItem(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const priceRaw = priceInput.value;
  const qtyRaw = qtyInput.value;

  const { valid, errors } = validateItemForm(name, priceRaw, qtyRaw);
  clearFormErrors();

  if (!valid) {
    displayFormErrors(errors);
    return;
  }

  const newItem = {
    id: generateItemId(),
    name,
    price: Number(priceRaw),
    qty: Number(qtyRaw),
  };

  cart.push(newItem);
  saveCartToStorage();
  renderCart();

  itemForm.reset();
  nameInput.focus();
}

/** Menghapus item dari keranjang berdasarkan ID, lalu hitung ulang total */
function deleteItemFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCartToStorage();
  renderCart();
}

/** Mengosongkan keranjang & localStorage untuk memulai transaksi baru */
function resetTransaction() {
  const confirmed = confirm(
    "Yakin ingin memulai transaksi baru? Seluruh keranjang akan dikosongkan."
  );
  if (!confirmed) return;

  cart = [];
  isPromoApplied = false;
  localStorage.removeItem(CART_STORAGE_KEY);

  promoInput.value = "";
  paymentInput.value = "";
  promoMessage.textContent = "";
  promoMessage.className = "info-message";
  paymentMessage.textContent = "";

  renderCart();
}

/** Merender ulang seluruh baris tabel keranjang berdasarkan state `cart` */
function renderCart() {
  cartBody.innerHTML = "";

  const isEmpty = cart.length === 0;
  emptyCartMessage.style.display = isEmpty ? "block" : "none";
  cartTable.style.display = isEmpty ? "none" : "table";

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatRupiah(item.price)}</td>
      <td>${item.qty}</td>
      <td>${formatRupiah(subtotal)}</td>
      <td><button type="button" class="btn btn-delete" data-id="${item.id}">Hapus</button></td>
    `;

    cartBody.appendChild(row);
  });

  // Pasang event listener untuk setiap tombol hapus yang baru dibuat
  cartBody.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteItemFromCart(btn.dataset.id));
  });

  updateCalculations();
}

/** Mencegah injeksi HTML sederhana dari nama barang yang diinput user */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ===================== 6. KALKULATOR ===================== */

/** Menjumlahkan seluruh subtotal barang di keranjang */
function calculateCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/** Menentukan apakah diskon berlaku, lalu hitung total akhir & update tampilan */
function updateCalculations() {
  const subtotal = calculateCartSubtotal();

  let discountPercent = 0;
  if (subtotal >= AUTO_DISCOUNT_THRESHOLD) {
    discountPercent = DISCOUNT_PERCENT;
  }
  if (isPromoApplied) {
    discountPercent = Math.max(discountPercent, DISCOUNT_PERCENT);
  }

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;
  currentFinalTotal = finalTotal;

  summarySubtotal.textContent = formatRupiah(subtotal);
  discountPercentLabel.textContent = discountPercent;
  summaryDiscount.textContent = "- " + formatRupiah(discountAmount);
  summaryTotal.textContent = formatRupiah(finalTotal);

  updatePaymentCalculation();
}

/** Menangani kode promo yang dimasukkan kasir */
function applyPromoCode() {
  const code = promoInput.value.trim().toUpperCase();

  if (code === "") {
    isPromoApplied = false;
    promoMessage.textContent = "";
    promoMessage.className = "info-message";
  } else if (code === PROMO_CODE) {
    isPromoApplied = true;
    promoMessage.textContent = `Kode promo "${PROMO_CODE}" berhasil diterapkan! Diskon ${DISCOUNT_PERCENT}%.`;
    promoMessage.className = "info-message success";
  } else {
    isPromoApplied = false;
    promoMessage.textContent = "Kode promo tidak valid.";
    promoMessage.className = "info-message error";
  }

  updateCalculations();
}

/** Menghitung kembalian berdasarkan uang bayar & total akhir saat ini */
function updatePaymentCalculation() {
  const paidRaw = paymentInput.value;

  if (paidRaw === "") {
    summaryChange.textContent = formatRupiah(0);
    paymentMessage.textContent = "";
    changeRow.classList.remove("insufficient");
    return;
  }

  const paid = Number(paidRaw);
  const change = paid - currentFinalTotal;

  if (Number.isNaN(paid) || change < 0) {
    const shortage = Number.isNaN(paid) ? currentFinalTotal : Math.abs(change);
    summaryChange.textContent = formatRupiah(0);
    paymentMessage.textContent = `Uang belum mencukupi, kurang ${formatRupiah(shortage)}.`;
    changeRow.classList.add("insufficient");
  } else {
    summaryChange.textContent = formatRupiah(change);
    paymentMessage.textContent = "";
    changeRow.classList.remove("insufficient");
  }
}

/* ===================== 7. EVENT LISTENERS & INISIALISASI ===================== */

function initApp() {
  loadCartFromStorage();
  renderCart();

  itemForm.addEventListener("submit", handleAddItem);
  btnReset.addEventListener("click", resetTransaction);
  btnApplyPromo.addEventListener("click", applyPromoCode);
  paymentInput.addEventListener("input", updatePaymentCalculation);
}

document.addEventListener("DOMContentLoaded", initApp);
