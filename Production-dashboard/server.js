// server.js
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: We will load dotenv using a command-line flag instead of an import.

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Check if the API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("\nError: GEMINI_API_KEY not found.");
  console.error("Please ensure you have a .env file in the project root with your key,");
  console.error("and that you are running the server with: node -r dotenv/config server.js\n");
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// API endpoint to generate the schedule
app.post('/api/generate-schedule', async (req, res) => {
  // ... (the rest of the code is the same)
  const { scriptText } = req.body;

  if (!scriptText) {
    return res.status(400).json({ error: 'Script text is required.' });
  }

  const prompt = `
          Act as an expert film director and seasoned production manager. Your task is to analyze the provided film script and create a highly realistic, efficient, and optimized shooting schedule. Your judgment is crucial.

    **Primary Goal:** Create a logistically sound schedule that minimizes company moves by grouping scenes based on location.

    **Prediction Task:** For each scene, you must PREDICT the required shooting time. To do this, analyze the scene's complexity based on:
    1.  **Location & Time:** INT vs. EXT, DAY vs. NIGHT. (Exterior and night shoots take longer).
    2.  **Content:** The amount of dialogue, the number of actors involved, and the presence of any action, stunts, or special effects (VFX).
    3.  **Risk Management:** Add buffer time for complex scenes. A simple dialogue scene might take 2 hours, but a stunt sequence could take 6-8 hours. Be realistic.

    **Output Requirement:** Your entire response must be ONLY a raw JSON array, starting with '[' and ending with ']'. Do not include any other text or markdown formatting.

    **JSON Structure:** The JSON must be an array of day objects, adhering strictly to this structure:
      - id: integer
      - day: integer
      - date: string in 'YYYY-MM-DD' format (start from today's date)
      - location: string
      - generalCall: string in 'HH:MM' format
      - firstShot: string in 'HH:MM' format
      - estWrap: string in 'HH:MM' format (plan for a 10-12 hour shooting day)
      - weather: string (predict a likely weather condition)
      - sunrise/sunset: string in 'HH:MM' format
      - notes: string
      - scenes: array of scene objects { sceneNumber, description, cast, startTime, endTime }
      - castCalls: array of cast call objects { character, actor: 'TBD', status, hmw, onSet }

    **Special Instruction:** In the 'notes' field of the VERY FIRST day object, you must provide a project summary. This summary should include your expert prediction for the **total number of shooting days** required for the entire script and a brief mention of the biggest production risks (e.g., "Heavy stunt work on Day 18," "Dependent on weather for all exterior farm scenes").

    Now, analyze the script and give me your best shot.`;
    
  try {
    const result = await model.generateContent([prompt, scriptText]);
    const response = await result.response;
    const text = response.text();

    const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    res.json(jsonResponse);
  } catch (error) {
    console.error("Error generating schedule with Gemini:", error);
    res.status(500).json({ error: 'Failed to generate schedule.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});