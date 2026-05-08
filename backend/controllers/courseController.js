import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// ==========================================
// 1. GET ALL COURSES (IDs and Basic Info)
// ==========================================
export const getAllCourses = async (req, res) => {
    try {
        // .select() vaadi manaki kavalsina IDs, title matrame theskuntunnam
        const courses = await Course.find({}).select('_id courseTitle thumbnailUrl');
        
        res.status(200).json(courses);
    } catch (error) {
        console.error("Courses thevadam lo error:", error);
        res.status(500).json({ message: "Courses fetch avvaledu bro" });
    }
};

// ==========================================
// 2. GET LESSONS BY COURSE ID (Only Video & Audio IDs)
// ==========================================
export const getLessonsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. courseId tho vethiki
        // 2. sNo prakaram order petti
        // 3. Only Video ID, Audio ID, Title matrame select chestunnam
        const lessons = await Lesson.find({ courseId: courseId })
                                    .sort({ sNo: 1 })
                                    .select('_id sNo title videoDriveId audioDriveId');

        if (!lessons || lessons.length === 0) {
            return res.status(404).json({ message: "Ee course lo lessons em levu" });
        }

        res.status(200).json(lessons);
    } catch (error) {
        console.error("Lessons thevadam lo error:", error);
        res.status(500).json({ message: "Lessons fetch avvaledu" });
    }
};


