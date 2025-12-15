# Cognizant Coach Dashboard

A modern dashboard for Cognizant coaches to manage training batches, track trainee progress, attendance, and performance.

## Features

- 📊 **Batch Management**: View and manage ongoing and graduated training batches
- 📈 **Progress Tracking**: Pie charts showing trainee schedule status distribution
- 👥 **Attendance Management**: Mark individual students as absent
- 📋 **Excel Upload**: Upload Excel files to automatically update dashboard data
- 👤 **Student Details**: View complete student information including scores and attendance
- 💰 **Stakeholder Tracking**: Track trainer/mentor hours and payouts
- 🏆 **Qualifier Scores**: View batch qualifier performance metrics

---

## Local Development Setup (VS Code)

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun**
- **VS Code** - [Download here](https://code.visualstudio.com/)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - The app will be available at `http://localhost:5173`
   - Login with any email/password to access the dashboard

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## Using the Excel Upload Feature

1. Login to the dashboard
2. Click "Choose Excel File" button
3. Upload your Excel file (.xlsx or .xls)
4. The dashboard will automatically update with the new data

See `EXCEL_TEMPLATE.md` for the required Excel file format.

---

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable React components
│   ├── ui/          # Shadcn UI components
│   ├── BatchCard.tsx
│   ├── ExcelUpload.tsx
│   ├── AttendanceSection.tsx
│   └── ...
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── BatchDetail.tsx
│   ├── StudentDetail.tsx
│   └── ...
├── lib/             # Utilities and mock data
└── hooks/           # Custom React hooks
```

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

# Original Lovable Documentation

## Project info

**URL**: https://lovable.dev/projects/df7c9c9d-3965-4b81-b095-a1e00c0be295

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df7c9c9d-3965-4b81-b095-a1e00c0be295) and start prompting.

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df7c9c9d-3965-4b81-b095-a1e00c0be295) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
