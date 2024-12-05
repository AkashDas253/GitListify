# Task Manager

This is a static website hosted on GitHub that uses the Octokit API to save data on a specified GitHub repository. The website allows users to manage tasks.

[View the live website here](https://akashdas253.github.io/Todo_Github/)

## Features

- User authentication with GitHub
- Task creation with due dates
- Task sorting by creation date or due date
- Task editing and deletion

## Tech Stack

- HTML
- CSS
- JavaScript
- Octokit API  [[Octokit API documentation](https://docs.github.com/en/rest)]
- Git
- GitHub

## Setup and Usage

Follow the steps below to set up the **Task Manager** on your GitHub account:

### 1. **Fork the Repository**
   - Go to the [Task Manager Repository](https://github.com/AkashDas253/Todo_Github).
   - Click on the **Fork** button to create your own copy of the repository.

### 2. **Create a GitHub Personal Access Token (PAT)**
   - Go to [GitHub's Token Management Page](https://github.com/settings/tokens).
   - Click on **Generate new token**.
   - Choose **repo** (full control of private repositories) permission.
   - Under **Fine-grained access**, specify the repository you want to interact with.
   - Copy the token and store it securely, as it will not be shown again.

### 3. **Set Up Environment Variables**
   - Create a `.env` file in the root directory of your cloned repository.
   - Add the following variables to the `.env` file:
     ```bash
     AUTH_TOKEN=your-github-personal-access-token
     AUTH_KEY=your-secret-key-for-xor
     ```
   - Replace `your-github-personal-access-token` with the token you generated in step 2.
   - Replace `your-secret-key-for-xor` with a secret key of your choice for XOR encoding.

### 4. **Run Python Script to Create Encoded Token**
   - To ensure security, run a Python script to XOR encode the GitHub token.
   - Save the Python script `xor_encode.py` and use the following code to encode the token:
     ```python
     import base64

     def xor_encode(auth_token, auth_key):
         auth_token_bytes = auth_token.encode('utf-8')
         auth_key_bytes = auth_key.encode('utf-8')
         
         encoded_bytes = bytearray()
         for i in range(len(auth_token_bytes)):
             key_char = auth_key_bytes[i % len(auth_key_bytes)]  # Loop through the key
             encoded_bytes.append(auth_token_bytes[i] ^ key_char)
         
         return base64.b64encode(encoded_bytes).decode('utf-8')

     # Replace with your actual token and key
     auth_token = "your-github-token"
     auth_key = "your-xor-key"
     encoded_token = xor_encode(auth_token, auth_key)
     print("Encoded Token:", encoded_token)
     ```
   - Run the script to get the **encoded token** and use it for embedding into your app.
   - Replace the value in `encodedToken` in your JavaScript file (`app.js`) with the output from the Python script.

### 5. **Modify JavaScript for Your Own Use**
   - Open the JavaScript files:
     - `github_file_manager.js`: Handles interactions with the GitHub API.
     - `task_manager.js`: Manages tasks on the website.
     - `app.js`: Main script for the app.
   - In `app.js`, replace the hardcoded `encodedToken` with the one generated from the Python script.

### 6. **Push Changes to Your GitHub Repository**
   - Commit the changes to your forked repository and push them:
     ```bash
     git add .
     git commit -m "Set up Task Manager with own GitHub repo"
     git push origin main
     ```
   - The app will now work with your GitHub repository for task management.

### 7. **Run the Application**
   - Open the `index.html` file in your browser or deploy the website using GitHub Pages.
   - You’ll be prompted to authenticate with your GitHub username, the repository you wish to store tasks in, and your encoded GitHub token.
   - After authentication, you can add, edit, delete, and sort tasks, which will be saved in your GitHub repository.

## Contributing

Contributions are welcome! If you want to contribute:

1. Fork the repository.
2. Clone your forked repository locally.
3. Make your changes.
4. Push your changes to your fork and create a pull request to merge with the original repository.

---

This setup guide helps you integrate the **Task Manager** with your GitHub repository and run the app securely with XOR-encoded GitHub tokens.
