import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, // Okka email okasari matrame undali
        lowercase: true 
    },
    name: { type: String }, // Optional: User name store cheskovachu
    role: { type: String, default: 'student' } // Optional: Admin or Student
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;