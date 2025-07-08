// Xử lý đăng xuất
document
  .querySelector(".nav-item:last-child")
  .addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });

// Hiển thị thông tin admin đang đăng nhập
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  const adminInfo = document.querySelector(".admin-info");
  if (adminInfo) {
    const adminName = adminInfo.querySelector(".admin-name");
    if (adminName) {
      adminName.textContent = currentUser.fullname || "Admin";
    }
  }
}

// Navigation
const navItems = document.querySelectorAll(".nav-item:not(:last-child)");
const contentSections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("page-title");

navItems.forEach((item) => {
  item.addEventListener("click", function () {
    const target = this.getAttribute("data-target");

    // Update active nav item
    navItems.forEach((navItem) => navItem.classList.remove("active"));
    this.classList.add("active");

    // Show target section
    contentSections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === target) {
        section.classList.add("active");
        pageTitle.textContent = this.querySelector("span").textContent;
      }
    });
  });
});

// ========== MODAL FUNCTIONS ==========
// Khởi tạo modal
const confirmModal = document.getElementById("confirmModal");
const alertModal = document.getElementById("alertModal");
const userModal = document.getElementById("userModal");

// Đóng modal khi click vào nút đóng hoặc bên ngoài
document.querySelectorAll(".modal .close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    closeAllModals();
  });
});

window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    closeAllModals();
  }
});

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
}

// Hiển thị modal xác nhận
function showConfirmModal(message, callback) {
  document.getElementById("confirmModalMessage").textContent = message;
  confirmModal.style.display = "block";

  document.getElementById("confirmModalOk").onclick = function () {
    closeAllModals();
    callback(true);
  };

  document.getElementById("confirmModalCancel").onclick = function () {
    closeAllModals();
    callback(false);
  };
}

// Hiển thị modal thông báo
function showAlertModal(title, message) {
  document.getElementById("alertModalTitle").textContent = title;
  document.getElementById("alertModalMessage").textContent = message;
  alertModal.style.display = "block";

  document.getElementById("alertModalOk").onclick = function () {
    alertModal.style.display = "none";
  };
}

// Hiển thị modal người dùng (thêm/sửa)
function showUserModal(user = null) {
  const form = document.getElementById("userForm");
  form.reset();

  if (user) {
    document.getElementById("userModalTitle").textContent = "Sửa người dùng";
    document.getElementById("userFullname").value = user.fullname || "";
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userEmail").readOnly = true;
    document.getElementById("userPassword").value = user.password;
    document.getElementById("userRole").value = user.role || "user";
  } else {
    document.getElementById("userModalTitle").textContent = "Thêm người dùng";
    document.getElementById("userEmail").readOnly = false;
  }

  userModal.style.display = "block";

  document.getElementById("userModalSave").onclick = function () {
    if (form.checkValidity()) {
      const userData = {
        fullname: document.getElementById("userFullname").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        password: document.getElementById("userPassword").value,
        role: document.getElementById("userRole").value,
      };
      closeAllModals();
      if (user) {
        updateUser(user.id, userData); // Truyền ID thay vì email
      } else {
        addUser(userData);
      }
    } else {
      form.reportValidity();
    }
  };

  document.getElementById("userModalCancel").onclick = function () {
    closeAllModals();
  };
}

// ========== CHỨC NĂNG QUẢN LÝ NGƯỜI DÙNG ==========
// Lấy dữ liệu người dùng từ localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Cập nhật dữ liệu người dùng
function updateUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
  renderUsersTable();
  updateDashboardStats();
}

