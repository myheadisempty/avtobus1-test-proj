import type { ValidationCallback, ValidationResult } from "../types";

export abstract class Validator {
  protected errorMessage: string;
  callback?: ValidationCallback;

  constructor(errorMessage: string, alertCallback?: ValidationCallback) {
    this.errorMessage = errorMessage;
    this.callback = alertCallback;
  }

  abstract validate(value: string, context?: any): ValidationResult;

  protected triggerCallback() {
    if (this.callback && this.errorMessage) {
      this.callback(this.errorMessage);
    }
  }
}
