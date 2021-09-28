export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export class Validation {
  static validate(validatebleInput: Validatable): boolean {
    // Empty input
    if (
      validatebleInput.required &&
      validatebleInput.value.toString().trim().length < 1
    ) {
      return false;
    }

    // string lengths
    if (typeof validatebleInput.value === "string") {
      if (validatebleInput.minLength != null) {
        if (validatebleInput.value.length < validatebleInput.minLength)
          return false;
      }

      if (validatebleInput.maxLength != null) {
        if (validatebleInput.value.length > validatebleInput.maxLength)
          return false;
      }
    }
    // number limits
    else if (typeof validatebleInput.value === "number") {
      if (validatebleInput.min != null) {
        if (validatebleInput.value < validatebleInput.min) return false;
      }

      if (validatebleInput.max != null) {
        if (validatebleInput.value > validatebleInput.max) return false;
      }
    }

    return true;
  }

  static checkHTMLElementIsValid(
    elements: HTMLElement[],
    errorMessage: string
  ) {
    for (const element in elements) {
      if (element === null) throw new Error(errorMessage);
    }
  }
}
