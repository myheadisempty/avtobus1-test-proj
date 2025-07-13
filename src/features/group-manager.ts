import type { Group } from "../interfaces/group";
import StorageService from "../core/services/storage-servce";
import { generateId } from "../core/utils/generate-id";
import UIHelper from "./ui";

class GroupManager {
  private formBody: HTMLElement;
  private groupSelect: HTMLSelectElement;
  private addFieldBtn: HTMLButtonElement;
  private saveBtn: HTMLButtonElement;

  constructor() {
    this.formBody = document.querySelector(".group-form__body") as HTMLElement;
    this.groupSelect = document.querySelector("select") as HTMLSelectElement;
    this.addFieldBtn = document.getElementById(
      "add-field"
    ) as HTMLButtonElement;
    this.saveBtn = document.getElementById("save-groups") as HTMLButtonElement;

    this.init();
  }

  private init() {
    this.renderExistingGroups();
    this.bindEvents();
  }

  private bindEvents() {
    this.addFieldBtn.addEventListener("click", () => this.addNewGroupField());
    this.saveBtn.addEventListener("click", (e) => this.saveGroups(e));
  }

  private addNewGroupField() {
    const group = document.createElement("div");
    group.classList.add("group-form__group");
    group.dataset.groupId = generateId();

    group.innerHTML = `
      <input type="text" placeholder="Введите название" class="group-input" />
      <button type="button" class="button button--icon" id="delete-group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="25px"
          viewBox="0 -960 960 960"
          width="25px"
          class="button__icon"
        >
          <path
            d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
          />
        </svg>
      </button>
    `;

    const deleteGroupBtn = group.querySelector(
      "#delete-group"
    ) as HTMLButtonElement;
    deleteGroupBtn.addEventListener("click", () => this.deleteGroup(group));

    this.formBody.appendChild(group);
  }

  public populateSelect() {
    const groups = StorageService.getAll<Group>("groups");

    this.groupSelect.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Выберите группу";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    this.groupSelect.appendChild(placeholderOption);

    groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      this.groupSelect.appendChild(option);
    });
  }

  private deleteGroup(groupElement: HTMLElement) {
    const groupId = groupElement.dataset.groupId;

    UIHelper.showModal(
      "Удалить группу?",
      " Удаление группы повлечет за собой удаление контактов связанных с этой группой",
      () => {
        groupElement.remove();

        if (groupId) {
          StorageService.delete("groups", groupId);
        }
      }
    );
  }

  private saveGroups(event: Event) {
    event.preventDefault();

    const groupInputs = this.formBody.querySelectorAll(
      ".group-input"
    ) as NodeListOf<HTMLInputElement>;
    const groups: Group[] = [];

    groupInputs.forEach((input) => {
      const groupElement = input.closest(".group-form__group") as HTMLElement;
      const groupId = groupElement.dataset.groupId || generateId();
      const groupName = input.value.trim();

      groupElement.dataset.groupId = groupId;

      groups.push({
        id: groupId,
        name: groupName,
      });
    });

    StorageService.save("groups", groups);

    this.showSuccessMessage("Группа успешно создана");
  }

  private renderExistingGroups() {
    const groups = StorageService.getAll<Group>("groups");

    groups.forEach((group) => {
      const groupElement = document.createElement("div");
      groupElement.classList.add("group-form__group");
      groupElement.dataset.groupId = group.id;

      groupElement.innerHTML = `
        <input type="text" placeholder="Введите название" class="group-input" value="${group.name}" />
        <button type="button" class="button button--icon" id="delete-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25px"
            viewBox="0 -960 960 960"
            width="25px"
            class="button__icon"
          >
            <path
              d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
            />
          </svg>
        </button>
      `;

      const deleteBtn = groupElement.querySelector(
        "#delete-group"
      ) as HTMLButtonElement;
      deleteBtn.addEventListener("click", () => this.deleteGroup(groupElement));

      this.formBody.appendChild(groupElement);
    });
  }

  private showSuccessMessage(message: string) {
    UIHelper.closeSidebarWithBackdrop();

    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast__body">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
          fill="#52C41A"
        >
          <path
            d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
          />
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast--show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("toast--show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }
}

export default GroupManager;
