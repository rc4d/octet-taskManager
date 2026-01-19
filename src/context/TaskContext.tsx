import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskAction, TaskFormData, FilterState } from '../types/task';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, sortTasks } from '../utils/helpers';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: FilterState;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'task-manager-tasks';

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [action.payload, ...state];
    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    case 'SET_TASKS':
      return action.payload;
    default:
      return state;
  }
}

const defaultFilters: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sortField: 'createdAt',
  sortOrder: 'desc',
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks);
  const [filters, setFiltersState] = React.useState<FilterState>(defaultFilters);

  // Sync tasks to localStorage whenever they change
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  // Initialize tasks from localStorage on mount
  useEffect(() => {
    if (storedTasks.length > 0 && tasks.length === 0) {
      dispatch({ type: 'SET_TASKS', payload: storedTasks });
    }
  }, []);

  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, []);

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    const existingTask = tasks.find((t) => t.id === id);
    if (!existingTask) return;

    const updatedTask: Task = {
      ...existingTask,
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate || null }),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    updateTask(id, { status });
  }, [updateTask]);

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const getTaskById = useCallback((id: string) => {
    return tasks.find((task) => task.id === id);
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((task) => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // Apply sorting
    result = sortTasks(result, filters.sortField, filters.sortOrder);

    return result;
  }, [tasks, filters]);

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      filters,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      setFilters,
      getTaskById,
    }),
    [tasks, filteredTasks, filters, addTask, updateTask, deleteTask, updateTaskStatus, setFilters, getTaskById]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
