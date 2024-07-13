# Task Manager

This is a static website hosted on GitHub that uses the Octokit API to save data on a specified GitHub repository. The website allows users to manage tasks.

[View the live website here](https://<username>.github.io/<repository>)

## Features

- User authentication with GitHub
- Task creation with due dates
- Task sorting by creation date or due date
- Task editing and deletion

## Usage

1. Open the website.
2. Enter your GitHub username, the repository where you want to save your tasks, and your GitHub auth token.
3. Click 'Submit'.
4. You can now add tasks with the 'Add Task' form. Tasks will be saved to the specified GitHub repository.
5. You can sort tasks by their creation date or due date using the 'Sort By' dropdown.

## Implementation

The website is implemented in HTML, CSS, and JavaScript. It uses the Octokit API to interact with GitHub.

The main HTML file is [`index.html`](https://github.com/your-username/your-repo/blob/main/index.html).

The CSS styles are in [`styles.css`](https://github.com/your-username/your-repo/blob/main/styles.css).

The JavaScript code is in [`github_file_manager.js`](https://github.com/your-username/your-repo/blob/main/github_file_manager.js), [`task_manager.js`](https://github.com/your-username/your-repo/blob/main/task_manager.js), and [`app.js`](https://github.com/your-username/your-repo/blob/main/app.js). `github_file_manager.js` handles interactions with GitHub via the Octokit API. `task_manager.js` handles task management on the website. `app.js` is the main application script.

## Contributing

Contributions are welcome. Please open an issue to discuss your idea or submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)