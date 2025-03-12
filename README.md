## Get Started

You will be invited to the project first. Then, you have to setup ssh for this project

Prerequisites:

- Node 18+
- pnpm
- Setup ssh

To set up the app execute the following commands.

```bash
git clone git@github.com:Rawbots-Inc/unify-video-ui.git
cp .env.example .env
pnpm install
```

##### `pnpm dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

##### `pnpm build`

Builds the app for production to the `.next` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

##### `pnpm start`

Runs the app in the production mode.\
Require `pnpm build` before

# 📂 Project Structure

The root directory of the project is structured as follows:

```sh
src
|
+-- husky             # Hooks for commit or push (https://typicode.github.io/husky/#/)
|
+-- .next             # Build folder of Next.js (https://nextjs.org/docs/app/building-your-application/deploying)
|
+-- .vscode           # Editor configuration for VS Code
|
+-- public            # Folder containing static files not used in compilation
|
+-- src               # Main source code of the application
```

Most of the source code is located in the `src` folder with the following structure:

```sh
src
|
+-- apis              # All application APIs
|
+-- assets            # Folder containing static files such as images, fonts, etc.
|
+-- components        # Shared components used across the entire application
|   ├── core          # Core components unrelated to business logic
|
+-- constants         # Shared constants used throughout the application
|
+-- hooks             # Shared hooks used across the entire application
|   ├── core          # Core hooks unrelated to business logic
|
+-- lib               # Re-exporting different libraries preconfigured for the application
|
+-- app               # Routes defined by Next.js
|
+-- stores            # Global state management using Redux
|
+-- types             # Base types used across the application
|
+-- utils             # Shared utility functions
|
+-- styles             # Style css
```

---

## 📜 Conventional Commit

Standard commit syntax:

<type>(<optional scope>): <description>

### **Commit Types (`type`)**

- feat: Add or remove a new feature to the API/UI.
- fix: Fix an API/UI bug.
- refactor: Improve code without changing behavior.
- test: Add or update test cases.
- build: Changes affecting the build process, CI/CD, dependencies, etc.

### **Valid Commit Message Examples:**

```sh
feat: add email notifications on new direct messages
feat(shopping-cart): add the amazing button
fix(api): fix wrong calculation of request body checksum
```

---

## 🔠 Naming Conventions

- **Use kebab-case** for file names.
- Examples:
  ```sh
  - use-screen.ts
  - login-button.tsx
  ```
