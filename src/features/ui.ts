class UIHelper {
  private static readonly TRANSITION_DURATION = 300;

  static showToast(
    message: string,
    type: "success" | "error" = "success"
  ): void {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    const iconPath =
      type === "success"
        ? "m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
        : "M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z";

    const color = type === "success" ? "#52C41A" : "#FF4D4F";

    toast.innerHTML = `
      <div class="toast__body">
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="${color}">
          <path d="${iconPath}"/>
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("toast--show");
    });

    setTimeout(() => {
      toast.classList.remove("toast--show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, this.TRANSITION_DURATION);
    }, 3000);
  }

  static closeSidebarWithBackdrop() {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    const backdrop = document.querySelector(".backdrop") as HTMLElement;

    if (sidebar && backdrop) {
      sidebar.classList.add("sidebar--hidden");
      backdrop.classList.add("backdrop--hidden");
    }
  }

  static openSidebar(type: "group" | "contact") {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    const backdrop = document.querySelector(".backdrop") as HTMLElement;
    const sidebarTitle = document.querySelector(
      ".sidebar__title"
    ) as HTMLElement;
    const sidebarContentGroup = document.querySelector(
      ".group-form"
    ) as HTMLFormElement;
    const sidebarContentContact = document.querySelector(
      ".contact-form"
    ) as HTMLFormElement;

    if (sidebarTitle) {
      sidebarTitle.textContent =
        type === "group" ? "Группы контактов" : "Добавление контакта";
    }

    if (sidebarContentGroup && sidebarContentContact) {
      sidebarContentGroup.classList.toggle(
        "group-form--hidden",
        type !== "group"
      );
      sidebarContentContact.classList.toggle(
        "contact-form--hidden",
        type !== "contact"
      );
    }

    if (sidebar && backdrop) {
      sidebar.classList.remove("sidebar--hidden");
      backdrop.classList.remove("backdrop--hidden");
    }
  }

  public static showModal(
    title: string,
    description: string,
    onConfirm: () => void
  ) {
    const existingModal = document.querySelector(".modal");
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal__content">
        <button class="modal__close" id="modal-close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
        <h2 class="modal__title">${title}</h2>
        <p class="modal__description">${description}</p>
        <div class="modal__actions">
          <button class="button button--primary" id="modal-confirm">Да, удалить</button>
          <button class="button button--text" id="modal-close">Отмена</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("modal--show");
    }, 10);

    const confirmBtn = modal.querySelector(
      "#modal-confirm"
    ) as HTMLButtonElement;
    const closeBtns = modal.querySelectorAll(
      "#modal-close"
    ) as NodeListOf<HTMLButtonElement>;

    confirmBtn.addEventListener("click", () => {
      onConfirm();
      this.hideModal(modal);
    });

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.hideModal(modal);
      });
    });
  }

  private static hideModal(modal: HTMLElement) {
    const backdrop = document.querySelector(".backdrop") as HTMLElement;

    modal.classList.remove("modal--show");
    if (backdrop) {
      backdrop.classList.remove("active");
      backdrop.classList.add("hidden");
    }

    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, this.TRANSITION_DURATION);
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default UIHelper;
