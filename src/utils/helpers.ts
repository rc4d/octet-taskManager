import type { Task, TaskPriority, SortField, SortOrder } from '../types/task';

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Format date for display
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (compareDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

// Check if a task is overdue
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < today;
}

// Check if a task is due today
export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate.getTime() === today.getTime();
}

// Get priority weight for sorting
export function getPriorityWeight(priority: TaskPriority): number {
  const weights: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return weights[priority];
}

// Sort tasks
export function sortTasks(
  tasks: Task[],
  sortField: SortField,
  sortOrder: SortOrder
): Task[] {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'dueDate':
        // Tasks without due dates go to the end
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        comparison = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        break;
      case 'createdAt':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

// Get status display text
export function getStatusText(status: Task['status']): string {
  const statusMap: Record<Task['status'], string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };
  return statusMap[status];
}

// Get priority display text
export function getPriorityText(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
