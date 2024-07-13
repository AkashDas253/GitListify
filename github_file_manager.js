
class GitHubFileManager {
  constructor(octokit, owner, repo) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
  }

  async createOrUpdateFile(path, content, message) {
    try {
      const { data: { sha } } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path
      });

      // Update file if it exists
      const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: btoa(content),
        sha
      });
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        // Create file if it doesn't exist
        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: this.owner,
          repo: this.repo,
          path,
          message,
          content: btoa(content)
        });
        return response.data;
      } else {
        throw error;
      }
    }
  }

  async readFile(path) {
    try {
      const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path
      });

      const content = atob(data.content);
      return content;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(path, message) {
    try {
      const { data: { sha } } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path
      });

      const response = await this.octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        sha
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// export default GitHubFileManager;

// // Example usage
// import { Octokit } from "@octokit/rest";
// 
// const fileManager = new GitHubFileManager(octokit, 'greedyknapsack', 'to_do_data');

// (async () => {
//   try {
//     await fileManager.createOrUpdateFile('file.txt', 'Hello, world!', 'Initial commit');
//     const content = await fileManager.readFile('file.txt');
//     console.log(content);
//     await fileManager.createOrUpdateFile('file.txt', 'Hello, updated world!', 'Update file');
//     const updatedContent = await fileManager.readFile('file.txt');
//     console.log(updatedContent);
//     //await fileManager.deleteFile('path/to/your/file.txt', 'Delete file');
//   } catch (error) {
//     console.error(error);
//   }
// })();