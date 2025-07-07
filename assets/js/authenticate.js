document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");
  const registerMessage = document.getElementById("registerMessage");

  // Tạo admin mặc định nếu chưa có
  const defaultAdmin = { 
    id: 1, // Thêm ID cố định cho admin
    email: "admin@aurenest.com", 
    password: "admin123", 
    role: "admin",
    fullname: "Quản trị viên"
  };
  
  // Lấy danh sách người dùng từ localStorage hoặc tạo mới
  let users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Kiểm tra xem admin đã tồn tại chưa
  const adminExists = users.some(user => user.email === defaultAdmin.email);
  
  if (!adminExists) {
    users.push(defaultAdmin);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Admin account created:", defaultAdmin);
  }

  // Hàm tạo ID mới (tương tự trong user-admin.js)
  function generateNewId() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  // Xử lý đăng nhập (không thay đổi)
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorMessage) errorMessage.textContent = "";

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("Login successful:", user);
        
        if (user.role === "admin") {
          window.location.href = "user-admin.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        if (errorMessage) errorMessage.textContent = "Sai email hoặc mật khẩu.";
        console.log("Login failed for:", email);
      }
    });
  }

  // Xử lý đăng ký - CẬP NHẬT QUAN TRỌNG
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (registerMessage) registerMessage.textContent = "";

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      
      // Kiểm tra email đã tồn tại
      const userExists = storedUsers.some(user => user.email === email);
      
      if (userExists) {
        if (registerMessage) {
          registerMessage.textContent = "Email đã được sử dụng.";
          registerMessage.style.color = "red";
        }
        return;
      }

      // Tạo user mới với ID tự động
      const newUser = {
        id: generateNewId(), // Thêm ID tự động
        fullname,
        email,
        password,
        role: "user"
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      console.log("New user registered:", newUser);

      if (registerMessage) {
        registerMessage.textContent = "Đăng ký thành công! Bạn có thể đăng nhập.";
        registerMessage.style.color = "green";
      }
      
      // Reset form sau 2 giây
      setTimeout(() => {
        registerForm.reset();
        if (registerMessage) registerMessage.textContent = "";
      }, 2000);
    });
  }
});