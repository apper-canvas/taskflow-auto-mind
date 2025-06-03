const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// All category fields from the provided JSON
const categoryFields = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color'
];

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'color'
];

export const fetchAllCategories = async (filters = {}) => {
  try {
    const params = {
      fields: categoryFields,
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

    const response = await apperClient.fetchRecords('category', params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(category => ({
      Id: category.Id,
      id: category.Id, // Keep both for compatibility
      name: category.Name || '',
      color: category.color || '#6366f1'
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const params = {
      fields: categoryFields
    };

    const response = await apperClient.getRecordById('category', categoryId, params);
    
    if (!response || !response.data) {
      throw new Error("Category not found");
    }

    const category = response.data;
    return {
      Id: category.Id,
      id: category.Id,
      name: category.Name || '',
      color: category.color || '#6366f1'
    };
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryId}:`, error);
    throw new Error("Failed to fetch category");
  }
};

export const createCategory = async (categoryData) => {
  try {
    const filteredData = {};
    updateableFields.forEach(field => {
      if (categoryData[field] !== undefined && categoryData[field] !== null) {
        filteredData[field] = categoryData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && categoryData.name) {
      filteredData.Name = categoryData.name;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord('category', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const createdCategory = response.results[0].data;
      return {
        Id: createdCategory.Id,
        id: createdCategory.Id,
        name: createdCategory.Name || '',
        color: createdCategory.color || '#6366f1'
      };
    } else {
      throw new Error("Failed to create category");
    }
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const filteredData = { Id: categoryId };
    updateableFields.forEach(field => {
      if (categoryData[field] !== undefined && categoryData[field] !== null) {
        filteredData[field] = categoryData[field];
      }
    });

    // Set default Name field if not provided
    if (!filteredData.Name && categoryData.name) {
      filteredData.Name = categoryData.name;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord('category', params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      const updatedCategory = response.results[0].data;
      return {
        Id: updatedCategory.Id,
        id: updatedCategory.Id,
        name: updatedCategory.Name || '',
        color: updatedCategory.color || '#6366f1'
      };
    } else {
      throw new Error("Failed to update category");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const params = {
      RecordIds: [categoryId]
    };

    const response = await apperClient.deleteRecord('category', params);
    
    if (response && response.success) {
      return true;
    } else {
      throw new Error("Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

// Legacy exports for compatibility
export const getAll = fetchAllCategories;
export const getById = getCategoryById;
export const create = createCategory;
export const update = updateCategory;
export const delete_ = deleteCategory;
export { delete_ as delete };