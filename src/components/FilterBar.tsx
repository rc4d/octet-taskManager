import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import type { TaskStatus, TaskPriority, SortField } from '../types/task';

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export function FilterBar() {
  const { filters, setFilters } = useTasks();

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
    });
  };

  const toggleSortOrder = () => {
    setFilters({
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
        />
        {filters.search && (
          <button
            onClick={() => setFilters({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter Icon */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Filter size={16} />
          <span className="text-sm font-medium hidden sm:inline">Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ status: e.target.value as TaskStatus | 'all' })
          }
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            filters.status !== 'all'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-500'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors`}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters({ priority: e.target.value as TaskPriority | 'all' })
          }
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            filters.priority !== 'all'
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-500'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors`}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Clear filters
          </button>
        )}

        {/* Sort Controls - Push to right */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <ArrowUpDown size={16} />
            <span className="text-sm font-medium hidden sm:inline">Sort:</span>
          </div>

          <select
            value={filters.sortField}
            onChange={(e) => setFilters({ sortField: e.target.value as SortField })}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={toggleSortOrder}
            className={`p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
            title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown
              size={16}
              className={`transform transition-transform ${
                filters.sortOrder === 'asc' ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
