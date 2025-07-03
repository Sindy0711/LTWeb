// fetch("./assets/data/products.json")
//   .then((res) => res.json())
//   .then((products) => {
//     // Hàm tạo card sản phẩm
//     const createCard = (product) => {
//       const card = document.createElement("div");
//       card.className = "product-card";
//       card.innerHTML = `
//         <div class="product-image">
//           <img src="${product.image}" alt="${product.name}" />
//         </div>
//         <div class="product-info">
//           <h4 class="product-name">${product.name}</h4>
//           <div class="rating">
//             <span class="stars">★★★★★</span>
//             <span class="score">4.0/5</span>
//           </div>
//           <div class="price">
//             <span class="sale-price">${product.price.toLocaleString()}₫</span>
//             ${
//               product.oldPrice
//                 ? `<span class="original-price">${product.oldPrice.toLocaleString()}₫</span>`
//                 : ""
//             }
//           </div>
//         </div>
//       `;
//       return card;
//     };

//     // Hàm render sản phẩm vào container
//     const renderProducts = (containerSelector, productList) => {
//       const container = document.querySelector(containerSelector);
//       if (!container) return;
//       productList.forEach((product) => {
//         container.appendChild(createCard(product));
//       });
//     };

//     // Render Best Seller (4 sản phẩm đầu)
//     renderProducts("#product-carousel", products.slice(0, 5));

//     // Render Gợi ý sản phẩm (4 sản phẩm tiếp theo)
//     renderProducts("#recommend-carousel", products.slice(6, 11));
//   })
//   .catch((err) => {
//     console.error("Lỗi khi tải sản phẩm:", err);
//   });

// const toggleBtn = document.querySelector(".menu-toggle");
// const navLinks = document.querySelector(".nav-links");
// const holder = document.querySelector(".holder");

// toggleBtn.addEventListener("click", () => {
//   navLinks.classList.toggle("active");
//   holder.classList.toggle("active");
// });

// document.querySelectorAll(".nav-link a").forEach((link) => {
//   link.addEventListener("click", () => {
//     navLinks.classList.remove("active");
//     holder.classList.remove("active");
//   });
// });

// const userDropdown = document.querySelector(".user-dropdown");
// const dropdownMenu = document.querySelector(".dropdown-menu");

// if (userDropdown && dropdownMenu) {
//   userDropdown.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdownMenu.classList.toggle("show");
//   });

//   document.addEventListener("click", () => {
//     dropdownMenu.classList.remove("show");
//   });
// }
