import { TaskStatus } from "./models/taskData.js";
import { TaskManager } from "./managers/taskManager.js";
import { TaskInput } from "./components/taskInput.js";
import { TaskList } from './components/taskList.js';

TaskManager.getInstance();

new TaskInput();
new TaskList(TaskStatus.toDo);
new TaskList(TaskStatus.doing);
new TaskList(TaskStatus.done);

