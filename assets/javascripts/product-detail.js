// Thêm sự kiện cho màu sắc
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Thêm sự kiện cho size
document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Thêm sự kiện cho số lượng
let quantity = 1;

function increase() {
    quantity++;
    document.getElementById('quantity').innerText = quantity;
}

function decrease() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').innerText = quantity;
    }
}

// Thêm sự kiện click cho các hình ảnh thumbnail
document.querySelectorAll('.product-thumbnails img').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        const newSrc = this.src;

        document.querySelector('.product-main').src = newSrc;

        const mainImg = document.querySelector('.product-main');
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
            mainImg.style.opacity = '1';
        }, 200);
    });
});

// Thêm sự kiện nút load phần mô tả sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    const descriptionElement = document.querySelector('.product-description .description');
    const loadMoreBtn = document.querySelector('.product-description .load-more-btn');
    const lineHeight = parseInt(window.getComputedStyle(descriptionElement).lineHeight);
    const maxHeight = lineHeight * 10;
    
    if (descriptionElement.scrollHeight > maxHeight) {
        descriptionElement.style.maxHeight = maxHeight + 'px';
        descriptionElement.style.overflow = 'hidden';
        descriptionElement.style.transition = 'max-height 0.3s ease';
        loadMoreBtn.style.display = 'block';
        
        loadMoreBtn.addEventListener('click', function() {
            if (descriptionElement.style.maxHeight !== 'none') {
                descriptionElement.style.maxHeight = descriptionElement.scrollHeight + 'px';
                setTimeout(() => {
                    descriptionElement.style.maxHeight = 'none';
                }, 300);
                loadMoreBtn.textContent = 'Thu gọn';
            } else {
                descriptionElement.style.maxHeight = maxHeight + 'px';
                loadMoreBtn.textContent = 'Xem thêm';
            }
        });
    } else {
        loadMoreBtn.style.display = 'none';
    }
});

// Thêm sự kiện nut load phần đánh giá
document.addEventListener('DOMContentLoaded', function() {
    const reviewContainer = document.querySelector('.product-review-container');
    const testimonials = document.querySelectorAll('.testimonial');
    const loadMoreReviewsBtn = document.querySelector('.product-reviews .load-more-btn');
    const itemsPerLoad = 4; 
    let visibleCount = itemsPerLoad; 

    testimonials.forEach((testimonial, index) => {
        if (index >= visibleCount) {
            testimonial.style.display = 'none';
        }
    });

    if (testimonials.length <= itemsPerLoad) {
        loadMoreReviewsBtn.style.display = 'none';
    } else {
        loadMoreReviewsBtn.style.display = 'block';
    }

    loadMoreReviewsBtn.addEventListener('click', function() {
        const nextVisibleCount = visibleCount + itemsPerLoad;
        
        for (let i = visibleCount; i < nextVisibleCount && i < testimonials.length; i++) {
            testimonials[i].style.display = 'block';
        }

        visibleCount = nextVisibleCount;

        if (visibleCount >= testimonials.length) {
            loadMoreReviewsBtn.style.display = 'none';
        }
    });
});


// Thêm sự kiện cho modal review đánh giá số sao
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating input');
    const ratingValue = document.getElementById('ratingValue');
    const starLabels = document.querySelectorAll('.star-rating label');
    let selectedRating = 0;

    //cập nhật đánh giá
    function updateRating(value) {
        selectedRating = parseInt(value);
        const ratings = {
            1: 'Rất không hài lòng',
            2: 'Không hài lòng',
            3: 'Bình thường',
            4: 'Hài lòng',
            5: 'Rất hài lòng'
        };
        ratingValue.textContent = ratings[selectedRating] || 'Bạn chưa chọn đánh giá';
        
        // Cập nhật màu sao
        starLabels.forEach((label, index) => {
            const starValue = index + 1;
            label.querySelector('i').style.color = starValue <= selectedRating ? '#ffc107' : '#ddd';
        });
    }

    // Xử lý sự kiện click
    stars.forEach(star => {
        star.addEventListener('change', function() {
            updateRating(this.value);
        });
    });

    // Xử lý hover
    starLabels.forEach((label, index) => {
        const starValue = index + 1;
        
        label.addEventListener('mouseover', () => {
            starLabels.forEach((l, i) => {
                const currentValue = i + 1;
                l.querySelector('i').style.color = currentValue <= starValue ? '#ffc107' : '#ddd';
            });
        });

        label.addEventListener('mouseout', () => {
            updateRating(selectedRating);
        });
    });
});

// Thêm sự kiện đóng modal khi nhấn bên ngoài
document.addEventListener('DOMContentLoaded', function() {
    const modalReview = document.querySelector('.modal-review');
    
    modalReview.addEventListener('click', function(e) {
        if (e.target === modalReview) {
            modalReview.style.display = 'none';
        }
    });
    
    const writeReviewBtn = document.querySelector('.write-btn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function() {
            modalReview.style.display = 'flex'; 
        });
    }
});