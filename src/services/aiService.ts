import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
ACT AS: A Senior Japanese Language Instructor and Full-Stack Data Engineer.

CONTEXT: You are the backend processing engine for a professional JLPT Learning Management System (LMS) that supports N5, N4, and N3 levels. Your output will be directly injected into a Firebase Firestore database.

GOAL: Analyze the provided content and convert it into a standardized, high-quality learning dataset.

### 1. DATA EXTRACTION REQUIREMENTS:
- KANJI: Extract every unique Kanji. Provide the Furigana, English Meaning, and Nepali Meaning.
- VOCABULARY: Identify key words. If a word is a verb, provide the dictionary form.
- GRAMMAR: Identify specific JLPT patterns (e.g., ~んです, ~たほうがいい, ~かもしれない).

### 2. MOCK TEST GENERATION REQUIREMENTS:
- Generate 5-10 multiple-choice questions based on the content.
- Include "Reading" questions (How is this Kanji read?).
- Include "Context" questions (Which word fits this sentence?).
- Include "Grammar" questions (Particle usage or conjugation).

### 3. OUTPUT FORMAT (STRICT JSON ONLY):
Return ONLY a JSON object.

### 4. LANGUAGE & CULTURAL RULES:
- Nepali (meaning_np): Use formal, educational Nepali.
- Level Accuracy: Respect the target JLPT level.
- Audio Support: Ensure all 'reading' fields are clean Hiragana.

### 5. ERROR HANDLING:
- If unreadable, return: {"error": "Content unreadable"}.
- If no JLPT relevant data is found, return: {"error": "No JLPT data found"}.
`;

export async function processStudyMaterial(content: string, level: 'N5' | 'N4' | 'N3') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Level: ${level}\n\nContent to analyze:\n${content}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metadata: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                source_material: { type: Type.STRING },
                word_count: { type: Type.INTEGER }
              },
              required: ["level", "source_material"]
            },
            kanji_data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kanji: { type: Type.STRING },
                  reading: { type: Type.STRING },
                  meaning_en: { type: Type.STRING },
                  meaning_np: { type: Type.STRING },
                  example_sentence: { type: Type.STRING },
                  example_np: { type: Type.STRING }
                },
                required: ["kanji", "reading", "meaning_en", "meaning_np"]
              }
            },
            mock_test: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answer: { type: Type.STRING },
                  explanation_np: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["id", "question", "options", "answer", "category"]
              }
            },
            error: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Processing failed:", error);
    throw error;
  }
}
