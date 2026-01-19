import { useState } from 'react';
import {
  Calendar,
  Flag,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { Task } from '../types/task';
import { useTasks } from '../context/TaskContext';
import {
  formatDate,
  isOverdue,
  isDueToday,
  getStatusText,
  formatRelativeTime,
} from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  low: {
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: 'text-emerald-500',
  },
  medium: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: 'text-amber-500',
  },
  high: {
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    icon: 'text-rose-500',
  },
};

const statusConfig = {
  todo: {
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    icon: Circle,
    iconColor: 'text-slate-400',
  },
  'in-progress': {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Clock,
    iconColor: 'text-blue-500',
  },
  done: {
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
    iconColor: 'text-green-500',
  },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask, updateTaskStatus } = useTasks();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const taskIsOverdue = task.status !== 'done' && isOverdue(task.dueDate);
  const taskIsDueToday = task.status !== 'done' && isDueToday(task.dueDate);

  const handleStatusToggle = () => {
    const statusOrder: Task['status'][] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateTaskStatus(task.id, nextStatus);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in ${
        task.status === 'done' ? 'opacity-75' : ''
      }`}
    >
      {/* Main Content */}
      <div className="flex gap-3">
        {/* Status Toggle Button */}
        <button
          onClick={handleStatusToggle}
          className={`flex-shrink-0 mt-0.5 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${statusConfig[task.status].iconColor}`}
          title={`Status: ${getStatusText(task.status)}. Click to change.`}
        >
          <StatusIcon size={22} />
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className={`text-base font-medium text-slate-900 dark:text-white mb-1 ${
              task.status === 'done' ? 'line-through text-slate-500 dark:text-slate-400' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[task.priority].color}`}
            >
              <Flag size={12} className={priorityConfig[task.priority].icon} />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[task.status].color}`}
            >
              {getStatusText(task.status)}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  taskIsOverdue
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    : taskIsDueToday
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {taskIsOverdue && <AlertTriangle size={12} />}
                <Calendar size={12} />
                {formatDate(task.dueDate)}
              </span>
            )}

            {/* Updated Time */}
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto hidden sm:block">
              Updated {formatRelativeTime(task.updatedAt)}
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Task actions"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 animate-scale-in">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Delete Task?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
