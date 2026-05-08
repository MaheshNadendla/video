// import { OAuth2Client } from 'google-auth-library';
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const allowedEmails = ["maheshnadendla147@gmail.com", "friend@gmail.com"];

// export const protect = async (req, res, next) => {
//     try {
//         // Frontend nunchi 'Authorization' header lo token vastadi
//         let token = req.headers.authorization || req.query.token;

       

//         if (!token) {
//              console.log("no y")
//             return res.status(401).json({ message: "No Token, Access Denied!" });
//         }

//         // Google deggara ee token valid aa kaada ani check chestunnam
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         const email = payload.email.toLowerCase();

//         // Check if email is allowed
//         if (allowedEmails.includes(email)) {
//             next(); // Anni ok ayithe next step (video streaming) ki vellu
//         } else {
//             res.status(403).json({ message: "contact admin!" });
//         }
//     } catch (error) {
//         res.status(401).json({ message: "Invalid Token!" });
//     }
// };

import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js'; // 👈 Kotha User model import cheyi

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.query.token;

        if (!token) {
            return res.status(401).json({ message: "No Token, Access Denied!" });
        }

        // 1. Google Token Verify cheyali
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email.toLowerCase();

        // 2. 🛡️ DATABASE CHECK (Replacing hardcoded array)
        const userExists = await User.findOne({ email: email });

        if (userExists) {
            req.user = payload; // User details ni request ki attach chestunnam
            next(); // Access Granted! ✅
        } else {
            console.log(`Unauthorized Access Attempt: ${email}`);
            res.status(403).json({ message: "Contact admin for access!" });
        }
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ message: "Invalid Token!" });
    }
};