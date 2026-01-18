import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../../../db/config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt-token.js";
import { registerValidation } from "./auth.validation.js";

export const register = async (req, res) => {
  try {
    const error = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { name, email, password } = req.body;

    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error: dbError } = await supabase
      .from("users")
      .insert([{ name, email, password: hash, role: "user" }])
      .select()
      .single();

    if (dbError) throw dbError;

    res.status(201).json({ message: "user registered", user: data });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await supabase.from("refresh_tokens").insert([
        { user_id: user.id, token: refreshToken }  
    ]);

    res.json({
      message: "Login success",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// profile
export const profile = async (req, res) => {
  res.json(req.user);
};

// refresh token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const { data: tokenData } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token", refreshToken)
      .single();
      
    if (!tokenData) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

    res.json({ message: "Access token refreshed", accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token or expired" });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await supabase
      .from("refresh_tokens")
      .delete()
      .eq("user_id", userId);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }

};
