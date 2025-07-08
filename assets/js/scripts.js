let allProducts = [];

document.addEventListener("DOMContentLoaded", function () {
  setupUserMenu();
  setupCartModal();
  updateCartCount();

  // Khởi tạo sản phẩm từ localStorage
  allProducts = getProducts();
  renderShopProducts(allProducts, 1);

  setupCheckoutHandler();
});

// Hàm khởi tạo nút thanh toán
function setupCheckoutHandler() {
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    window.location.href = "checkout.html";
  });
}

//  Hàm khởi tạo giao diện người dùng
function setupUserMenu() {
  const userDropdown = document.querySelector(".user-dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const userMenu = document.getElementById("user-menu");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Toggle dropdown
  if (userDropdown && dropdownMenu) {
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("show");
    });
  }

  // Hiển thị menu tài khoản
  if (userMenu) {
    if (currentUser) {
      userMenu.innerHTML = `
        <a href="/profile.html">Trang cá nhân</a>
        <a href="#" id="logout-btn">Đăng xuất</a>
      `;
      document
        .getElementById("logout-btn")
        .addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          location.reload();
        });
    } else {
      userMenu.innerHTML = `
        <a href="/login.html">Đăng nhập</a>
        <a href="/register.html">Đăng ký</a>
      `;
    }
  }
}

// =======================
// Xử lý sản phẩm & giỏ hàng
// =======================

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function renderShopProducts(products, currentPage = 1) {
  const container = document.getElementById("shop-product-list");
  const pagination = document.querySelector(".shop-pagination");
  if (!container || !pagination) return;

  const itemsPerPage = 12;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = products.slice(start, end);

  container.innerHTML = "";

  currentItems.forEach((product) => {
    const card = document.createElement("div");
    card.className = "shop-product-card";
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

  // Gắn sự kiện thêm giỏ
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.getAttribute("data-id");
      addToCart(productId);
    });
  });

  renderPagination(products.length, currentPage); // ✅ gọi vẽ phân trang
}

// Hàm vẽ phân trang
function renderPagination(totalItems, currentPage) {
  const pagination = document.querySelector(".shop-pagination");
  if (!pagination) return;

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Nút trước
  const prev = document.createElement("button");
  prev.innerHTML = "&lt; Trước";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () =>
    renderShopProducts(allProducts, currentPage - 1)
  );
  pagination.appendChild(prev);

  // Các nút trang
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => renderShopProducts(allProducts, i));
      pagination.appendChild(btn);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  // Nút tiếp
  const next = document.createElement("button");
  next.innerHTML = "Tiếp &gt;";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () =>
    renderShopProducts(allProducts, currentPage + 1)
  );
  pagination.appendChild(next);
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// =======================
// 🧾 Hiển thị giỏ hàng
// =======================

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = total;
}

function setupCartModal() {
  const modal = document.getElementById("cart-modal");
  const openBtn = document.getElementById("open-cart");
  const closeBtn = document.getElementById("close-cart");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      renderCartItems();
      modal.style.display = "block";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart-msg");

  container.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    document.getElementById("total-price").textContent = "0₫";
    return;
  }

  emptyMsg.style.display = "none";

  cart.forEach((item, index) => {
    const product = allProducts.find((p) => p.id == item.id);
    if (!product) return;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-info">
        <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
        <div>
          <div><strong>${product.name}</strong></div>
          <div>Giá: ${product.price}₫</div>
          <div>Số lượng: ${item.quantity}</div>
          <button class="remove-btn" data-index="${index}">Xoá</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  // Gắn nút xoá
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartItems();
    });
  });

  updateTotalPrice();
}

function updateTotalPrice() {
  const totalEl = document.getElementById("total-price");
  if (!totalEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => {
    const product = allProducts.find((p) => p.id == item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  totalEl.textContent = `${total.toLocaleString()}₫`;
}
