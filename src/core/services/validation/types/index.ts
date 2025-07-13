export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ValidationConfig {
  fieldId: string;
  validators: any[];
  bemBlock?: string;
}

export interface FormData {
  [key: string]: string;
}

export type ValidationCallback = (message: string) => void;
