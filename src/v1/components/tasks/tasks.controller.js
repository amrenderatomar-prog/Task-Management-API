import { supabase } from "../../../db/config.js";
import { validateCreateTask, validateUpdateTask, validateQueryFilters } from "./tasks.validator.js";

// create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assigned_to } = req.body;

        // Validation using validator
        const validationError = validateCreateTask(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const { data, error } = await supabase.from('tasks').insert([{
            title: title.trim(),
            description: description?.trim(),
            status: status || 'pending',
            priority: priority || 'medium',
            due_date: dueDate,
            created_by: req.user.id,
            assigned_to
        }]).select().single();
        
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(201).json({ success: true, message: 'Task created successfully', task: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// get all tasks
export const getTasks = async (req, res) => {
    try {
        const validationError = validateQueryFilters(req.query);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        let query = supabase.from("tasks").select("*");

        if (req.user.role !== "admin") {
            query = query.or(`created_by.eq.${req.user.id},assigned_to.eq.${req.user.id}`);
        }

        
        const { status, priority, search } = req.query;
        if (status) query = query.eq("status", status);
        if (priority) query = query.eq("priority", priority);
        if (search) query = query.ilike("title", `%${search}%`);

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.json({ success: true, count: data.length, tasks: data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// get a single task by id
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
       
        const { data: task, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role !== 'admin' && task.created_by !== req.user.id && task.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this task' });
        }

        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// update a task by id
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate update data
        const validationError = validateUpdateTask(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const { data: task, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        let updateData = {};

        // Authorization: Creator/Admin can update all fields, Assignee can only update status
        if (req.user.role === "admin" || task.created_by === req.user.id) {
            const { title, description, status, priority, dueDate, assigned_to } = req.body;
            if (title !== undefined) updateData.title = title.trim();
            if (description !== undefined) updateData.description = description?.trim();
            if (status !== undefined) updateData.status = status;
            if (priority !== undefined) updateData.priority = priority;
            if (dueDate !== undefined) updateData.due_date = dueDate;
            if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
        } else if (task.assigned_to === req.user.id) {
            if (req.body.status !== undefined) {
                updateData.status = req.body.status;
            } else {
                return res.status(400).json({ success: false, message: 'Assignees can only update task status' });
            }
        } else {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to update this task' });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.json({ success: true, message: 'Task updated successfully', task: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// delete a task by id
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: task, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Authorization: Creator or admin only
        if (req.user.role !== "admin" && task.created_by !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: Only the creator or admin can delete this task' });
        }

        const { error } = await supabase.from("tasks").delete().eq("id", id);
        
        if (error) {
            console.error('Database error:', error);
            return res.status(400).json({ message: error.message });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// task statistics
export const taskStats = async (req, res) => {
    try {
        let query = supabase.from("tasks").select("*");
        
        
        if (req.user.role !== "admin") {
            query = query.or(`created_by.eq.${req.user.id},assigned_to.eq.${req.user.id}`);
        }

        const { data, error } = await query;
        
        if (error) {
            console.error('Database error:', error);
            return res.status(400).json({ message: error.message });
        }

        const stats = {
            total: data.length,
            byStatus: {
                completed: data.filter((t) => t.status === "completed").length,
                pending: data.filter((t) => t.status === "pending").length,
                inProgress: data.filter((t) => t.status === "in_progress").length,
            },
            byPriority: {
                high: data.filter((t) => t.priority === "high").length,
                medium: data.filter((t) => t.priority === "medium").length,
                low: data.filter((t) => t.priority === "low").length,
            },
            userRole: req.user.role
        };
        
        res.json({ success: true, stats });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};