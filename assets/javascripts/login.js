document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin123') {
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
        }
    });
});