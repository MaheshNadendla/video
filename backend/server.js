// import express from 'express';
// import cors from 'cors';
// import { google } from 'googleapis';
// import dotenv from 'dotenv';

// // .env file ni load chestundi
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json()); // JSON data accept cheyadaniki

// // Google Drive API setup (Service Account credentials)
// const auth = new google.auth.GoogleAuth({
//     keyFile: './google-credentials.json', // Mana API key file ikkade undali
//     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
// });
// const drive = google.drive({ version: 'v3', auth });



// // Smart Streaming API route (Supports Seek/Forward/Backward)
// app.get('/api/stream/:fileId', async (req, res) => {
//     try {
//         const fileId = req.params.fileId;
//         const range = req.headers.range;

//         // 1. First, Google Drive nunchi video total size entho kanukkuntundi
//         const fileMeta = await drive.files.get({ fileId: fileId, fields: 'size' });
//         const fileSize = parseInt(fileMeta.data.size, 10);

//         if (range) {
//             // 2. User seek chesinappudu (Browser asking for specific parts)
//             const parts = range.replace(/bytes=/, "").split("-");
//             const start = parseInt(parts[0], 10);
//             const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//             const chunksize = (end - start) + 1;

//             // Browser ki idhi sagam video ae ani cheppadaniki (Status 206)
//             res.writeHead(206, {
//                 'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//                 'Accept-Ranges': 'bytes',
//                 'Content-Length': chunksize,
//                 'Content-Type': 'video/mp4',
//             });

//             // Drive nunchi aa specific part matrame thecchi isthundi
//             const response = await drive.files.get(
//                 { fileId: fileId, alt: 'media' },
//                 { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } }
//             );

//             response.data.pipe(res);
//         } else {
//             // 3. Normal ga first nunchi play ayyeti tappudu (Status 200)
//             res.writeHead(200, {
//                 'Content-Length': fileSize,
//                 'Content-Type': 'video/mp4',
//             });

//             const response = await drive.files.get(
//                 { fileId: fileId, alt: 'media' },
//                 { responseType: 'stream' }
//             );

//             response.data.pipe(res);
//         }

//     } catch (error) {
//         console.error('Error fetching file:', error.message);
//         res.status(500).send('Error streaming video/audio');
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT} 🔥`);
// });



import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// 🛑 1. Kotha Imports (DB mariyu Routes)
import connectDB from './config/db.js';
import courseRoutes from './routes/courseRoutes.js';
import { protect } from './middleware/authMiddleware.js';

// .env file ni load chestundi
dotenv.config();

// 🛑 2. Database ki connect chestunnam
connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_GDOMAIN,
  process.env.FRONTEND_GLOBE_DOMAIN,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // JSON data accept cheyadaniki

// 🛑 3. Kotha API Routes ni Express ki isthunnam
app.use('/api/courses', courseRoutes);


// ==========================================
// GOOGLE DRIVE STREAMING SETUP
// ==========================================

// Google Drive API setup (Service Account credentials)
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_JSON),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: 'v3', auth });

// Smart Streaming API route (Supports Seek/Forward/Backward)
app.get('/api/stream/:fileId',protect, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const range = req.headers.range;

        // 1. First, Google Drive nunchi video total size mariyu mimeType kanukkuntundi
        const fileMeta = await drive.files.get({ fileId: fileId, fields: 'size, mimeType' });
        const fileSize = parseInt(fileMeta.data.size, 10);
        const mimeType = fileMeta.data.mimeType || 'video/mp4';

        if (range) {
            // 2. User seek chesinappudu (Browser asking for specific parts)
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            // Browser ki idhi sagam video ae ani cheppadaniki (Status 206)
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': mimeType,
            });

            // Drive nunchi aa specific part matrame thecchi isthundi
            const response = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } }
            );

            response.data.pipe(res);
        } else {
            // 3. Normal ga first nunchi play ayyeti tappudu (Status 200)
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': mimeType,
            });

            const response = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { responseType: 'stream' }
            );

            response.data.pipe(res);
        }

    } catch (error) {
        console.error('Error fetching file:', error.message);
        res.status(500).send('Error streaming video/audio');
    }
});

// ==========================================
// SERVER STARTUP
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🔥`);
});
