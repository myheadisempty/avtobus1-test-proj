import type { Validator } from "../validators/validator";

export class FormField {
  private element: HTMLInputElement | HTMLSelectElement;
  private validators: Validator[] = [];
  private errorElement: HTMLElement | null = null;
  private isValid = true;

  constructor(
    private fieldId: string,
    private container: HTMLElement,
    private bemBlock: string = "form-field"
  ) {
    this.element = container.querySelector(`#${fieldId}`) as
      | HTMLInputElement
      | HTMLSelectElement;
    this.initializeErrorElement();
    this.setupEventListeners();
  }

  private initializeErrorElement() {
    this.errorElement = this.container.querySelector(
      `.${this.bemBlock}__error[data-field="${this.fieldId}"]`
    );

    if (!this.errorElement) {
      this.errorElement = document.createElement("div");
      this.errorElement.className = `${this.bemBlock}__error`;
      this.errorElement.setAttribute("data-field", this.fieldId);
      this.element.parentNode?.insertBefore(
        this.errorElement,
        this.element.nextSibling
      );
    }
  }

  private setupEventListeners() {
    this.element.addEventListener("blur", () => {
      this.validate();
    });

    this.element.addEventListener("input", () => {
      if (!this.isValid) {
        this.clearError();
      }
    });
  }

  addValidator(validator: Validator): FormField {
    this.validators.push(validator);
    return this;
  }

  validate() {
    const value = this.element.value;

    for (const validator of this.validators) {
      const result = validator.validate(value);

      if (!result.isValid) {
        this.showError(result.errorMessage || "Ошибка валидации");
        return false;
      }
    }

    this.clearError();
    return true;
  }

  private showError(message: string) {
    this.isValid = false;

    this.element.classList.add(`${this.bemBlock}__input--error`);

    const fieldContainer =
      this.element.closest(`.${this.bemBlock}`) || this.element.parentElement;
    fieldContainer?.classList.add(`${this.bemBlock}--error`);

    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.add(`${this.bemBlock}__error--visible`);
    }
  }

  private clearError() {
    this.isValid = true;

    this.element.classList.remove(`${this.bemBlock}__input--error`);

    const fieldContainer =
      this.element.closest(`.${this.bemBlock}`) || this.element.parentElement;
    fieldContainer?.classList.remove(`${this.bemBlock}--error`);

    if (this.errorElement) {
      this.errorElement.textContent = "";
      this.errorElement.classList.remove(`${this.bemBlock}__error--visible`);
    }
  }

  getValue() {
    return this.element.value.trim();
  }

  setValue(value: string) {
    this.element.value = value;
  }
}
