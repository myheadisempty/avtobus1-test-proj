import IMask from "imask";
import uiHelper from "./ui";
import StorageService from "../core/services/storage-servce";
import {
  FormValidator,
  RequiredValidator,
  UniqueNameValidator,
  UniquePhoneValidator,
} from "../core/services/validation";
import type { Contact } from "../interfaces/contact";
import App from "../app";
import { generateId } from "../core/utils/generate-id";

class ContactManager {
  private contactForm: HTMLFormElement;
  private formValidator!: FormValidator;

  constructor() {
    this.contactForm = document.querySelector(
      ".contact-form"
    ) as HTMLFormElement;

    this.init();
  }

  private init() {
    this.initPhoneMask();
    this.bindEvents();
    this.initializeValidation();
  }

  private bindEvents() {
    const saveBtn = this.contactForm.querySelector(
      ".button--primary"
    ) as HTMLButtonElement;
    saveBtn.addEventListener("click", (e) => this.saveContact(e));
  }

  private initPhoneMask() {
    const phoneInput = this.contactForm.querySelector(
      "#phone"
    ) as HTMLInputElement;

    if (phoneInput) {
      IMask(phoneInput, {
        mask: "+{7} (000) 000 - 00 - 00",
      });
    }
  }

  private initializeValidation() {
    const alertCallback = (message: string) => {
      uiHelper.showToast(message, "error");
    };

    this.formValidator = new FormValidator();

    this.formValidator
      .addField("name", this.contactForm, "contact-form__field")
      .addValidator(new RequiredValidator())
      .addValidator(
        new UniqueNameValidator(
          "Контакт уже существует",
          alertCallback,
          undefined
        )
      );

    this.formValidator
      .addField("phone", this.contactForm, "contact-form__field")
      .addValidator(new RequiredValidator())
      .addValidator(
        new UniquePhoneValidator(
          "Телефон уже существует",
          alertCallback,
          undefined
        )
      );

    this.formValidator.addField(
      "groupId",
      this.contactForm,
      "contact-form__field"
    );
  }

  private saveContact(event: Event) {
    event.preventDefault();

    if (!this.formValidator.validateAll()) {
      return;
    }

    const formData = this.formValidator.getFormData();

    this.saveContactToStorage({
      id: generateId(),
      name: formData.name,
      phone: formData.phone,
      groupId: formData.groupId,
    });

    this.formValidator.resetForm();

    uiHelper.showToast("Контакт успешно создан!", "success");
    uiHelper.closeSidebarWithBackdrop();
  }

  public editContact(contactId: string) {
    const contact = StorageService.getOne<Contact>("contacts", contactId);
    if (!contact) return;

    const nameInput = this.contactForm.querySelector<HTMLInputElement>("#name");
    const phoneInput =
      this.contactForm.querySelector<HTMLInputElement>("#phone");
    const groupSelect =
      this.contactForm.querySelector<HTMLSelectElement>("#groupId");

    if (!nameInput || !phoneInput || !groupSelect) return;

    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    groupSelect.value = contact.groupId;

    uiHelper.openSidebar("contact");
  }

  public deleteContact(contactId: string) {
    uiHelper.showModal(
      "Удалить контакт?",
      "Контакт будет удалён без возможности восстановления",
      () => {
        StorageService.delete("contacts", contactId);
        uiHelper.closeSidebarWithBackdrop();
        new App(); // или вызвать метод renderAccordion + bindAccordionEvents
      }
    );
  }

  private saveContactToStorage(contact: Contact) {
    StorageService.save("contacts", contact);
  }
}

export default ContactManager;
