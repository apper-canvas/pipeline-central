import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'tasks_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'contact_id_c' } },
          { field: { Name: 'deal_id_c' } }
        ],
        orderBy: [{ fieldName: 'due_date_c', sorttype: 'ASC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error?.message || error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'due_date_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'contact_id_c' } },
          { field: { Name: 'deal_id_c' } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error('Failed to fetch task:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error?.message || error);
      toast.error('Failed to load task');
      return null;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [
          {
            Name: taskData.Name || '',
            description_c: taskData.description_c || '',
            due_date_c: taskData.due_date_c || '',
            status_c: taskData.status_c || 'Not Started',
            priority_c: taskData.priority_c || 'Medium',
            Tags: taskData.Tags || '',
            ...(taskData.contact_id_c && { contact_id_c: parseInt(taskData.contact_id_c) }),
            ...(taskData.deal_id_c && { deal_id_c: parseInt(taskData.deal_id_c) })
          }
        ]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error('Failed to create task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} task(s):`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating task:', error?.message || error);
      toast.error('Failed to create task');
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(taskData.Name !== undefined && { Name: taskData.Name }),
            ...(taskData.description_c !== undefined && { description_c: taskData.description_c }),
            ...(taskData.due_date_c !== undefined && { due_date_c: taskData.due_date_c }),
            ...(taskData.status_c !== undefined && { status_c: taskData.status_c }),
            ...(taskData.priority_c !== undefined && { priority_c: taskData.priority_c }),
            ...(taskData.Tags !== undefined && { Tags: taskData.Tags }),
            ...(taskData.contact_id_c !== undefined && { contact_id_c: taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null }),
            ...(taskData.deal_id_c !== undefined && { deal_id_c: taskData.deal_id_c ? parseInt(taskData.deal_id_c) : null })
          }
        ]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error('Failed to update task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} task(s):`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating task:', error?.message || error);
      toast.error('Failed to update task');
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} task(s):`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Task deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting task:', error?.message || error);
      toast.error('Failed to delete task');
      return false;
    }
  }
}

export const taskService = new TaskService();