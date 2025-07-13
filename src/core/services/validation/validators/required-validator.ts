import type { ValidationResult } from "../types";
import { Validator } from "./validator";

export class RequiredValidator extends Validator {
  constructor(errorMessage = "Поле является обязательным") {
    super(errorMessage);
  }

  validate(value: string): ValidationResult {
    const isValid = value.trim().length > 0;
    return {
      isValid,
      errorMessage: isValid ? undefined : this.errorMessage,
    };
  }
}
