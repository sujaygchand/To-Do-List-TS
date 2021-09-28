import { TaskStatus } from "./models/taskData";
import { TaskManager } from "./managers/taskManager";
import { TaskInput } from "./components/taskInput";
import { TaskList } from './components/taskList';

TaskManager.getInstance();

new TaskInput();
new TaskList(TaskStatus.toDo);
new TaskList(TaskStatus.doing);
new TaskList(TaskStatus.done);

