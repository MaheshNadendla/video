import express from 'express';
import { getAllCourses, getLessonsByCourseId } from '../controllers/courseController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. All Courses API -> Ikkada 'protect' add chesam
// Request vachinappudu mundu protect() run ayyi check chestundi, antha ok ayitheనే getAllCourses ki velthundi.
router.route('/').get(protect, getAllCourses);



// 2. Specific Course Lessons API -> Deeniki kuda 'protect' apply chesam
router.route('/:courseId/lessons').get(protect, getLessonsByCourseId);

export default router;