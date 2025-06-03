const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// All task fields from the provided JSON
const taskFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'due_date', 'priority', 'completed', 'category', 'project_id'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'title', 'description', 'due_date', 'priority', 'completed', 'category', 'project_id'
];

export const fetchAllTasks = async (filters = {}) => {
  try {
    const params = {
      fields: taskFields,
      orderBy: [
        {
          fieldName: "due_date",
          SortType: "ASC"
        }
      ]
    };

    if (filters.where) {
      params.where = filters.where;
    }

    const response = await apperClient.fetchRecords('task', params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    // Transform data to match expected format
    return response.data.map(task => ({
      Id: task.Id,
      id: task.Id, // Keep both for compatibility
      title: task.title || task.Name || '',
      description: task.description || '',
      dueDate: task.due_date || null,
      due_date: task.due_date || null,
      priority: task.priority || 'medium',
      completed: task.completed || false,
      category: task.category || '',
      projectId: task.project_id || '',
      project_id: task.project_id || '',
      createdAt: task.CreatedOn || new Date().toISOString(),
      updatedAt: task.ModifiedOn || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const getTaskById = async (taskId) => {
  try {
    const params = {
      fields: taskFields
    };

    const response = await apperClient.getRecordById('task', taskId, params);
    
    if (!response || !response.data) {
      throw new Error("Task not found");
    }

    const task = response.data;
    return {
      Id: task.Id,
      id: task.Id,
      title: task.title || task.Name || '',
      description: task.description || '',
      dueDate: task.due_date || null,
      due_date: task.due_date || null,
      priority: task.priority || 'medium',
      completed: task.completed || false,
      category: task.category || '',
      projectId: task.project_id || '',
      project_id: task.project_id || '',
      createdAt: task.CreatedOn || new Date().toISOString(),
      updatedAt: task.ModifiedOn || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw new Error("Failed to fetch task");
  }
};

export const createTask = async (taskData) => {
  try {
    // Filter to only include updateable fields
    const filteredData = {};
    updateableFields.forEach(field => {
      if (taskData[field] !== undefined && taskData[field] !== null) {
        filteredData[field] = taskData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && filteredData.title) {
      filteredData.Name = filteredData.title;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord('task', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const createdTask = response.results[0].data;
      return {
        Id: createdTask.Id,
        id: createdTask.Id,
        title: createdTask.title || createdTask.Name || '',
        description: createdTask.description || '',
        dueDate: createdTask.due_date || null,
        due_date: createdTask.due_date || null,
        priority: createdTask.priority || 'medium',
        completed: createdTask.completed || false,
        category: createdTask.category || '',
        projectId: createdTask.project_id || '',
        project_id: createdTask.project_id || '',
        createdAt: createdTask.CreatedOn || new Date().toISOString(),
        updatedAt: createdTask.ModifiedOn || new Date().toISOString()
      };
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    // Filter to only include updateable fields plus Id
    const filteredData = { Id: taskId };
    updateableFields.forEach(field => {
      if (taskData[field] !== undefined && taskData[field] !== null) {
        filteredData[field] = taskData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && filteredData.title) {
      filteredData.Name = filteredData.title;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord('task', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const updatedTask = response.results[0].data;
      return {
        Id: updatedTask.Id,
        id: updatedTask.Id,
        title: updatedTask.title || updatedTask.Name || '',
        description: updatedTask.description || '',
        dueDate: updatedTask.due_date || null,
        due_date: updatedTask.due_date || null,
        priority: updatedTask.priority || 'medium',
        completed: updatedTask.completed || false,
        category: updatedTask.category || '',
        projectId: updatedTask.project_id || '',
        project_id: updatedTask.project_id || '',
        createdAt: updatedTask.CreatedOn || new Date().toISOString(),
        updatedAt: updatedTask.ModifiedOn || new Date().toISOString()
      };
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
};

export const deleteTask = async (taskId) => {
  try {
    const params = {
      RecordIds: [taskId]
    };

    const response = await apperClient.deleteRecord('task', params);
    
    if (response && response.success) {
      return true;
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};

// Legacy exports for compatibility
export const getAll = fetchAllTasks;
export const getById = getTaskById;
export const create = createTask;
export const update = updateTask;
export const delete_ = deleteTask;
export { delete_ as delete };