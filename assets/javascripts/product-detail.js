// Thêm interactivity cho màu sắc
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Thêm interactivity cho size
document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Thêm interactivity cho số lượng
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