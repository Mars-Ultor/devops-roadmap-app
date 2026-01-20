import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(__dirname, "../../../.env") });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import {
  curriculumData,
  cloudResumeChallenge,
} from "../data/curriculumData.js";

async function seedCurriculum() {
  console.log("🌱 Starting curriculum seed...");

  try {
    const batch = writeBatch(db);

    // Seed weeks
    for (const week of curriculumData) {
      const weekRef = doc(db, "curriculum", `week-${week.weekNumber}`);
      batch.set(weekRef, {
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        objectives: week.objectives,
        lessons: week.lessons,
        labs: week.labs,
        project: week.project || null,
        createdAt: new Date(),
      });

      console.log(`✅ Added Week ${week.weekNumber}: ${week.title}`);
    }

    // Seed Cloud Resume Challenge as a special project
    const projectRef = doc(db, "curriculum", "cloud-resume-challenge");
    batch.set(projectRef, {
      ...cloudResumeChallenge,
      type: "capstone-project",
      createdAt: new Date(),
    });

    console.log("✅ Added Cloud Resume Challenge");

    // Commit all writes
    await batch.commit();

    console.log("");
    console.log("🎉 Curriculum seeded successfully!");
    console.log(`📚 Total weeks: ${curriculumData.length}`);
    console.log(
      `🔬 Total labs: ${curriculumData.reduce((acc, w) => acc + w.labs.length, 0)}`,
    );
    console.log(
      `🎓 Total lessons: ${curriculumData.reduce((acc, w) => acc + w.lessons.length, 0)}`,
    );
    console.log("");
    console.log("Next steps:");
    console.log(
      "1. Check Firestore console: https://console.firebase.google.com/project/my-devops-journey-d3a08/firestore",
    );
    console.log("2. Navigate to /curriculum in your app to see the data");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding curriculum:", error);
    process.exit(1);
  }
}

seedCurriculum();
