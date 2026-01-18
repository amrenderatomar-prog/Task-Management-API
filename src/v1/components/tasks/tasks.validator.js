// Task validation functions

export const validateCreateTask = (data) => {
  const { title, status, priority, dueDate } = data;

  // Title validation
  if (!title || title.trim() === '') {
    return "Title is required";
  }
  if (title.length > 200) {
    return "Title must not exceed 200 characters";
  }

  // Status validation
  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return `Priority must be one of: ${validPriorities.join(', ')}`;
  }

  // Due date validation
  if (dueDate && isNaN(Date.parse(dueDate))) {
    return "Invalid due date format";
  }

  return null;
};

export const validateUpdateTask = (data) => {
  const { title, status, priority, dueDate } = data;

  // Title validation (only if provided)
  if (title !== undefined) {
    if (title.trim() === '') {
      return "Title cannot be empty";
    }
    if (title.length > 200) {
      return "Title must not exceed 200 characters";
    }
  }

  // Status validation
  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return `Priority must be one of: ${validPriorities.join(', ')}`;
  }

  // Due date validation
  if (dueDate && isNaN(Date.parse(dueDate))) {
    return "Invalid due date format";
  }

  return null;
};

export const validateQueryFilters = (query) => {
  const { status, priority } = query;

  // Status filter validation
  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`;
  }

  // Priority filter validation
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return `Invalid priority filter. Must be one of: ${validPriorities.join(', ')}`;
  }

  return null;
};
