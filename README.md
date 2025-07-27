# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e7add94a-b181-432f-91dd-b205b8a3f9ed

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e7add94a-b181-432f-91dd-b205b8a3f9ed) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

This project recommends using **Node.js 20**, which is tracked in the `.nvmrc` file.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e7add94a-b181-432f-91dd-b205b8a3f9ed) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Configuration

Create a `.env` file based on `.env.example` and provide your Gemini API key:

```bash
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=<your Gemini key>
```

The application uses the free Gemini 2.5 Flash model with a daily limit of 500 requests. The code enforces a safety threshold of 490 requests per day to avoid hitting the quota.
Responses are limited to 4096 tokens to encourage concise answers and reduce quota usage.

### Limiting response length
`VITE_GEMINI_MAX_OUTPUT_TOKENS` controls the maximum number of tokens Gemini will return. It's set to `4096` in `.env.example`, but you can lower this value in your `.env` file if the answers are too long.

### Clarifying specifications
If the automatic comparison doesn't provide enough specification data, the app now prompts you to enter precise specs for the device that needs clarification. This ensures the analysis is as accurate as possible.

### Responsive specification dialog
The precise specs dialog now adjusts to smaller screens and shows fields based on the device category (computer or vehicle). This keeps the form focused only on the information you need to provide.

### Immediate loading feedback
Clicking **Compare Now** instantly displays a spinner and small game so you know the comparison is running.

### Navigating away
Selecting the header while a result is on screen takes you back to the homepage, but first asks if you really want to leave.
