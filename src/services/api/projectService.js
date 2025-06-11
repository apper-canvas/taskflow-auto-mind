const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// All project fields from the provided JSON
const projectFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'description', 'color', 'created_at'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'description', 'color', 'created_at'
];

export const fetchAllProjects = async (filters = {}) => {
  try {
    const params = {
      fields: projectFields,
      orderBy: [
        {
          fieldName: "Name",
          SortType: "ASC"
        }
      ]
    };

    if (filters.where) {
      params.where = filters.where;
    }

    const response = await apperClient.fetchRecords('project', params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(project => ({
      Id: project.Id,
      id: project.Id, // Keep both for compatibility
      name: project.Name || '',
      description: project.description || '',
      color: project.color || '#6366f1',
      createdAt: project.CreatedOn || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

export const getProjectById = async (projectId) => {
  try {
    const params = {
      fields: projectFields
    };

    const response = await apperClient.getRecordById('project', projectId, params);
    
    if (!response || !response.data) {
      throw new Error("Project not found");
    }

    const project = response.data;
    return {
      Id: project.Id,
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      color: project.color || '#6366f1',
      createdAt: project.CreatedOn || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw new Error("Failed to fetch project");
  }
};

export const createProject = async (projectData) => {
  try {
    const filteredData = {};
    updateableFields.forEach(field => {
      if (projectData[field] !== undefined && projectData[field] !== null) {
        filteredData[field] = projectData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && projectData.name) {
      filteredData.Name = projectData.name;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord('project', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const createdProject = response.results[0].data;
      return {
        Id: createdProject.Id,
        id: createdProject.Id,
        name: createdProject.Name || '',
        description: createdProject.description || '',
        color: createdProject.color || '#6366f1',
        createdAt: createdProject.CreatedOn || new Date().toISOString()
      };
    } else {
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const filteredData = { Id: projectId };
    updateableFields.forEach(field => {
      if (projectData[field] !== undefined && projectData[field] !== null) {
        filteredData[field] = projectData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && projectData.name) {
      filteredData.Name = projectData.name;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord('project', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const updatedProject = response.results[0].data;
      return {
        Id: updatedProject.Id,
        id: updatedProject.Id,
        name: updatedProject.Name || '',
        description: updatedProject.description || '',
        color: updatedProject.color || '#6366f1',
        createdAt: updatedProject.CreatedOn || new Date().toISOString()
      };
    } else {
      throw new Error("Failed to update project");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

export const deleteProject = async (projectId) => {
  try {
    const params = {
      RecordIds: [projectId]
    };

    const response = await apperClient.deleteRecord('project', params);
    
    if (response && response.success) {
      return true;
    } else {
      throw new Error("Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
};

// Legacy exports for compatibility
export const getAll = fetchAllProjects;
export const getById = getProjectById;
export const create = createProject;
export const update = updateProject;
export const delete_ = deleteProject;
export { delete_ as delete };