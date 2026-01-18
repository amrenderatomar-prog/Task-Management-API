import { supabase } from "../../../db/config.js";

// Get all users 
export const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Database error:', error);
            return res.status(400).json({ success: false, message: error.message });
        }
        
        res.json({ success: true, count: users.length, users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// update user role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validation
        if (!role) {
            return res.status(400).json({ success: false, message: 'Role is required' });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role. Must be "user" or "admin"' });
        }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', id)
            .single();

        if (fetchError || !existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update role
        const { data, error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', id)
            .select('id, name, email, role')
            .single();

        if (error) {
            console.error('Database error:', error);
            return res.status(400).json({ success: false, message: error.message });
        }
        
        res.json({ success: true, message: "User role updated successfully", user: data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};