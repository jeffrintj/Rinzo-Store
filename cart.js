const CART_KEY = 'rinzo_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(n) { return '₹ ' + Math.round(n); }

function renderCartSimple() {
  const cart = getCart();
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (!cart.length) {
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

  let total = 0;
  const rows = cart.map(it => {
    const qty = Number(it.qty) || 1;
    const price = Number(it.price) || 0;
    const itemTotal = qty * price;
    total += itemTotal;
    return `
      <tr data-id="${it.id}">
        <td style="width:100px"><img src="${it.image}" alt="${it.title}" style="width:90px; height:90px; object-fit:cover;"></td>
        <td>${it.title}</td>
        <td>
          <div class="input-group input-group-sm" style="max-width:120px;">
            <button class="btn btn-outline-secondary btn-decrease" type="button">−</button>
            <input type="text" class="form-control text-center qty-input" value="${qty}">
            <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
          </div>
        </td>
        <td>${formatPrice(price)}</td>
        <td>${formatPrice(itemTotal)}</td>
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
          <div style="font-weight:600; font-size:1.15rem;">Grand Total: ${formatPrice(total)}</div>
          <a href="checkout.html" class="btn btn-primary btn-lg mt-3 w-100">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  `;

  // attach listeners
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.closest('tr').getAttribute('data-id');
      const updated = getCart().filter(x => String(x.id) !== String(id));
      saveCart(updated);
      renderCartSimple();
    });
  });

  document.querySelectorAll('.btn-increase').forEach(btn => {
    btn.addEventListener('click', e => {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      const cart = getCart();
      const item = cart.find(x => String(x.id) === String(id));
      if (item) { item.qty = (Number(item.qty) || 0) + 1; saveCart(cart); renderCartSimple(); }
    });
  });

  document.querySelectorAll('.btn-decrease').forEach(btn => {
    btn.addEventListener('click', e => {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      const cart = getCart();
      const item = cart.find(x => String(x.id) === String(id));
      if (item) {
        item.qty = Math.max(1, (Number(item.qty) || 1) - 1);
        saveCart(cart);
        renderCartSimple();
      }
    });
  });

  document.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', e => {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      const val = Math.max(1, parseInt(e.target.value) || 1);
      const cart = getCart();
      const item = cart.find(x => String(x.id) === String(id));
      if (item) { item.qty = val; saveCart(cart); renderCartSimple(); }
    });
  });

}

/* init */
document.addEventListener('DOMContentLoaded', renderCartSimple);
