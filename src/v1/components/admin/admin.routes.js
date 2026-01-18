import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./admin.controller.js";

import { protect } from "../../../middleware/auth-handler.js";
import { authorize } from "../../../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all users
 *   tags: [Admin]
 *   description: Retrieve all users (admin only). Passwords are excluded from response.
 *   responses:
 *    200:
 *     description: Users retrieved successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         count:
 *          type: number
 *         users:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            id:
 *             type: string
 *             format: uuid
 *            name:
 *             type: string
 *            email:
 *             type: string
 *            role:
 *             type: string
 *             enum: [user, admin]
 *            created_at:
 *             type: string
 *             format: date-time
 *    401:
 *     description: Not authorized
 *    403:
 *     description: Forbidden - Admin access required
 */
router.get("/", protect, authorize("admin"), getAllUsers);

/**
 * @swagger
 * /api/v1/admin/{id}/role:
 *  put:
 *   security:
 *    - bearerAuth: []
 *   summary: Update user role
 *   tags: [Admin]
 *   description: Change user role between "user" and "admin" (admin only)
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       format: uuid
 *      description: User ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - role
 *       properties:
 *        role:
 *         type: string
 *         enum: [user, admin]
 *         description: New role for the user
 *   responses:
 *    200:
 *     description: User role updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *         user:
 *          type: object
 *    400:
 *     description: Invalid role or validation error
 *    401:
 *     description: Not authorized
 *    403:
 *     description: Forbidden - Admin access required
 *    404:
 *     description: User not found
 */
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

/**
 * @swagger
 * /api/v1/admin/{id}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   summary: Delete user
 *   tags: [Admin]
 *   description: Delete a user account (admin only). Cannot delete own account. All user's tasks will be cascaded.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       format: uuid
 *      description: User ID to delete
 *   responses:
 *    200:
 *     description: User deleted successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *    400:
 *     description: Cannot delete own account
 *    401:
 *     description: Not authorized
 *    403:
 *     description: Forbidden - Admin access required
 *    404:
 *     description: User not found
 */
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
