document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");
  const registerMessage = document.getElementById("registerMessage");

  // Tạo admin mặc định nếu chưa có
  const defaultAdmin = { 
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

  // Xử lý đăng nhập
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorMessage) errorMessage.textContent = "";

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Lấy lại danh sách người dùng từ localStorage (cập nhật mới nhất)
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      console.log("Stored users:", storedUsers);
      
      const user = storedUsers.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("Login successful:", user);
        
        // Phân biệt admin/user
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

  // Xử lý đăng ký - SỬA LỖI QUAN TRỌNG Ở ĐÂY
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (registerMessage) registerMessage.textContent = "";

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim(); // Đảm bảo id đúng
      const password = document.getElementById("password").value;

      // Lấy lại danh sách người dùng từ localStorage
      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      console.log("Current users before registration:", storedUsers);
      
      // Kiểm tra email đã tồn tại
      const userExists = storedUsers.some(user => user.email === email);
      
      if (userExists) {
        if (registerMessage) {
          registerMessage.textContent = "Email đã được sử dụng.";
          registerMessage.style.color = "red";
        }
        console.log("Registration failed: Email exists", email);
        return;
      }

      // Tạo user mới với role mặc định
      const newUser = {
        fullname,
        email,
        password,
        role: "user"
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      console.log("New user registered:", newUser);
      console.log("Updated users:", storedUsers);

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