// Render bảng người dùng
function renderUsersTable() {
  const users = getUsers();
  const usersTableBody = document.getElementById("users-table-body");
  usersTableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullname || "N/A"}</td>
            <td>${user.email}</td>
            <td>${user.role === "admin" ? "Quản trị viên" : "Người dùng"}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit-user-btn" data-id="${
                  user.id
                }">Sửa</button>
                <button class="action-btn delete-btn" data-id="${user.id}" ${
      user.email === "admin@aurenest.com" ? "disabled" : ""
    }>Xóa</button>
            </td>
        `;
    usersTableBody.appendChild(row);
  });

  // Sửa phần xử lý sự kiện
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      deleteUser(id);
    });
  });

  document.querySelectorAll(".edit-user-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      editUser(id);
    });
  });
}

// Xóa người dùng
function deleteUser(id) {
  const users = getUsers();
  const user = users.find((u) => u.id === id);

  if (!user) return;

  if (user.email === "admin@aurenest.com") {
    showAlertModal("Lỗi", "Không thể xóa tài khoản quản trị viên mặc định!");
    return;
  }

  showConfirmModal("Bạn có chắc chắn muốn xóa người dùng này?", (confirmed) => {
    if (confirmed) {
      const updatedUsers = users.filter((u) => u.id !== id);
      updateUsers(updatedUsers);
      showAlertModal("Thành công", "Người dùng đã được xóa thành công!");
    }
  });
}

// Sửa người dùng
function editUser(id) {
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (user) {
    showUserModal(user);
  }
}

// Thêm người dùng mới
document.getElementById("add-user-btn").addEventListener("click", function () {
  showUserModal();
});

// Thêm người dùng mới vào hệ thống
function addUser(userData) {
  const users = getUsers();

  // Tạo ID mới
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  userData.id = newId;

  if (users.some((u) => u.email === userData.email)) {
    showAlertModal("Lỗi", "Email đã tồn tại trong hệ thống!");
    return;
  }

  users.push(userData);
  updateUsers(users);
  showAlertModal("Thành công", "Người dùng mới đã được thêm thành công!");
}

// Cập nhật thông tin người dùng
function updateUser(id, newData) {
  const users = getUsers();
  const updatedUsers = users.map((u) => {
    if (u.id === id) {
      return { ...u, ...newData };
    }
    return u;
  });

  updateUsers(updatedUsers);
  showAlertModal("Thành công", "Thông tin người dùng đã được cập nhật!");
}

// ========== PRODUCT MANAGEMENT FUNCTIONS ==========
// Lấy dữ liệu sản phẩm từ file JSON
async function getProducts() {
  const localData = localStorage.getItem("products");
  if (localData) {
    return JSON.parse(localData);
  }

  try {
    const response = await fetch("./assets/data/products.json");
    const products = await response.json();
    localStorage.setItem("products", JSON.stringify(products));
    return products;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

// Render bảng sản phẩm
async function renderProductsTable() {
  const products = await getProducts();
  const productsTableBody = document.getElementById("products-table-body");
  productsTableBody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.category}</td>
    <td>${product.price.toLocaleString()}₫</td>
    <td>${product.quantity || "N/A"}</td>
    <td>${product.quantity > 0 ? "Còn hàng" : "Hết hàng"}</td>
    <td>
        <button class="action-btn edit-btn" data-id="${product.id}">Sửa</button>
        <button class="action-btn delete-product-btn" data-id="${
          product.id
        }">Xóa</button>
    </td>
`;
    productsTableBody.appendChild(row);
  });

  //   Thêm sự kiện cho nút xóa
  document.querySelectorAll(".delete-product-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      deleteProduct(id);
    });
  });

  // Thêm sự kiện cho nút sửa
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      editProduct(id);
    });
  });
}

function setProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}
// Xóa sản phẩm
async function deleteProduct(id) {
  showConfirmModal(
    "Bạn có chắc chắn muốn xóa sản phẩm này?",
    async (confirmed) => {
      if (confirmed) {
        const products = await getProducts();
        const updatedProducts = products.filter((product) => product.id !== id);

        // Cập nhật vào localStorage!
        setProducts(updatedProducts);
        renderProductsTable();
        updateDashboardStats();
        showAlertModal("Thành công", "Sản phẩm đã được xóa thành công!");
      }
    }
  );
}

// Sửa sản phẩm
async function editProduct(id) {
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    showProductModal(product);
  }
}

// Thêm sản phẩm mới
document
  .getElementById("add-product-btn")
  .addEventListener("click", function () {
    showProductModal();
  });

async function addProduct(productData) {
  const products = await getProducts();

  // Tự tạo ID mới (max ID + 1)
  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  // Gán ảnh mặc định nếu không có ảnh
  const image = productData.image?.trim()
    ? productData.image.trim()
    : "/assets/img/product/1.jpg";

  const newProduct = {
    id: newId,
    ...productData,
    image, // đảm bảo luôn có ảnh
  };

  products.push(newProduct);
  setProducts(products);
  renderProductsTable();
  updateDashboardStats();
  showAlertModal("Thành công", "Sản phẩm mới đã được thêm!");
}

