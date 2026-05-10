import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "./models/Lesson.js";

dotenv.config();

const COURSE_ID = "69ff6fe524a52ed0517a987d";

const rawLessons = [
  ["1U3yr4u4b5aqtyvQ5eXwjBMiw2irvcokb", "1btGJBUMd6lrmp5A8adKhUtsRJWrpGNFp"],
  ["1UMqcwm_OoqdhmFps3SFVm9T2hpdv7y-v", "18Fpr7IuzXffPZpM3BgN78idZheClM_ub"],
  ["1BGFRj1Cqg1nMTSi3uuAzzeLLPEK__Cxc", "1jxA744ugkdFSh0qxo2SLB8vfOv_UxcH_"],
  ["12lDy8o5vEo1vC4lOrluvQvFLjjB9GRZ0", "1VDyQ9NstefEjiRpflINfSFn5ZnTFfH-y"],
  ["1PjMW_q4kCSi8VvX-ejDMHHASQ7WPJMrr", "1-6S6nb8x8uNl4uZ_EPLaAgTDcMwSad3t"],
  ["14T0HiPEZK-UiKUu1NTsDAySM7mAOjUg2", "1cEXyykph5LyqqnNUZXQVbfIeeWMI25BK"],
  ["1vBs3osJjkJDSl0Esq7rF2L_GrheJUXn_", "1o-q0kyiiW3CPVglXVQvCzue9io-KKmx2"],
  ["1H66VtAeBpWnolTJdi6Iphw91T9xReIQD", "1oQ9UE_ybtK-8CP_g3SxUnXZ2CzvP6Wu_"],
  ["1fjo8xdNrbHzOXUnyFf0U5N9POQ1kKTGv", "1yOL04yWao0ufQB-7G3LZBIsqqiiF-uW1"],
  ["1iQV8gBknLRGzGB1-3SLSzNs5vaYPBq4E", "1VLYsFjkzwhwKp17_fDhR0Y-0dW3G4dh0"],
  ["19jEYjXJzTmBv3cvG3ZmPdaSBl-Uuev8T", "1HWgpkLTfC_YX4orypZYnvhGzz2rfEMJM"],
  ["1duyTYq07cznVALFVrNeOqTNp6t07bDvM", "1g4KTtAsInsEVuwmAJ1erpBxFr0PVhP-U"],
  ["1Jx-TOCEVamh45FyswpALdi6LHF8alkpm", "1sCfv4SsSgYSGqLG_AOXHzJZj6NdKG9GV"],
  ["1o2o4Ci57m8uTo9c9n38xejqsAI1rDdwr", "1CLVbUpHPcfJ4rE_0JrKH3rkP3tYLX1Dr"],
  ["17HjLGgsnTUxMvQLUfA0quvmIYvAYS4Y6", "1-U0ulGLTKrGEahuLbin-pJl5OO7EFuau"],
  ["1Ld2G9zRI_sNMqXXzqX0og2HmWko3tzJ-", "1Z22SuBkJgxTcIVDADGl0tMzlftd6MI4h"],
  ["14EQcQZ2FTbz9uStVBAWWJvuAIBzImFLL", "1J7c9DgF-3SC9FZY3YMjFvvJd57ypHGL4"],
  ["1Qenn6i7hs2PZWCBuhNharCsjpuT5brsc", "1g3WyJI7xqE0d-aFuD9foDMEU5ohp71fk"],
  ["1w_I8D66o3S2YM6R0evWEivVeGTZ79pEB", "12zNjsJhQFzkAmw4OB37IGPQ1H-L44s9w"],
  ["1NwHMwqaYlThSXalH_HIEGxIa-O87uAh3", "1rbCIIWtalmLmj9AzTyT3iuNwodGfyqx0"],
  ["1qA0MYU5gNX-NbiKc1C4YBiuHMl4-OITp", "1in8eDdMblyYxtoyE2XwwZFn9TZzhpHgR"],
  ["13u3Lgn73g_ETz9qYhYPJn8Z5I3tlpyNg", "1wKCuHhDcDr6wjCdPe-damP_9dU3KE41I"],
  ["1QMW7jbHk9LdhtMMZpuFQ64aZAMHPFiD-", "1gZuX4sghNqkHq8-va1g_A9ULilwy3_Mq"],
  ["1Cd477yL_Z2LwWYWmwHlzm6f34YXp1iKb", "1_OmP-0ihgUIdkOufchBDKNN50bgRnPbH"],
  ["1OLWwo_GLHsMbCTl4tqF3-0vpuGgCbg50", "1xwi0ZB1EK083l5NvCmHBSvMQ7zcjGFp-"],
  ["1qIMEt6Wq69SOxT_LB_3TrRb27OOAzbAN", "1RaolxQ27JUFaklq1LB2FdZtsecxjrVBM"],
  ["18SrZwJTnKY8UxvA9LHSMuZkhV3EJxFq9", "13pwSg1aQ9MGqWzo56JHXmOYMUcXshhTU"],
  ["1VlXQ0EwVVSxqtB1GJPZo6YVZf_ScBTmz", "1z4MRcP5iBsSA_KjQ5lSh47dH8fijpffQ"],
  ["1FVai4GRStZZbLeVVIqzRjyJPeZDrArR7", "1AHuWsSToSs8ZXuKXaLANfkY5himwm6c0"],
  ["1ivJbqJxyYYcztKBA3KX6Mx9Has4--7YG", "1BPdNsVIKbHbl0gKw753FKQ_7fCg_tsfh"],
  ["1N8DC9UMwE4_RRytkhxMxDUgDJx9V3IrC", "19CzVcUau5HaFCd5R3UCnn6qhymBDfsqG"],
];

const lessons = rawLessons.map(([videoDriveId, audioDriveId], index) => ({
  sNo: index + 1,
  title: `Lesson ${index + 1}`,
  videoDriveId,
  audioDriveId,
  courseId: COURSE_ID,
}));

async function seedLessons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");

    await Lesson.deleteMany({
      courseId: COURSE_ID,
    });

    console.log("Old Lessons Deleted");

    await Lesson.insertMany(lessons);

    console.log("Lessons Seeded Successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedLessons();