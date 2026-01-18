import express from 'express';
import { register, login, profile, refresh , logout} from './auth.controller.js';
import { protect } from '../../../middleware/auth-handler.js';
import { limiter } from '../../../middleware/rate-limiter.js';

const router = express.Router();


/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *   summary: Register new user
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - name
 *        - email
 *        - password
 *       properties:
 *        name:
 *         type: string
 *        email:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    201:
 *     description: User registered
 */
router.post("/register", limiter, register);


/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *   summary: Login user
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - email
 *        - password
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    200:
 *     description: Login success
 */
router.post("/login", limiter, login);


/**
 * @swagger
 * /api/v1/auth/profile:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Get user profile
 *   tags: [Auth]
 *   responses:
 *    200:
 *     description: User profile
 */
router.get("/profile", protect, limiter, profile);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *  post:
 *   summary: Refresh access token
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - refreshToken
 *       properties:
 *        refreshToken:
 *         type: string
 *   responses:
 *    200:
 *     description: Access token refreshed
 */
router.post("/refresh", limiter, refresh);

/**
 * @swagger
 * /api/v1/auth/logout:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   summary: Logout user
 *   tags: [Auth]
 *   responses:
 *    200:
 *     description: Logged out successfully
 */
router.post("/logout", protect, logout);


export default router;