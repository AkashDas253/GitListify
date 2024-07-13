// task_manager.js
// task_manager.js
class TodoApp {
    constructor(octokit, owner, repo) {
        this.fileManager = new GitHubFileManager(octokit, owner, repo);
        this.tasksFile = 'tasks.json'; // File name to store tasks in GitHub
        this.tasks = {}; // Initialize an empty object to store tasks
    }

    async init() {
        try {
            // Fetch existing tasks from GitHub
            const tasksContent = await this.fileManager.readFile(this.tasksFile);
            this.tasks = JSON.parse(tasksContent);
        } catch (error) {
            // If tasks.json does not exist, initialize with an empty object
            this.tasks = {};
        }
    }

    async saveTasks() {
        // Save tasks object to tasks.json in GitHub
        const tasksContent = JSON.stringify(this.tasks, null, 2);
        await this.fileManager.createOrUpdateFile(this.tasksFile, tasksContent, 'Update tasks');
    }

    async addTask(taskContent, timeToDo, status = 'todo') {
        await this.init();

        // Auto-generate task ID based on current timestamp
        const taskId = Date.now().toString();

        // Create task object
        const task = {
            content: taskContent,
            timeToDo: timeToDo,
            status: status
        };

        // Add task to tasks object
        this.tasks[taskId] = task;
        await this.saveTasks();

        return { id: taskId, ...task };
    }

    async getTask(taskId) {
        await this.init();

        // Return task from tasks object by taskId
        return this.tasks[taskId] || null;
    }

    async updateTaskContent(taskId, content) {
        return this.updateTask(taskId, { content });
    }

    async updateTaskDueDate(taskId, timeToDo) {
        return this.updateTask(taskId, { timeToDo });
    }

    async updateTaskStatus(taskId, status) {
        return this.updateTask(taskId, { status });
    }

    async updateTask(taskId, updatedTask) {
        await this.init();

        // Update task properties in tasks object
        if (this.tasks[taskId]) {
            if (updatedTask.content !== undefined) {
                this.tasks[taskId].content = updatedTask.content;
            }
            if (updatedTask.timeToDo !== undefined) {
                this.tasks[taskId].timeToDo = updatedTask.timeToDo;
            }
            if (updatedTask.status !== undefined) {
                this.tasks[taskId].status = updatedTask.status;
            }

            await this.saveTasks();
            return { id: taskId, ...this.tasks[taskId] };
        } else {
            throw new Error(`Task ${taskId} not found.`);
        }
    }

    async deleteTask(taskId) {
        await this.init();

        // Remove task from tasks object by taskId
        if (this.tasks[taskId]) {
            const deletedTask = this.tasks[taskId];
            delete this.tasks[taskId];
            await this.saveTasks();
            return { id: taskId, ...deletedTask };
        } else {
            throw new Error(`Task ${taskId} not found.`);
        }
    }

    async getAllTasks() {
        await this.init();

        // Return a copy of tasks object values as an array
        return Object.keys(this.tasks).map(taskId => ({ id: taskId, ...this.tasks[taskId] }));
    }
}





