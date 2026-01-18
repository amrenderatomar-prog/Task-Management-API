import jwt from 'jsonwebtoken';
import { supabase } from '../db/config.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Not authorized, no token" });
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { data: user } = await supabase
            .from('users')
            .select('id,name,email,role')
            .eq('id', decoded.id)
            .single();

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};