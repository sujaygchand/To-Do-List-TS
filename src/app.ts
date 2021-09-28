import {Draggable, DragTarget} from './drag-drop-interfaces.js';
import { StaticDetails } from './utilities/staticDetails.js';
import {Validatable, Validation} from './utilities/validation.js';
import Autobind from "./decorators/autobind.js";
import { Component } from './components/component.js';
import { TaskData, TaskStatus } from "./models/taskData.js";
import {TaskManager} from "./managers/taskManager.js";

class TaskItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private taskData : TaskData;

    get effort(){
        return this.taskData?.effort;
    }

    constructor(hostId: string, task: TaskData) {
        super("single-task", hostId, "beforeend", task.id);
        this.taskData = task;

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer?.setData(StaticDetails.TEXT_PLAIN, this.taskData.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    @Autobind
    dragEndHandler(event: DragEvent): void {
        console.log("Drag end: " + this.taskData.title);
    }

    configure(): void {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent(): void {
        this.element.querySelector("h2")!.textContent = this.taskData.title;
        this.element.querySelector("h3")!.textContent = `Effort: ${this.effort}`;
        this.element.querySelector("p")!.textContent = this.taskData.description;
    }
}

// TaskInput
class TaskInput extends Component<HTMLDivElement, HTMLFormElement> {
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
      taskManager.addTask(title, desc, effort);
      console.log(title, desc, effort);
    }
  }
}

// Task List
class TaskList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedTasks: TaskData[];
    isFocused : boolean = false;

  constructor(private type: TaskStatus) {
    super("task-list", "app", "beforeend", `${type.toLowerCase()}-tasks`);

    this.assignedTasks = [];
    this.configure();
    this.renderContent();
  }

  @Autobind
    dragOverHandler(event: DragEvent): void {
        
        if(event.dataTransfer === null || event.dataTransfer.types[0] != StaticDetails.TEXT_PLAIN)
           return;
        
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add("droppable");
    }

    @Autobind
    dragLeaveHandler(event: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove("droppable");
    }

    @Autobind
    dropHandler(event: DragEvent): void {
        const taskId = event.dataTransfer!.getData(StaticDetails.TEXT_PLAIN);
        taskManager.moveTask(taskId, this.type);
    }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    taskManager.addListener((tasks: TaskData[]) => {
      const relevantTasks = tasks.filter((task) => {
        return task.status === this.type;
      });

      this.assignedTasks = relevantTasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    const listEl = document.getElementById(
      `${this.type}-tasks-list`
    ) as HTMLUListElement;
    Validation.checkHTMLElementIsValid(
      [listEl],
      `${this.type}-tasks-list does not exist in index as HTMLUListElement`
    );

    listEl.innerHTML = "";

    for (const taskItem of this.assignedTasks) {
    //   const listItem = document.createElement("li");
    //   listItem.textContent = taskItem.title;
    //   listEl.appendChild(listItem);
        new TaskItem(this.element.querySelector("ul")!.id, taskItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-tasks-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toString().toUpperCase() + " TASKS";
  }
}

const taskManager = TaskManager.getInstance();

const taskInput = new TaskInput();
const toDoList = new TaskList(TaskStatus.toDo);
const doingList = new TaskList(TaskStatus.doing);
const doneList = new TaskList(TaskStatus.done);

