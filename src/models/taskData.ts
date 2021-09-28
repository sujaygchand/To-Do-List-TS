export enum TaskStatus {
    toDo = "To Do",
    doing = "Doing",
    done = "Done",
  }
  
  export class TaskData {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public effort: number,
      public status: TaskStatus
    ) {}
  }