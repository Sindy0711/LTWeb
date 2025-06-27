fetch("./assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById("product-carousel");
    const visibleCount = 4;

    // Tạo thẻ sản phẩm từ dữ liệu
    const createCard = (product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
          <div class='product-content'>
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <div class="price">₫${Number(product.price).toLocaleString()}</div>
          </div>
        `;
      return card;
    };

    // Render sản phẩm gốc
    products.forEach((product) => {
      container.appendChild(createCard(product));
    });

    // Clone cuối (đầu đưa xuống cuối)
    for (let i = 0; i < visibleCount; i++) {
      container.appendChild(createCard(products[i]));
    }

    // Clone đầu (cuối đưa lên đầu)
    for (let i = products.length - visibleCount; i < products.length; i++) {
      container.insertBefore(createCard(products[i]), container.firstChild);
    }

    initInfiniteCarousel(container, visibleCount);
  })
  .catch((err) => {
    console.error("Lỗi khi tải sản phẩm:", err);
  });

function initInfiniteCarousel(carousel, visibleCount) {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const cardWidth = carousel.querySelector(".product-card").offsetWidth + 20;
  const totalItems = carousel.children.length;
  let index = visibleCount;

  carousel.style.transition = "none";
  carousel.style.transform = `translateX(${-index * cardWidth}px)`;

  let isAnimating = false;

  function slideTo(newIndex) {
    if (isAnimating) return;
    isAnimating = true;
    carousel.style.transition = "transform 0.5s ease";
    carousel.style.transform = `translateX(${-newIndex * cardWidth}px)`;
    index = newIndex;

    carousel.addEventListener(
      "transitionend",
      () => {
        carousel.style.transition = "none";

        // Nếu trượt tới vùng clone cuối, reset lại đầu thật
        if (index >= totalItems - visibleCount) {
          index = visibleCount;
          carousel.style.transform = `translateX(${-index * cardWidth}px)`;
        }

        // Nếu trượt tới vùng clone đầu, reset lại cuối thật
        if (index < visibleCount) {
          index = totalItems - visibleCount * 2;
          carousel.style.transform = `translateX(${-index * cardWidth}px)`;
        }

        setTimeout(() => {
          carousel.style.transition = "transform 0.5s ease";
          isAnimating = false;
        }, 20);
      },
      { once: true }
    );
  }

  nextBtn.addEventListener("click", () => slideTo(index + visibleCount));
  prevBtn.addEventListener("click", () => slideTo(index - visibleCount));
}
const toggleBtn = document.querySelector("#menu-toggle");
const navLinks = document.querySelector(".nav-links");
const holder = document.querySelector(".holder");

toggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  holder.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    holder.classList.remove("active");
  });
});
