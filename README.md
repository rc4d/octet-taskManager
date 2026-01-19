# TaskFlow - Task Manager Application

A modern, responsive task manager application built with React, TypeScript, and Tailwind CSS. Manage your tasks efficiently with features like filtering, sorting, and persistent storage.

## Features

- **Create Tasks**: Add new tasks with title, description, priority, status, and due date
- **View Tasks**: See all your tasks in a clean, card-based list view
- **Update Tasks**: Edit task details or quickly toggle status with one click
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Data Persistence**: All tasks are saved to LocalStorage and persist across browser sessions
- **Filtering**: Filter tasks by status (To Do, In Progress, Done) and priority (Low, Medium, High)
- **Search**: Search tasks by title or description
- **Sorting**: Sort tasks by date created, due date, priority, or title
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: React Context + useReducer
- **Persistence**: LocalStorage
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher (20.x+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rc4d/task-manager.git
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/          # React components
│   ├── EmptyState.tsx   # Empty list placeholder
│   ├── FilterBar.tsx    # Search and filter controls
│   ├── TaskCard.tsx     # Individual task card
│   ├── TaskForm.tsx     # Create/Edit task modal
│   └── TaskList.tsx     # Task list container
├── context/
│   └── TaskContext.tsx  # Global state management
├── hooks/
│   └── useLocalStorage.ts # LocalStorage persistence hook
├── types/
│   └── task.ts          # TypeScript interfaces
├── utils/
│   └── helpers.ts       # Utility functions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Data Model

Each task contains the following fields:

```typescript
interface Task {
  id: string;           // Unique identifier
  title: string;        // Task title (required)
  description: string;  // Task description
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;  // ISO date string
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

## Design Decisions

### State Management
Used React Context with useReducer for state management instead of external libraries like Redux or Zustand. This keeps the bundle size small while providing sufficient functionality for a task manager application.

### Data Persistence
Chosen LocalStorage for simplicity and zero-backend requirements. Data syncs across tabs and persists across browser sessions. For a production app, this could be extended to use a backend API.

### UI/UX Considerations
- **Visual feedback**: Color-coded priority badges and status indicators
- **Overdue highlighting**: Tasks past their due date are highlighted in red
- **Keyboard accessibility**: All interactive elements are keyboard accessible
- **Responsive design**: Mobile-first approach with breakpoints for larger screens
- **Dark mode**: Respects system preference and allows manual toggle