import Autobind from "../decorators/autobind.js";
import { Draggable } from "../models/drag-drop-interfaces.js";
import { TaskData } from "../models/taskData.js";
import { StaticDetails } from "../utilities/staticDetails.js";
import { Component } from "./component.js";

export class TaskItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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