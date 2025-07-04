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

  fetch("./assets/data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById("shop-product-list");

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
    })
    .catch((err) => {
      console.error("Lỗi khi tải dữ liệu:", err);
    });
});
