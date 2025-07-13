import type { Contact } from "./interfaces/contact";
import type { Group } from "./interfaces/group";
import ContactManager from "./features/contact-manager";
import GroupManager from "./features/group-manager";
import UIHelper from "./features/ui";
import StorageService from "./core/services/storage-servce";

class App {
  private groupManager: GroupManager;
  private contactManager: ContactManager;

  constructor() {
    this.groupManager = new GroupManager();
    this.contactManager = new ContactManager();

    this.init();
  }

  private init() {
    this.renderAccordion();
    this.bindEvents();
    this.bindAccordionEvents();
  }

  private bindEvents() {
    const headerGroupBtn = document.getElementById(
      "sidebar-group-open"
    ) as HTMLButtonElement;
    headerGroupBtn.addEventListener("click", () => {
      UIHelper.openSidebar("group");
    });

    const headerAddContactBtn = document.getElementById(
      "sidebar-add-contact-open"
    ) as HTMLButtonElement;
    headerAddContactBtn.addEventListener("click", () => {
      this.groupManager.populateSelect();
      UIHelper.openSidebar("contact");
    });

    const sidebarCloseBtn = document.getElementById(
      "sidebar-close"
    ) as HTMLButtonElement;
    sidebarCloseBtn.addEventListener("click", () => {
      UIHelper.closeSidebarWithBackdrop();
    });
  }

  private renderAccordion() {
    const accordionEl = document.getElementById("accordion");
    const mainEl = document.querySelector("main") as HTMLElement;

    if (!accordionEl || !mainEl) return;

    const groups = StorageService.getAll<Group>("groups");
    const contacts = StorageService.getAll<Contact>("contacts");

    accordionEl.innerHTML = "";

    if (!groups.length) {
      const existingEmptyEl = mainEl.querySelector(".main__empty");
      if (!existingEmptyEl) {
        const emptySpan = document.createElement("span");
        emptySpan.className = "main__empty";
        emptySpan.textContent = "Список контактов пуст";
        mainEl.appendChild(emptySpan);
      }
      return;
    }

    const existingEmptyEl = mainEl.querySelector(".main__empty");
    if (existingEmptyEl) {
      existingEmptyEl.remove();
    }

    accordionEl.innerHTML = groups
      .map((group, index) => {
        const groupContacts = contacts.filter((c) => c.groupId === group.id);
        const collapseId = `collapse-${group.id}`;
        const headerId = `heading-${group.id}`;
        const expanded = index === 0 ? "true" : "false";
        const showClass = index === 0 ? "show" : "";
        const collapsedClass = index !== 0 ? "collapsed" : "";

        const contactsHTML = groupContacts.length
          ? groupContacts
              .map(
                (c) => `
                <div class="accordion-body contact-info">
                  <div class="contact-info__details">
                    <span class="contact-info__name">${c.name}</span>
                    <span class="contact-info__phone">${c.phone}</span>
                  </div>
                  <div style="display: flex; gap: 8px">
                    <button type="button" class="button button--icon-edit" id="edit-contact" data-contact-id="${c.id}">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="button__icon"
                        viewBox="0 -960 960 960"
                      >
                        <path
                          d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                        />
                      </svg>
                    </button>
                    <button type="button" class="button button--icon-delete" id="delete-contact" data-contact-id="${c.id}">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="button__icon"
                        viewBox="0 -960 960 960"
                      >
                        <path
                          d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>`
              )
              .join("")
          : `<div class="accordion-body contact-info"><em>Нет контактов</em></div>`;

        return `
        <div class="accordion-item">
          <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button ${collapsedClass}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${expanded}" aria-controls="${collapseId}">
              ${group.name}
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse ${showClass}" aria-labelledby="${headerId}">
            ${contactsHTML}
          </div>
        </div>`;
      })
      .join("");
  }

  private bindAccordionEvents() {
    document.querySelectorAll("#edit-contact").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.groupManager.populateSelect();
        const contactId = (e.currentTarget as HTMLElement).dataset.contactId;
        if (!contactId) return;
        this.contactManager.editContact(contactId);
      });
    });

    document.querySelectorAll("#delete-contact").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const contactId = (e.currentTarget as HTMLElement).dataset.contactId;
        if (!contactId) return;
        this.contactManager.deleteContact(contactId);
      });
    });
  }
}

export default App;
