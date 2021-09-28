import Autobind from "../decorators/autobind.js";
import { DragTarget } from "../models/drag-drop-interfaces.js";
import { TaskData, TaskStatus } from "../models/taskData.js";
import { StaticDetails } from "../utilities/staticDetails.js";
import { Component } from "./component.js";
import { TaskManager } from "../managers/taskManager.js";
import { Validation } from "../utilities/validation.js";
import { TaskItem } from "./taskItem.js";

export class TaskList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedTasks: TaskData[];
    isFocused : boolean = false;
    
    get taskManager() : TaskManager { return TaskManager.getInstance(); }

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
        this.taskManager.moveTask(taskId, this.type);
    }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    this.taskManager.addListener((tasks: TaskData[]) => {
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