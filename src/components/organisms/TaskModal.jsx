import { useState, useEffect } from 'react';
import { taskService } from '@/services/api/taskService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    Name: '',
    description_c: '',
    due_date_c: '',
    status_c: 'Not Started',
    priority_c: 'Medium',
    Tags: '',
    contact_id_c: '',
    deal_id_c: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        Name: task.Name || '',
        description_c: task.description_c || '',
        due_date_c: task.due_date_c ? task.due_date_c.split('T')[0] + 'T' + task.due_date_c.split('T')[1]?.substring(0, 5) : '',
        status_c: task.status_c || 'Not Started',
        priority_c: task.priority_c || 'Medium',
        Tags: task.Tags || '',
        contact_id_c: task.contact_id_c?.Id || '',
        deal_id_c: task.deal_id_c?.Id || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the datetime for submission
      const submitData = {
        ...formData,
        due_date_c: formData.due_date_c ? new Date(formData.due_date_c).toISOString() : ''
      };

      if (task) {
        await taskService.update(task.Id, submitData);
      } else {
        await taskService.create(submitData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField label="Task Name" required>
            <Input
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Enter task name"
              required
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description_c"
              value={formData.description_c}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Status" required>
              <select
                name="status_c"
                value={formData.status_c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deferred">Deferred</option>
              </select>
            </FormField>

            <FormField label="Priority" required>
              <select
                name="priority_c"
                value={formData.priority_c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </FormField>
          </div>

          <FormField label="Due Date">
            <Input
              type="datetime-local"
              name="due_date_c"
              value={formData.due_date_c}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Tags">
            <Input
              name="Tags"
              value={formData.Tags}
              onChange={handleChange}
              placeholder="Enter tags (comma-separated)"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Contact ID">
              <Input
                type="number"
                name="contact_id_c"
                value={formData.contact_id_c}
                onChange={handleChange}
                placeholder="Enter contact ID"
              />
            </FormField>

            <FormField label="Deal ID">
              <Input
                type="number"
                name="deal_id_c"
                value={formData.deal_id_c}
                onChange={handleChange}
                placeholder="Enter deal ID"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;