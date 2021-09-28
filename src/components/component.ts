import {Validation} from '../utilities/validation';

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    // Where to put element
    hostElement: T;
    // Type of element
    element: U;
  
    constructor(
      templateId: string,
      hostElementId: string,
      insertElementLocation: InsertPosition,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      ) as HTMLTemplateElement;
  
      Validation.checkHTMLElementIsValid(
        [this.templateElement],
        "task-input does not exist in index as HTMLTemplateElement"
      );
  
      this.hostElement = document.getElementById(hostElementId) as T;
      Validation.checkHTMLElementIsValid(
        [this.hostElement],
        `${hostElementId} does not exist in index`
      );
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
  
      this.element = importedNode.firstElementChild as U;
  
      if (newElementId) this.element.id = newElementId;
  
      this.attach(insertElementLocation);
    }
  
    private attach(position: InsertPosition) {
      this.hostElement.insertAdjacentElement(position, this.element);
    }
  
    abstract configure(): void;
    abstract renderContent(): void;
  }