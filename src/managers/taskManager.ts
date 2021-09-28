import { Manager } from "./manager.js";
import { TaskData, TaskStatus } from "../models/taskData.js";

export class TaskManager extends Manager<TaskData> {
    private tasks: TaskData[] = [];
    private static instance: TaskManager;
  
    private constructor() {
      super();
    }
  
    static getInstance() {
      this.instance ??= new TaskManager();
      return this.instance;
    }
  
    addTask(title: string, description: string, effort: number) {
      const newTask = new TaskData(
        Math.random().toString(),
        title,
        description,
        effort,
        TaskStatus.toDo
      );
      this.tasks.push(newTask);
      this.updateListeners();
    }
  
    moveTask(taskId: string, newStatus: TaskStatus) {
      const task = this.tasks.find(tempTask => tempTask.id == taskId);
  
      if(task == null || task.status === newStatus)
          return;
  
      task.status = newStatus;
      this.updateListeners();
    }
  
    private updateListeners(){
      for (const listener of this.listeners) {
          listener(this.tasks.slice());
        }
    }
  }