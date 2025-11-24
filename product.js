const CART_KEY = 'rinzo_cart';

const PRODUCTS = [
    {
        id: 'p1',
        title: 'Ninja Cops: Azure',
        price: 1999,
        image: 'img/homepage2nd_slide4.jpg',
        thumbs: [
            'img/homepage2nd_slide4.jpg',
            'img/product_thumbnail_1.avif'
        ],
        desc: 'Cozy hoodie with bold print.'
    },
    {
        id: 'p2',
        title: 'Hooded Sweater: Nova',
        price: 2499,
        image: 'img/homepage2nd_slide2.jpg',
        thumbs: [
            'img/homepage2nd_slide2.jpg',
            'img/product_thumbnail_2.avif'
        ],
        desc: 'Soft pullover, everyday fit.'
    },
    {
        id: 'p3',
        title: "Naruto Shippuden: Itachi\'s Story",
        price: 2499,
        image: 'img/homepage2nd_slide1.jpg',
        thumbs: [
            'img/homepage2nd_slide1.jpg',
            'img/product_thumbnail_3.avif'
        ],
        desc: 'Anime inspired premium hoodie.'
    },
    {
        id: 'p4',
        title: 'Hooded Pullover: Slate',
        price: 1999,
        image: 'img/homepage2nd_slide3.jpg',
        thumbs: [
            'img/homepage2nd_slide3.jpg',
            'img/product_thumbnail_4.avif'
        ],
        desc: 'Minimal design, relaxed fit.'
    }
];

function getParamId() {
    try {
        return new URLSearchParams(window.location.search).get('id');
    } catch (e) {
        return null;
    }
}

function findProduct(id) {
    return PRODUCTS.find(p => String(p.id) === String(id));
}

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

function addToCart(product, qty) {
    const cart = getCart();
    const existing = cart.find(i => String(i.id) === String(product.id));

    if (existing) {
        existing.qty = (Number(existing.qty) || 0) + qty;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            qty
        });
    }

    saveCart(cart);
}

function renderNotFound() {
    const container = document.getElementById('product-content');
    container.innerHTML = `
    <div class="text-center py-5">
      <h3>Product not found</h3>
      <p class="text-secondary">The product you requested does not exist.</p>
      <a href="index.html" class="btn btn-warning mt-3">Back to shop</a>
    </div>
  `;
}

function renderProduct(product) {
    const container = document.getElementById('product-content');

    container.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-6">
        <div class="product-gallery">
          <img id="main-image" src="${product.image}" alt="${product.title}" class="img-fluid rounded">
          <div class="mt-3 thumbs d-flex gap-2">
                 ${product.thumbs.map(t => `
                  <img src="${t}" 
                   data-src="${t}" 
                   class="rounded border" 
                   style="width:70px; height:70px; object-fit:cover; cursor:pointer;">
               `).join('')}
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <h2>${product.title}</h2>
        <div class="mb-2 text-muted">${product.desc}</div>
        <div class="mb-3" style="font-weight:600; font-size:1.25rem;">₹ ${product.price}</div>

        <div class="mb-3 d-flex gap-2" style="max-width:220px;">
          <input id="qty" type="number" min="1" value="1" class="form-control">
          <button id="addBtn" class="btn btn-warning">Add to cart</button>
        </div>

        <div id="feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

    document.querySelectorAll('.thumbs img').forEach(img => {
        img.addEventListener('click', e => {
            const src = e.target.dataset.src;
            document.getElementById('main-image').src = src;
        });
    });

    document.getElementById('addBtn').addEventListener('click', () => {
        const qtyInput = document.getElementById('qty');
        const qty = Math.max(1, Number(qtyInput.value) || 1);
        addToCart(product, qty);

        const fb = document.getElementById('feedback');
        fb.innerText = 'Added to cart ✓';
        setTimeout(() => { fb.innerText = ''; }, 900);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const id = getParamId();
    const product = id ? findProduct(id) : null;

    if (!product) {
        renderNotFound();
    } else {
        renderProduct(product);
    }
});
