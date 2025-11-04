# 3B — Advanced Todo List Application with Theme Switcher

This project is an advanced Todo List application built with **React Native (Expo)** and integrated with **Convex** for real-time backend functionality. It features light/dark theme switching, full CRUD operations, and a clean, pixel-perfect UI as per the provided Figma design.

---

## Table of Contents

- [Figma Design](#figma-design)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running the App](#running-the-app)
- [Convex Setup](#convex-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Testing & Deployment](#testing--deployment)
- [Submission Checklist](#submission-checklist)

---

## Figma Design

The UI design can be found here:  
[Figma Todo App Design](https://www.figma.com/design/NRbd5hcrQcAa1LBbctUhf9/todo-app?node-id=0-1&p=f&m=dev)

---

## Features

### Theme Switcher

- Light and dark modes
- Smooth transition animations
- Persistent theme preference across app restarts
- Theme affects all UI elements: backgrounds, text, buttons

### Todo CRUD Operations (Using Convex)

### Todo CRUD Operations

- **Read:** `useTodo` fetches todos via Convex queries; optional filtering based on status (`Active` / `Completed`)
- **Create:** `useCreateTodo` handles adding a new todo, updates UI optimistically
- **Delete:** `useDeleteTodo` supports deleting single or completed todos with optimistic updates
- **Update:** handled via toggling `completed` status inside the `ListItem` component

### Filtering & Searching

- Todos can be filtered by:
  - `All`
  - `Active` (not completed)
  - `Completed`

### UI/UX Features

- Search and filter todos (All, Active, Completed)
- Empty states & loading indicators
- Drag and sort functionality

### Acceptance Criteria

- Pixel-perfect implementation
- Smooth theme switching with persistence
- Full CRUD functionality (real-time via Convex)
- Proper error handling for network and validation
- Responsive on all screen sizes
- Clean, modular code structure
- Accessibility compliance (contrast, screen reader support)

---

## Tech Stack

- **Frontend:** React Native, Expo, Expo Router, React Navigation
- **Backend:** Convex (real-time database)
- **State Management:** React Hooks
- **Styling:** Styled Components & Theming
- **Animations:** Reanimated / React Native Gesture Handler

---

## Setup Instructions

1. **Clone the Repository**

```bash
git clone <your-github-repo-url>
cd <project-folder>
```

````

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```
````

3. **Start Expo**

```bash
npm start
# or
yarn start
```

4. **Run on Device or Emulator**

- For iOS: `i` (Expo CLI)
- For Android: `a` (Expo CLI)
- For web: `w` (Expo CLI)

---

## Convex Setup

1. Install the Convex CLI:

```bash
npm install -g convex
```

2. Login and initialize your Convex project:

```bash
convex login
convex init
```

3. Set up collections:

- `todo` collection with fields:
  - `title` (string)
  - `description` (string, optional)
  - `completed` (boolean)
  - `createdAt` (timestamp)
  - `dueDate` (timestamp, optional)

4. Push your functions to Convex:

```bash
convex dev
```

5. In the app, update your `api` import to match your Convex project:

```ts
import { api } from "@/convex/_generated/api";
```

---

## Environment Variables

Create a `.env` file at the project root if needed:

```env
CONVEX_PROJECT_URL=<your-convex-project-url>
```

> Ensure this URL is correctly referenced in your Convex client configuration.

---

## Project Structure

```
├── app/                   # Main app components
├── assets/                # Images and fonts
├── components/            # Reusable UI components
│   └── ui/
├── hooks/                 # Custom React hooks
├── convex/                # Convex queries and mutations
├── utils.ts                 # Utility functions
├── App.tsx                # Entry point
├── README.md
├── package.json
└── tsconfig.json
```
