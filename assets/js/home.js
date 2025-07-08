document.addEventListener("DOMContentLoaded", function () {
    // Lấy sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Render sản phẩm trong carousel (Gợi Ý Hôm Nay)
    renderCarouselProducts(products.slice(0, 4));

    // Render sản phẩm mới về
    renderNewArrivals(products.slice(4, 8));

    // Gắn sự kiện cho nút thêm vào giỏ hàng
    setupAddToCartButtons();
});

function renderCarouselProducts(products) {
    const container = document.getElementById("productTrack");
    if (!container || products.length === 0) return;

    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
      <div class="product-image">
        <a href="/product-detail.html" class="shop-product-link">
        <img src="${product.image}" alt="${product.name}" />
        <div class="shop-product-content">
          <h4 class="shop-product-name">${product.name}</h4>
          <div class="shop-product-rating">⭐ 4.5/5</div>
          <div class="shop-product-price-group">
            <span class="shop-price-new">${product.price}₫</span>
          </div>
          <div class="shop-product-action">
            <button class="add-to-cart-btn" data-id="${product.id}">🛒</button>
          </div>
        </div>
      </a>
      </div>
    `;
        container.appendChild(card);
    });
}

function renderNewArrivals(products) {
    const container = document.getElementById("newArrivalsList");
    if (!container || products.length === 0) return;

    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "new-arrival-card";
        card.innerHTML = `
      <a href="/product-detail.html" class="shop-product-link">
        <img src="${product.image}" alt="${product.name}" />
        <div class="shop-product-content">
          <h4 class="shop-product-name">${product.name}</h4>
          <div class="shop-product-rating">⭐ 4.5/5</div>
          <div class="shop-product-price-group">
            <span class="shop-price-new">${product.price}₫</span>
          </div>
          <div class="shop-product-action">
            <button class="add-to-cart-btn" data-id="${product.id}">🛒</button>
          </div>
        </div>
      </a>
    `;
        container.appendChild(card);
    });
}

// Hàm gắn sự kiện cho nút thêm vào giỏ hàng
function setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const productId = this.getAttribute("data-id");
            addToCart(productId);
            showAddToCartToast();
        });
    });
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.textContent = total;
}

// Hàm hiển thị thông báo thêm vào giỏ hàng
function showAddToCartToast() {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        // Tạo container nếu chưa có
        const container = document.createElement("div");
        container.id = "toast-container";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast toast--success";
    toast.innerHTML = `
    <div class="toast__icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="toast__body">
      <h3 class="toast__title">Thành công!</h3>
      <p class="toast__msg">Sản phẩm đã được thêm vào giỏ hàng</p>
    </div>
    <div class="toast__close">
      <i class="fas fa-times"></i>
    </div>
  `;

    document.getElementById("toast-container").appendChild(toast);

    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => toast.remove(), 500);
    }, 3000);

    // Xử lý nút đóng
    toast.querySelector(".toast__close").addEventListener("click", () => {
        toast.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => toast.remove(), 500);
    });
}