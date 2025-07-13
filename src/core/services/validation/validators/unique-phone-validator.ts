import type { Contact } from "../../../../interfaces/contact";
import StorageService from "../../storage-servce";
import type { ValidationCallback, ValidationResult } from "../types";
import { Validator } from "./validator";

export class UniquePhoneValidator extends Validator {
  currentContactId?: string;

  constructor(
    errorMessage: string,
    cb: ValidationCallback,
    currentContactId?: string
  ) {
    super(errorMessage, cb);

    this.currentContactId = currentContactId;
  }

  validate(value: string): ValidationResult {
    const existingContacts = StorageService.getAll<Contact>("contacts");
    const isUnique = !existingContacts.some(
      (contact) =>
        contact.phone.trim() === value.trim() &&
        contact.id !== this.currentContactId
    );

    if (!isUnique) {
      this.triggerCallback();
    }

    return {
      isValid: isUnique,
      errorMessage: isUnique ? undefined : this.errorMessage,
    };
  }
}
