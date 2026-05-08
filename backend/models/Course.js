// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    instructor: { type: String, default: "Mahesh" }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;