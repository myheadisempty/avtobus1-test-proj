import type { Contact } from "../../../../interfaces/contact";
import StorageService from "../../storage-servce";
import type { ValidationCallback, ValidationResult } from "../types";
import { Validator } from "./validator";

export class UniqueNameValidator extends Validator {
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
    console.log(existingContacts);
    const isUnique = !existingContacts.some(
      (contact) =>
        contact.name.toLowerCase() === value.trim().toLowerCase() &&
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
