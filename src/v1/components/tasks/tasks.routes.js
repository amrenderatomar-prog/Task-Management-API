import express from "express";
import { getTasks, createTask, getTaskById, updateTask, deleteTask, taskStats } from "./tasks.controller.js";
import { protect } from "../../../middleware/auth-handler.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks/stats:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get task statistics
 *   tags: [Tasks]
 *   description: Returns task statistics. Users see stats for their tasks, admins see all tasks.
 *   responses:
 *    200:
 *     description: Task statistics retrieved successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         stats:
 *          type: object
 *          properties:
 *           total:
 *            type: number
 *           byStatus:
 *            type: object
 *           byPriority:
 *            type: object
 *           userRole:
 *            type: string
 *    401:
 *     description: Not authorized
 */
router.get("/stats", protect, taskStats);

/**
 * @swagger
 * /api/v1/tasks:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   summary: Create a new task
 *   tags: [Tasks]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - title
 *       properties:
 *        title:
 *         type: string
 *         description: Task title (max 200 characters)
 *        description:
 *         type: string
 *         description: Task description
 *        status:
 *         type: string
 *         enum: [pending, in_progress, completed]
 *         default: pending
 *        priority:
 *         type: string
 *         enum: [low, medium, high]
 *         default: medium
 *        dueDate:
 *         type: string
 *         format: date
 *         description: Task due date
 *        assigned_to:
 *         type: string
 *         format: uuid
 *         description: User ID to assign task to
 *   responses:
 *    201:
 *     description: Task created successfully
 *    400:
 *     description: Validation error
 *    401:
 *     description: Not authorized
 */
router.post("/", protect, createTask);

/**
 * @swagger
 * /api/v1/tasks:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get all tasks
 *   tags: [Tasks]
 *   description: Returns all tasks. Users see their own tasks, admins see all tasks.
 *   parameters:
 *    - in: query
 *      name: status
 *      schema:
 *       type: string
 *       enum: [pending, in_progress, completed]
 *      description: Filter by status
 *    - in: query
 *      name: priority
 *      schema:
 *       type: string
 *       enum: [low, medium, high]
 *      description: Filter by priority
 *    - in: query
 *      name: search
 *      schema:
 *       type: string
 *      description: Search in task titles
 *   responses:
 *    200:
 *     description: Tasks retrieved successfully
 *    400:
 *     description: Invalid filter parameters
 *    401:
 *     description: Not authorized
 */
router.get("/", protect, getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get a single task by ID
 *   tags: [Tasks]
 *   description: Returns task details. Only accessible by creator, assignee, or admin.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       format: uuid
 *      description: Task ID
 *   responses:
 *    200:
 *     description: Task retrieved successfully
 *    403:
 *     description: Forbidden - insufficient permissions
 *    404:
 *     description: Task not found
 *    401:
 *     description: Not authorized
 */
router.get("/:id", protect, getTaskById);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *  put:
 *   security:
 *    - bearerAuth: []
 *   summary: Update a task
 *   tags: [Tasks]
 *   description: Update task. Creator/Admin can update all fields, assignee can only update status.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       format: uuid
 *      description: Task ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        status:
 *         type: string
 *         enum: [pending, in_progress, completed]
 *        priority:
 *         type: string
 *         enum: [low, medium, high]
 *        dueDate:
 *         type: string
 *         format: date
 *        assigned_to:
 *         type: string
 *         format: uuid
 *   responses:
 *    200:
 *     description: Task updated successfully
 *    400:
 *     description: Validation error
 *    403:
 *     description: Forbidden - insufficient permissions
 *    404:
 *     description: Task not found
 *    401:
 *     description: Not authorized
 */
router.put("/:id", protect, updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   summary: Delete a task
 *   tags: [Tasks]
 *   description: Delete task. Only accessible by creator or admin.
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       format: uuid
 *      description: Task ID
 *   responses:
 *    200:
 *     description: Task deleted successfully
 *    403:
 *     description: Forbidden - only creator or admin can delete
 *    404:
 *     description: Task not found
 *    401:
 *     description: Not authorized
 */
router.delete("/:id", protect, deleteTask);

export default router;
