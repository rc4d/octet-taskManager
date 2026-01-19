import { ClipboardList, Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateTask: () => void;
}

export function EmptyState({ hasFilters, onCreateTask }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No matching tasks
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-5">
        <ClipboardList className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        No tasks yet
      </h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
        Get started by creating your first task. Stay organized and track your progress!
      </p>
      <button
        onClick={onCreateTask}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
      >
        <Plus size={18} />
        Create your first task
      </button>
    </div>
  );
}
