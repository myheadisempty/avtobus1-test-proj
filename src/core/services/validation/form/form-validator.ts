import { FormField } from "./form-field";

export class FormValidator {
  private fields: Map<string, FormField> = new Map();

  addField(
    fieldId: string,
    container: HTMLElement,
    bemBlock?: string
  ): FormField {
    const field = new FormField(fieldId, container, bemBlock);
    this.fields.set(fieldId, field);
    return field;
  }

  getField(fieldId: string): FormField | undefined {
    return this.fields.get(fieldId);
  }

  validateAll(): boolean {
    let isFormValid = true;

    for (const [_, field] of this.fields) {
      const isFieldValid = field.validate();
      if (!isFieldValid) {
        isFormValid = false;
      }
    }

    return isFormValid;
  }

  getFormData(): Record<string, string> {
    const data: Record<string, string> = {};

    for (const [fieldId, field] of this.fields) {
      data[fieldId] = field.getValue();
    }

    return data;
  }

  resetForm() {
    for (const [_, field] of this.fields) {
      field.setValue("");
    }
  }
}
