function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast-container");
  if (main) {
    const toast = document.createElement("div");
    // Auto remove toast after 3 seconds
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fa-solid fa-circle-check",
      info: "fa-solid fa-circle-info",
      warning: "fa-solid fa-triangle-exclamation",
      error: "fa-solid fa-circle-xmark",
    };

    const icon = icons[type];
    toast.classList.add("toast", `toast--${type}`);
    toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
        `;
    main.appendChild(toast);
  }
}

function showSuccessToast(message) {
  toast({
    title: "Success",
    message: message,
    type: "success",
  });
}
function showErrorToast(message) {
  toast({
    title: "Error",
    message: message,
    type: "error",
  });
}