async function updateProduct(id, newData) {
  const products = await getProducts();

  const updatedProducts = products.map((product) => {
    if (product.id === id) {
      return { ...product, ...newData };
    }
    return product;
  });

  setProducts(updatedProducts);
  renderProductsTable();
  updateDashboardStats();
  showAlertModal("Thành công", "Sản phẩm đã được cập nhật!");
}

async function showProductModal(product = null) {
  const form = document.getElementById("productForm");
  form.reset();

  if (product) {
    document.getElementById("productModalTitle").textContent = "Sửa sản phẩm";
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productQuantity").value = product.quantity || "";
    document.getElementById("productDescription").value =
      product.description || "";
  } else {
    document.getElementById("productModalTitle").textContent = "Thêm sản phẩm";
  }

  document.getElementById("productModal").style.display = "block";

  document.getElementById("productModalSave").onclick = async function () {
    if (form.checkValidity()) {
      const productData = {
        name: document.getElementById("productName").value.trim(),
        category: document.getElementById("productCategory").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        quantity:
          parseInt(document.getElementById("productQuantity").value) || 0,
        description: document.getElementById("productDescription").value.trim(),
      };
      closeAllModals();
      if (product) {
        await updateProduct(product.id, productData);
      } else {
        // Thêm sản phẩm mới
        await addProduct(productData);
      }
    } else {
      form.reportValidity();
    }
  };

  document.getElementById("productModalCancel").onclick = function () {
    closeAllModals();
  };
}

// =========================================================
// Chức năng quản lý đơn hàng
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.getElementById("orders-table-body");

  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Chưa có đơn hàng nào.</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const user = users.find((u) => u.id === order.userId);
    const total = order.totalAmount?.toLocaleString("vi-VN") || "0";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>
        ${order.name}<br/>
        <small>${user?.email || "Không rõ"}</small>
      </td>
      <td>${new Date(order.createdAt).toLocaleString()}</td>
      <td>${total}₫</td>
      <td>
        <span class="status status-${order.status}" id="status-text-${index}">
          ${getStatusText(order.status)}
        </span>

      </td>
      <td>
        <button class="action-btn btn-update" data-index="${index}">Cập nhật</button>
        <select class="order-status hidden" data-index="${index}" id="status-select-${index}">
          ${getStatusOptions(order.status)}
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });

  bindStatusUpdateEvents();
}

function getStatusText(status) {
  const map = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    completed: "Hoàn tất",
    cancelled: "Đã huỷ",
  };
  return map[status] || status;
}

function getStatusOptions(current) {
  const options = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "completed", label: "Hoàn tất" },
    { value: "cancelled", label: "Đã huỷ" },
  ];

  return options
    .map(
      (o) =>
        `<option value="${o.value}" ${o.value === current ? "selected" : ""}>${
          o.label
        }</option>`
    )
    .join("");
}
function bindStatusUpdateEvents() {
  document.querySelectorAll(".btn-update").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = this.dataset.index;
      const select = document.getElementById(`status-select-${index}`);
      const text = document.getElementById(`status-text-${index}`);

      if (select.classList.contains("hidden")) {
        // Hiện select để chọn trạng thái
        select.classList.remove("hidden");
        select.focus();
        return;
      }

      const newStatus = select.value;
      const orders = JSON.parse(localStorage.getItem("orders")) || [];

      if (orders[index].status !== newStatus) {
        orders[index].status = newStatus;
        localStorage.setItem("orders", JSON.stringify(orders));
        alert("Trạng thái đơn hàng đã được cập nhật.");
      }

      renderOrders(); // cập nhật lại bảng
    });
  });
}

// =========================================================
// Cập nhật thống kê dashboard
async function updateDashboardStats() {
  // Cập nhật số lượng người dùng
  const users = getUsers();
  document.getElementById("user-count").textContent = users.length;

  // Cập nhật số lượng sản phẩm
  const products = await getProducts();
  document.getElementById("product-count").textContent = products.length;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  document.getElementById("order-count").textContent = orders.length;
}

// Khởi tạo
document.addEventListener("DOMContentLoaded", function () {
  renderUsersTable();
  renderProductsTable();
  renderOrders();
  updateDashboardStats();

  // Thêm sự kiện khi chuyển sang tab sản phẩm
  document
    .querySelector('.nav-item[data-target="products"]')
    .addEventListener("click", function () {
      renderProductsTable();
    });
});
