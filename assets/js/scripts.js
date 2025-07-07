let allProducts = [];

document.addEventListener("DOMContentLoaded", function () {
  const userDropdown = document.querySelector(".user-dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (userDropdown && dropdownMenu) {
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("show");
    });
  }

  // Gọi lần đầu khi trang tải để cập nhật số lượng
  updateCartCount();


  
  const userMenu = document.getElementById("user-menu");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (userMenu) {
    if (currentUser) {
      userMenu.innerHTML = `
      <a href="/profile.html">Trang cá nhân</a>
      <a href="#" id="logout-btn">Đăng xuất</a>
    `;

      document.addEventListener("click", function (e) {
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            location.reload();
          });
        }
      });
    } else {
      userMenu.innerHTML = `
      <a href="/login.html">Đăng nhập</a>
      <a href="/register.html">Đăng ký</a>
    `;
    }
  }
  fetch("./assets/data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("shop-product-list");
      allProducts = products;
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "shop-product-card";

        productCard.innerHTML = `
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

        container.appendChild(productCard);
      });

      // Sau khi sản phẩm đã được render -> gắn sự kiện cho nút Add to Cart
      const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
      addToCartButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();

          const productId = this.getAttribute("data-id");

          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          const existingProduct = cart.find((item) => item.id === productId);

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cart.push({ id: productId, quantity: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount(); // Cập nhật giao diện
        });
      });
    })
    .catch((err) => {
      console.error("Lỗi khi tải dữ liệu:", err);
    });

  // Hàm cập nhật số lượng giỏ hàng
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
    }
  }

  // Mở & đóng modal
  const cartModal = document.getElementById("cart-modal");
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartMsg = document.getElementById("empty-cart-msg");

  openCartBtn.addEventListener("click", () => {
    renderCartItems();
    cartModal.style.display = "block";
  });

  closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  // Hiển thị sản phẩm trong modal
  function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartMsg.style.display = "block";
      return;
    }

    emptyCartMsg.style.display = "none";

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
      cartItemsContainer.appendChild(el);
    });

    // Gắn sự kiện xoá
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
    if (cart.length === 0) {
      emptyCartMsg.style.display = "block";
      document.getElementById("total-price").textContent = "0₫"; // cập nhật trực tiếp luôn
      return;
    }
  }

  function updateTotalPrice() {
    const totalPriceEl = document.getElementById("total-price");
    if (!totalPriceEl) return;

    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = currentCart.reduce((sum, item) => {
      const product = allProducts.find((p) => p.id == item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    totalPriceEl.textContent = `${total.toLocaleString()}₫`;
  }
});
