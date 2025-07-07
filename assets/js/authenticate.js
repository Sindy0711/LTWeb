document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");
  const registerMessage = document.getElementById("registerMessage");

  const defaultAdmin = { username: "admin", password: "admin123" };
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const adminExists = users.some(
    (user) => user.username === defaultAdmin.username
  );

  if (!adminExists) {
    users.push(defaultAdmin);
    localStorage.setItem("users", JSON.stringify(users));
  }
  // ĐĂNG NHẬP
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const user = storedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Lưu trạng thái đăng nhập (tuỳ chọn)
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Sai tên đăng nhập hoặc mật khẩu.";
    }
  });

  // ĐĂNG KÝ
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newUsername = document.getElementById("newUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some((user) => user.username === newUsername);

    if (exists) {
      registerMessage.textContent = "Tên đăng nhập đã tồn tại.";
      registerMessage.style.color = "red";
      return;
    }

    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Đăng ký thành công! Bạn có thể đăng nhập.";
    registerMessage.style.color = "green";
  });

  // CHUYỂN GIAO DIỆN SIGNIN/SIGNUP
  const container = document.getElementById("container");
  const signUpButtons = document.querySelectorAll("#signUp");
  const signInButtons = document.querySelectorAll("#signIn");

  signUpButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    })
  );

  signInButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    })
  );
});
