import type { Task } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onCreateTask: () => void;
}

export function TaskList({ onEditTask, onCreateTask }: TaskListProps) {
  const { tasks, filteredTasks, filters } = useTasks();

  const hasFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  if (tasks.length === 0) {
    return <EmptyState hasFilters={false} onCreateTask={onCreateTask} />;
  }

  if (filteredTasks.length === 0) {
    return <EmptyState hasFilters={hasFilters} onCreateTask={onCreateTask} />;
  }

  return (
    <div className="space-y-3">
      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 px-1">
        <span>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {hasFilters && ` (filtered from ${tasks.length})`}
        </span>
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard task={task} onEdit={onEditTask} />
          </div>
        ))}
      </div>
    </div>
  );
}
