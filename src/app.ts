/** Validation */
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatebleInput: Validatable): boolean {
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

function checkHTMLElementIsValid(
    elements: HTMLElement[],
    errorMessage: string
  ) {
    for (const element in elements) {
      if (element === null) throw new Error(errorMessage);
    }
  }

/** Decorators */
function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,

    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

enum TaskStatus{
    toDo = "To Do",
    doing = "Doing",
    done = "Done"
}

class TaskManager {
    private listeners: any[] = [];
    private tasks: any[] = [];
    private static instance: TaskManager;

    private constructor() {}

    static getInstance(){

        this.instance ??= new TaskManager();
        return this.instance;
    }

    addListener(listener : Function) {
        this.listeners.push(listener);
    }

    addProject(title: string, description: string, effort: number) {
        const newTask = {
            id: Math.random().toString(),
            title : title,
            description: description,
            effort: effort
        };
        this.tasks.push(newTask);

        for(const listener of this.listeners){
            listener(this.tasks.slice());
        }
    }
}

// TaskInput
class TaskInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  effortInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "task-input"
    ) as HTMLTemplateElement;
    checkHTMLElementIsValid(
      [this.templateElement],
      "task-input does not exist in index as HTMLTemplateElement"
    );

    this.hostElement = document.getElementById("app") as HTMLDivElement;
    checkHTMLElementIsValid(
      [this.hostElement],
      "app does not exist in index as HTMLDivElement"
    );

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.effortInputElement = this.formElement.querySelector(
      "#effort"
    ) as HTMLInputElement;
    checkHTMLElementIsValid(
      [
        this.titleInputElement,
        this.descriptionInputElement,
        this.effortInputElement,
      ],
      "An input element does not have correct id assigned"
    );

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const inputTitle = this.titleInputElement.value;
    const inputDescription = this.descriptionInputElement.value;
    const inputEffort = this.effortInputElement.value;

    const titleValidate: Validatable = { value: inputTitle, required: true };
    const descriptionValidate: Validatable = { value: inputDescription};
    const effortValidate: Validatable = { value: +inputEffort, required: true, min: 1, max: 10 };

    if(!validate(titleValidate) || !validate(descriptionValidate) || !validate(effortValidate)) {
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
      taskManager.addProject(title, desc, effort);
      console.log(title, desc, effort);
    }
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

// Task List
class TaskList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;
    assignedTasks: any[];

    constructor(private type : TaskStatus) {
        this.templateElement = document.getElementById(
            "task-list"
          ) as HTMLTemplateElement;

          checkHTMLElementIsValid(
            [this.templateElement],
            "task-input does not exist in index as HTMLTemplateElement"
          );
      
          this.hostElement = document.getElementById("app") as HTMLDivElement;

          checkHTMLElementIsValid(
            [this.hostElement],
            "app does not exist in index as HTMLDivElement"
          );
      
          const importedNode = document.importNode(
            this.templateElement.content,
            true
          );
      
          this.sectionElement = importedNode.firstElementChild as HTMLElement;
          this.sectionElement.id = `${this.type.toLowerCase()}-tasks`;
        
          this.assignedTasks = [];

          taskManager.addListener((tasks : any) => {
              this.assignedTasks = tasks;
              this.renderTasks();
          });

          this.attach();
          this.renderContent();
    }

    private renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`) as HTMLUListElement;
        checkHTMLElementIsValid([listEl], `${this.type}-tasks-list does not exist in index as HTMLUListElement`);

        for(const taskItem of this.assignedTasks) {
            const listItem = document.createElement("li");
            listItem.textContent = taskItem.title;
            listEl.appendChild(listItem);
        }
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.sectionElement);
    }

    private renderContent() {
        const listId = `${this.type}-tasks-list`;
        this.sectionElement.querySelector("ul")!.id = listId;
        this.sectionElement.querySelector("h2")!.textContent = this.type.toString().toUpperCase() + " TASKS";
    }
}


const taskManager = TaskManager.getInstance();

const taskInput = new TaskInput();
const toDoList = new TaskList(TaskStatus.toDo);
const doingList = new TaskList(TaskStatus.doing);
const doneList = new TaskList(TaskStatus.done);
