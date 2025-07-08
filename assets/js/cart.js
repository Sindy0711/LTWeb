const cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];
const orderItems = document.getElementById("order-items");
const totalEl = document.getElementById("order-total");

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN") + "₫";
}

function renderOrderSummary() {
  let total = 0;
  orderItems.innerHTML = "";

  cart.forEach((item) => {
    const product = products.find((p) => p.id == item.id);
    if (!product) return;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.innerHTML += `
          <div class="order-item">
            <span>${product.name} x${item.quantity}</span>
            <span>${formatCurrency(itemTotal)}</span>
          </div>
        `;
  });

  totalEl.textContent = formatCurrency(total);
}

function submitOrder() {
  const name = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
    return;
  }

  // Lưu đơn hàng (tuỳ bạn muốn xử lý gì tiếp theo)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Bạn cần đăng nhập để đặt hàng.");
    return;
  }

  // Tạo đơn hàng
  const newOrder = {
    id: Date.now(),
    userId: currentUser.id,
    userEmail: currentUser.email || "", 
    name, 
    phone,
    address,
    status: "pending", 
    items: cart,
    createdAt: new Date().toISOString(),
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Đơn hàng đã được ghi nhận! Cảm ơn bạn.");
  localStorage.removeItem("cart");
  window.location.href = "/";
}

renderOrderSummary();
