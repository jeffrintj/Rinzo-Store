const CART_KEY = 'rinzo_cart';

function getCartRaw() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { console.error('Failed to read cart', e); return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function sanitizeCart() {
  const raw = getCartRaw();
  const cleaned = (raw || []).filter(it => it && it.id !== undefined && it.id !== null)
    .map(it => {
      const id = String(it.id);
      // drop items with id that are empty or literally "null"/"undefined"
      if (!id || id === 'null' || id === 'undefined') return null;
      const qty = Math.max(1, Number(it.qty) || 1);
      const price = Number(it.price) || 0;
      return {
        id,
        title: it.title || 'Product',
        image: it.image || './img/placeholder.png',
        price,
        qty
      };
    })
    .filter(Boolean);
  saveCart(cleaned);
  return cleaned;
}

/* Renders either the empty state or the cart table inside #cart-content */
function renderCart() {
  // sanitize and get cart
  const cart = sanitizeCart();
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div class="cart-ill" aria-hidden="true">
        <img src="./img/shopping-bag.png" alt="Empty bag illustration" class="cart-ill-img">
      </div>
      <h3 style="font-weight:600;">Hey, your bag feels so light!</h3>
      <p class="lead">Let's add some items in your bag</p>
      <div class="d-flex justify-content-center">
        <a href="index.html" class="btn btn-start">START SHOPPING</a>
      </div>
    `;
    return;
  }

  let grandTotal = 0;
  let rows = cart.map(it => {
    const qty = Number(it.qty) || 1;
    const price = Number(it.price) || 0;
    const itemTotal = price * qty;
    grandTotal += itemTotal;
    return `
      <tr data-id="${it.id}">
        <td style="width:100px"><img src="${it.image}" alt="${escapeHtml(it.title)}" style="width:90px; height:90px; object-fit:cover;"></td>
        <td>${escapeHtml(it.title)}</td>
        <td>
          <div class="input-group input-group-sm" style="max-width:120px;">
            <button class="btn btn-outline-secondary btn-decrease" type="button">−</button>
            <input type="text" class="form-control text-center qty-input" value="${qty}">
            <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
          </div>
        </td>
        <td>₹ ${price.toFixed(0)}</td>
        <td>₹ ${itemTotal.toFixed(0)}</td>
        <td><button class="btn btn-sm btn-outline-danger btn-remove">Remove</button></td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="cart-items py-4">
      <h3 class="mb-3">Your Bag</h3>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th></th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-end">
        <div style="max-width:320px; text-align:right;">
          <div style="font-weight:600; font-size:1.15rem;">Grand Total: ₹ ${grandTotal.toFixed(0)}</div>
          <a href="checkout.html" class="btn btn-primary btn-lg mt-3 w-100">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  `;

  attachCartListeners();
}

/* basic HTML escape for titles */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* Event listeners for controls (increase/decrease/remove/qty input) */
function attachCartListeners() {
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      let cart = getCartRaw().map(it => ({ ...it, id: String(it.id) }));
      cart = cart.filter(i => String(i.id) !== id); // compare as strings
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.btn-increase').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const cart = getCartRaw().map(it => ({ ...it, id: String(it.id) }));
      const it = cart.find(x => String(x.id) === id);
      if (it) { it.qty = (Number(it.qty) || 0) + 1; saveCart(cart); renderCart(); }
    });
  });

  document.querySelectorAll('.btn-decrease').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const cart = getCartRaw().map(it => ({ ...it, id: String(it.id) }));
      const it = cart.find(x => String(x.id) === id);
      if (it) {
        it.qty = Math.max(1, (Number(it.qty) || 1) - 1);
        saveCart(cart);
        renderCart();
      }
    });
  });

  document.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', function (e) {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const val = parseInt(e.target.value) || 1;
      const cart = getCartRaw().map(it => ({ ...it, id: String(it.id) }));
      const it = cart.find(x => String(x.id) === id);
      if (it) {
        it.qty = Math.max(1, val);
        saveCart(cart);
        renderCart();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderCart();
});
