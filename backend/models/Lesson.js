// models/Lesson.js
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    sNo: { type: Number, required: true }, // Class 1, Class 2 order kosam
    title: { type: String, required: true },
    videoDriveId: { type: String, required: true },
    audioDriveId: { type: String, required: true },
    thumbnailUrl: { type: String },
    notesLink: { type: String },
    assignmentLink: { type: String },
    
    // Ee video ye course dhi? 
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;