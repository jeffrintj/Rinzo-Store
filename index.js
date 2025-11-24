const CART_KEY = 'rinzo_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);

    if (existing) {
        existing.qty = (existing.qty || 0) + 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart(cart);
    // removed badge update completely
}

// completely removed the badge system
function updateCartBadge() {
    // delete leftover badge if it exists
    const existing = document.getElementById('cart-badge');
    if (existing && existing.parentElement) {
        existing.remove();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const id = card.getAttribute('data-id');
            const title = card.getAttribute('data-title');
            const price = Number(card.getAttribute('data-price')) || 0;
            const image = card.getAttribute('data-image') || card.querySelector('img')?.src || '';

            addToCart({ id, title, price, image });

            // button feedback
            const oldText = e.target.innerText;
            e.target.innerText = 'Added ✓';
            e.target.disabled = true;

            setTimeout(() => {
                e.target.innerText = oldText;
                e.target.disabled = false;
            }, 900);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            // if click was on the Add to cart button, do NOT navigate
            if (e.target.closest('.add-to-cart')) {
                return;
            }
            const id = card.getAttribute('data-id');
            if (!id) return;
            // go to the product page with this id
            window.location.href = 'product.html?id=' + encodeURIComponent(id);
        });
    });
});