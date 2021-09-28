import Autobind from "../decorators/autobind.js";
import { TaskManager } from "../managers/taskManager.js";
import { Validatable, Validation } from "../utilities/validation.js";
import { Component } from "./component.js";

export class TaskInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    effortInputElement: HTMLInputElement;
  
    constructor() {
      super("task-input", "app", "afterbegin", "user-input");
  
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.effortInputElement = this.element.querySelector(
        "#effort"
      ) as HTMLInputElement;
      Validation.checkHTMLElementIsValid(
        [
          this.titleInputElement,
          this.descriptionInputElement,
          this.effortInputElement,
        ],
        "An input element does not have correct id assigned"
      );
  
      this.configure();
    }
  
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
  
    renderContent() {}
  
    private gatherUserInput(): [string, string, number] | void {
      const inputTitle = this.titleInputElement.value;
      const inputDescription = this.descriptionInputElement.value;
      const inputEffort = this.effortInputElement.value;
  
      const titleValidate: Validatable = { value: inputTitle, required: true };
      const descriptionValidate: Validatable = { value: inputDescription };
      const effortValidate: Validatable = {
        value: +inputEffort,
        required: true,
        min: 1,
        max: 10,
      };
  
      if (
        !Validation.validate(titleValidate) ||
        !Validation.validate(descriptionValidate) ||
        !Validation.validate(effortValidate)
      ) {
        alert("Invalid input, please try again!");
        return;
      }
  
      this.clearInput();
      return [inputTitle, inputDescription, +inputEffort];
    }
  
    private clearInput() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.effortInputElement.value = "";
    }
  
    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();

      if (Array.isArray(userInput)) {
        const [title, desc, effort] = userInput;
        TaskManager.getInstance().addTask(title, desc, effort);
        console.log(title, desc, effort);
      }
    }
  }