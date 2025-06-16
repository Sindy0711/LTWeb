fetch('./assets/data/products.json')
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById('product-carousel');

    products.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
      <div class='product-content'>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <div class="price">₫${Number(product.price).toLocaleString()}</div>
      </div>
      `;
      container.appendChild(card);
    });

    initCarousel(products.length);
  })
  .catch((err) => {
    console.error('Lỗi khi tải sản phẩm:', err);
  });


// Khởi tạo carousel
function initCarousel(productCount) {
  let scrollPosition = 0;
  const carousel = document.getElementById('product-carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const cardWidth = 240; // mỗi card + khoảng cách (220px + 20px gap)
  const visibleCards = 4;
  const totalPages = Math.ceil(productCount / visibleCards);
  const maxScroll = (totalPages - 1) * cardWidth * visibleCards;

  nextBtn.addEventListener('click', () => {
    scrollPosition += cardWidth * visibleCards;
    if (scrollPosition > maxScroll) {
      scrollPosition = 0; // quay lại đầu
    }
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    scrollPosition -= cardWidth * visibleCards;
    if (scrollPosition < 0) {
      scrollPosition = maxScroll; // quay về cuối
    }
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  });
}