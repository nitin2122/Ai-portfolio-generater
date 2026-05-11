import { GoogleGenerativeAI } from "@google/generative-ai";

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Clean the API key in case whitespace or quotes are present
const API_KEY = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

const genAI = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') ? new GoogleGenerativeAI(API_KEY) : null;

// ─── Fallback demo data (used when ALL API models fail / quota exceeded) ──────
const buildFallback = (userData, isTemplate2) => ({
  bg: isTemplate2 ? '#F2F2F2' : '#0a0a0b',
  text: isTemplate2 ? '#1a1a1a' : '#f5f5f5',
  accent: isTemplate2 ? '#000000' : '#ccff00',
  fontDisplay: isTemplate2 ? 'Cormorant Garamond' : 'Playfair Display',
  fontBody: isTemplate2 ? 'Inter' : 'Manrope',
  vibe: 'Cinematic precision — the portfolio speaks before you do.',
  bio: `${userData.name} is a visionary ${userData.role} who transforms complex ideas into elegant, high-impact solutions. With a relentless focus on craft and an instinct for the future, every project is a statement.`,
  aboutText: `Driven by curiosity and precision, ${userData.name} operates at the intersection of art and technology.`,
  skills: ['Design Systems', 'Creative Direction', 'Product Strategy', 'UI Engineering', 'Brand Identity', 'Motion Design'],
  experience: [
    { role: userData.role, company: 'Freelance Studio', duration: '2022–Present', description: 'Leading end-to-end creative strategy and execution for global clients.' },
    { role: 'Senior Designer', company: 'Innovation Lab', duration: '2019–2022', description: 'Shaped the visual identity and product experience for a rapidly growing platform.' },
    { role: 'Design Lead', company: 'Creative Agency', duration: '2017–2019', description: 'Delivered award-winning campaigns across digital and physical touchpoints.' },
  ],
  imagePrompts: [
    'Abstract 3D architectural render in dark noir aesthetic',
    'Minimalist editorial studio photography',
    'Technical geometric detail shot',
  ],
  _isFallback: true,
});

export const generatePortfolioData = async (userData) => {
  if (!genAI) {
    console.warn("[Neural Engine] No API key — using demo portfolio data.");
    const isTemplate2 = userData.prompt?.includes('TEMPLATE_2');
    return buildFallback(userData, isTemplate2);
  }

  // Priority order: 2.5-flash (best free quota) → 1.5-flash → 2.0-flash → 1.5-pro
  // gemini-2.5-flash-preview-04-17 is the latest high-quota free model
  const modelNames = [
    "gemini-2.5-flash-preview-04-17",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro",
  ];

  let lastError = null;

  for (const modelName of modelNames) {
    try {
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
        
        Return ONLY a JSON object with this exact structure, no markdown:
        {
          "bg": "${isTemplate2 ? '#F2F2F2' : '#0a0a0b'}",
          "text": "${isTemplate2 ? '#1a1a1a' : '#f5f5f5'}",
          "accent": "${isTemplate2 ? '#000000' : '#ccff00'}",
          "fontDisplay": "${isTemplate2 ? 'Cormorant Garamond' : 'Playfair Display'}",
          "fontBody": "${isTemplate2 ? 'Inter' : 'Manrope'}",
          "vibe": "Detailed description of the design aesthetic",
          "bio": "A sophisticated, narrative-driven bio for the user (2-3 sentences)",
          "aboutText": "A narrative about design philosophy (1-2 sentences)",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
          "experience": [
            { "role": "Role Title", "company": "Company Name", "duration": "Year-Year", "description": "High-impact 1-sentence description" }
          ],
          "imagePrompts": [
            "Specific 3D abstract render prompt matching the theme",
            "Minimalist editorial photography prompt",
            "Technical detail prompt"
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Robust JSON extraction — strip any markdown code fences
      const cleaned = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) throw new Error("Invalid AI response format");
      
      const jsonStr = cleaned.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonStr);
      console.log(`[Neural Engine] ✅ Success with ${modelName}`);
      return parsed;

    } catch (error) {
      const errMsg = error?.message || '';
      console.warn(`[Neural Engine] ${modelName} failed:`, errMsg);
      lastError = error;

      // On quota errors (429) or model not found (404), try next model
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('404') || errMsg.includes('not found')) {
        console.log(`[Neural Engine] Quota/model issue, trying next...`);
        // Small delay before retrying to avoid hammering the API
        await new Promise(r => setTimeout(r, 800));
        continue;
      }

      // On API key errors, fail immediately — no point trying other models
      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('403') ||
          errMsg.includes('401') || errMsg.includes('API key')) {
        console.error('[Neural Engine] Invalid API key — using fallback data.');
        const isTemplate2 = userData.prompt?.includes('TEMPLATE_2');
        return buildFallback(userData, isTemplate2);
      }

      continue;
    }
  }

  // All models exhausted — use intelligent fallback so user still sees a result
  console.warn('[Neural Engine] All models exhausted — using demo portfolio data.');
  const isTemplate2 = userData.prompt?.includes('TEMPLATE_2');
  return buildFallback(userData, isTemplate2);
};
