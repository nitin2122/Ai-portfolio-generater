import { GoogleGenerativeAI } from "@google/generative-ai";

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Clean the API key in case whitespace or quotes are present
const API_KEY = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

const genAI = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') ? new GoogleGenerativeAI(API_KEY) : null;

export const generatePortfolioData = async (userData) => {
  if (!genAI) {
    console.error("Gemini API Key missing or invalid in environment.");
    throw new Error("API Key Error: VITE_GEMINI_API_KEY is not defined in your .env file or is invalid.");
  }

  // Current stable Gemini models (verified 2025)
  const modelNames = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      const isTemplate1 = userData.prompt?.includes('TEMPLATE_1');
      const isTemplate2 = userData.prompt?.includes('TEMPLATE_2');

      const templateRules = isTemplate2 ? `
        STRICT DESIGN SYSTEM RULES (TEMPLATE 2 - ARCHITECTURAL STUDIO):
        1. AESTHETICS: Clean, off-white editorial minimalism (#F2F2F2).
        2. ACCENT: Absolute Black (#000000) for sharp, high-contrast elements.
        3. TYPOGRAPHY: 
           - Headlines: 'Cormorant Garamond' or 'Playfair Display' (sophisticated serif).
           - Body/Labels: 'Inter' (clean geometric sans).
        4. LAYOUT: Staggered grid system, generous whitespace, all-caps navigation.
        5. VIBE: Premium studio monograph, intellectual, airy.
      ` : `
        STRICT DESIGN SYSTEM RULES (TEMPLATE 1 - KINETIC NOIR):
        1. AESTHETICS: High-end architectural dark mode (#0a0a0b).
        2. ACCENT: Neon Lime (#ccff00) for high-impact technical highlights.
        3. TYPOGRAPHY: 
           - Headlines: 'Playfair Display' (authoritative serif).
           - Body/Labels: 'Manrope' (modern geometric sans).
        4. LAYOUT: Aggressive whitespace, 12-column fixed grid, kinetic Z-axis depth.
        5. VIBE: Technical precision, futuristic noir, high-performance.
      `;

      console.log(`[Neural Engine] Attempting synthesis with: ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });
      
      const prompt = `
        ACT AS A 2026 GOD-TIER 3D CREATIVE DEVELOPER AND ARCHITECTURAL DESIGNER.
        
        TASK: Generate a cinematic, high-fidelity portfolio design system.
        USER: ${userData.name}
        ROLE: ${userData.role}
        USER_PROMPT: ${userData.prompt || 'Minimalist Editorial'}

        ${templateRules}
        
        Return ONLY a JSON object with this exact structure:
        {
          "bg": "${isTemplate2 ? '#F2F2F2' : '#0a0a0b'}",
          "text": "${isTemplate2 ? '#1a1a1a' : '#f5f5f5'}",
          "accent": "${isTemplate2 ? '#000000' : '#ccff00'}",
          "fontDisplay": "${isTemplate2 ? 'Cormorant Garamond' : 'Playfair Display'}",
          "fontBody": "${isTemplate2 ? 'Inter' : 'Manrope'}",
          "vibe": "Detailed description of the design aesthetic and movement",
          "bio": "A sophisticated, narrative-driven bio for the user",
          "aboutText": "A narrative about intellectual rigor and design precision",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
          "experience": [
            { "role": "Role", "company": "Company", "duration": "Year-Year", "description": "High-impact description" }
          ],
          "imagePrompts": [
            "Specific 3D abstract render prompt matching the theme",
            "Minimalist editorial photography prompt matching the theme",
            "Technical detail prompt matching the theme"
          ]
        }
        
        Do not include any markdown formatting, just the raw JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Robust JSON extraction
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("Invalid AI response format");
      
      const jsonStr = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error(`Neural Link ${modelName} failed:`, error);
      lastError = error;
      continue;
    }
  }

  if (lastError?.message?.includes('API_KEY_INVALID') || lastError?.message?.includes('403')) {
    throw new Error("API Key Error: The provided Gemini API key is invalid or lacks permissions. Please check your Google AI Studio console.");
  }

  throw lastError || new Error("Synthesis failed. Check network or API key permissions.");
};
