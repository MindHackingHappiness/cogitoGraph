# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/90f39cb1-cfaa-4c44-8385-039e73e904bf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/90f39cb1-cfaa-4c44-8385-039e73e904bf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

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
- React Three Fiber
- Three.js
- Vitest

## GitHub Data Visualization

Switch to the **GITHUB DATA** scene to visualize any user's repositories in 3D:

1. Click the "GITHUB DATA" button in the holographic UI (top-left panel)
2. Enter a GitHub username
3. Toggle between ☁️ **MOCK** (fast, 100 repos) or 🌐 **REAL** (live GitHub API)
4. Explore the orbital visualization:
   - **Node size**: Indicates popularity (star count)
   - **Node color**: Represents programming language
   - **Hover**: View repository details
   - **Click**: Open repository on GitHub

### Features

- **Real GitHub API Integration**: Fetch live data from GitHub's REST API
- **Mock Mode**: Fast development/testing with 100 generated repositories
- **Topic Clustering**: Groups repos by technology (frontend, backend, ML/AI, devops, testing)
- **3D Orbital Layout**: Repositories orbit around topic cluster centers
- **Interactive**: Click to open repos, hover for details
- **Cyberpunk Aesthetic**: Matches cogitoGraph's visual theme

### Technical Details

- **Data Source**: GitHub REST API (`api.github.com/users/{username}/repos`)
- **Rate Limiting**: Handles 403 errors with reset time information
- **Caching**: 5-minute TTL for real API, infinite cache for mock mode
- **Performance**: Optimized with React.memo and useMemo for 60fps rendering

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/90f39cb1-cfaa-4c44-8385-039e73e904bf) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
