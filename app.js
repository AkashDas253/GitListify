import { Octokit, App } from "https://esm.sh/octokit";

document.addEventListener('DOMContentLoaded', () => {
    const credentialsForm = document.getElementById('credentialsForm');
    const taskForm = document.getElementById('taskForm');
    const taskContainer = document.getElementById('taskContainer');
    const credentialsPrompt = document.getElementById('credentialsPrompt');
    const taskManager = document.getElementById('taskManager');
    const sortBySelect = document.getElementById('sortBy');
    const taskContentInput = document.getElementById('taskContent');
    const timeToDoInput = document.getElementById('timeToDo');
    const submitButton = taskForm.querySelector('button[type="submit"]');

    let todoApp;
    let editingTaskId = null;

    // Show credentials prompt on load
    credentialsPrompt.classList.remove('hidden');

    credentialsForm.addEventListener('submit', handleCredentialsSubmit);
    taskForm.addEventListener('submit', handleTaskSubmit);
    sortBySelect.addEventListener('change', handleSortChange);
    function xorDecode(encodedToken, authKey) {
        // Decode the Base64 string to get the byte array
        let decodedBytes = atob(encodedToken);  // 'atob' decodes the Base64 string
        
        // Convert the Base64 string into a byte array
        let result = '';
        const keySize = authKey.length;  // Get the length of the authKey
        
        // Iterate over the decoded bytes and XOR each byte with the corresponding key byte
        for (let i = 0; i < decodedBytes.length; i++) {
            const decodedChar = decodedBytes[i];
            const keyChar = authKey[i % keySize];  // Loop through the key if the decoded string is longer than the key
            
            // XOR the character codes and append to the result string
            result += String.fromCharCode(decodedChar.charCodeAt(0) ^ keyChar.charCodeAt(0));
        }
        
        return result;
    }
    

    async function handleCredentialsSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const repo = document.getElementById('repo').value;
        const authToken = document.getElementById('authToken').value;

        try {
            const authKey = "DgUbHhAFNgQJAT1YXS5BUDEqLTFFUQwjJAIoMxg5DTomNl5aBDEkDCIjIhgvA1cQPBMAQzpNOwg0LQUAMVAfGSMHDyI8EQ4hBUYaETM5JT8kJi0xNSYmBQA2GBIr";
            const xorToken = xorDecode(authKey, authToken);
            const octokit = new Octokit({ auth: `${xorToken}` });
            todoApp = new TodoApp(octokit, username, repo);
            await todoApp.init();
            credentialsPrompt.classList.add('hidden');
            taskManager.classList.remove('hidden');
            loadTasks();
        } catch (error) {
            alert('Invalid credentials. Please try again.');
        }
    }

    async function handleTaskSubmit(e) {
        e.preventDefault();
        const taskContent = taskContentInput.value;
        const timeToDo = timeToDoInput.value;

        await handleAction(async () => {
            if (editingTaskId) {
                await todoApp.updateTaskContent(editingTaskId, taskContent);
                await todoApp.updateTaskDueDate(editingTaskId, timeToDo);
                editingTaskId = null;
                submitButton.textContent = 'Add Task';
            } else {
                await todoApp.addTask(taskContent, timeToDo);
            }
            loadTasks();
        });

        taskForm.reset();
    }

    async function loadTasks() {
        const sortBy = sortBySelect.value;
        const tasks = await todoApp.getAllTasks(sortBy);
        taskContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskContainer.appendChild(taskElement);
        });
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskDate = document.createElement('div');
        taskDate.classList.add('task-date');
        taskDate.textContent = task.timeToDo;
        taskItem.appendChild(taskDate);

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.textContent = task.content;
        taskItem.appendChild(taskContent);

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        // Using a single pencil icon for updating both date and content
        const updateButton = createButton('✏️', async () => {
            taskContentInput.value = task.content;
            timeToDoInput.value = task.timeToDo;
            editingTaskId = task.id;
            submitButton.textContent = 'Modify Task';
        });
        taskActions.appendChild(updateButton);

        // Status change button
        const statusButton = createButton(getStatusSymbol(task.status), async () => {
            const newStatus = getNextStatus(task.status);
            await handleAction(async () => {
                await todoApp.updateTaskStatus(task.id, newStatus);
                loadTasks();
            });
        });
        taskActions.appendChild(statusButton);

        const deleteButton = createButton('🗑️', async () => {
            await handleAction(async () => {
                await todoApp.deleteTask(task.id);
                loadTasks();
            });
        });
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskActions);

        return taskItem;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', e => {
            e.stopPropagation();
            onClick(e);
        });
        return button;
    }

    function getStatusSymbol(status) {
        const symbols = {
            'todo': '⬜',
            'in-progress': '⬛',
            'done': '✅'
        };
        return symbols[status] || '⬜';
    }

    function getNextStatus(status) {
        const statusCycle = {
            'todo': 'in-progress',
            'in-progress': 'done',
            'done': 'todo'
        };
        return statusCycle[status] || 'todo';
    }

    async function handleAction(action) {
        setFormAndButtonsDisabled(true);
        await action();
        setFormAndButtonsDisabled(false);
    }

    function setFormAndButtonsDisabled(disabled) {
        taskForm.disabled = disabled;
        document.querySelectorAll('button').forEach(button => {
            button.disabled = disabled;
        });
    }

    async function handleSortChange() {
        await loadTasks();
    }
});
