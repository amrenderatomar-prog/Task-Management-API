import express from "express";
import authRoutes from "../../v1/components/authentication/auth.routes.js";
import taskRoutes from "../../v1/components/tasks/tasks.routes.js";
import adminRoutes from "../../v1/components/admin/admin.routes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use("/tasks", taskRoutes);
router.use("/admin", adminRoutes);

export default router;