import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

function TaskList({ searchQuery, onTaskSelect, onAddTask }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const success = await taskService.delete(taskId);
    if (success) {
      await loadTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.Name?.toLowerCase().includes(query) ||
      task.description_c?.toLowerCase().includes(query) ||
      task.status_c?.toLowerCase().includes(query) ||
      task.priority_c?.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Deferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loading message="Loading tasks..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  if (filteredTasks.length === 0) {
    return (
      <Empty
        icon="CheckSquare"
        title="No tasks found"
        description={searchQuery ? "Try adjusting your search" : "Get started by creating your first task"}
        action={!searchQuery ? { label: "Add Task", onClick: onAddTask } : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found</p>
        </div>
        <Button onClick={onAddTask}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.Id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {task.Name || 'Untitled Task'}
                  </h3>
                  {task.description_c && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description_c}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(task.status_c)}>
                    {task.status_c || 'Not Started'}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority_c)}>
                    {task.priority_c || 'Medium'}
                  </Badge>
                </div>

                {task.due_date_c && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                    <span>Due: {format(new Date(task.due_date_c), 'MMM dd, yyyy')}</span>
                  </div>
                )}

                {task.contact_id_c && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="User" className="w-4 h-4 mr-2" />
                    <span>{task.contact_id_c.Name || 'Contact'}</span>
                  </div>
                )}

                {task.deal_id_c && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Briefcase" className="w-4 h-4 mr-2" />
                    <span>{task.deal_id_c.Name || 'Deal'}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskSelect(task)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.Id)}
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TaskList;