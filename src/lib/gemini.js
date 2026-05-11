import { GoogleGenerativeAI } from "@google/generative-ai";

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Clean the API key in case whitespace or quotes are present
const API_KEY = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

const genAI = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') ? new GoogleGenerativeAI(API_KEY) : null;

// ─── Fallback demo data — parses theme from gallery prompt ────────────────────
const buildFallback = (userData) => {
  const p = userData.prompt || '';

  // Extract hex colors from the prompt (e.g. (#060608))
  const hexMatches = p.match(/#([0-9a-fA-F]{3,8})/g) || [];
  const bg     = hexMatches[0] || '#0a0a0b';
  const accent = hexMatches[1] || '#ccff00';
  const text   = (bg.toLowerCase() === '#fefbf7' || bg.toLowerCase() === '#faf7f2')
    ? '#1a1614' : '#f5f5f5';

  // Font detection from prompt keywords
  let fontDisplay = 'Space Grotesk';
  let fontBody    = 'Inter';
  if (p.includes('Cormorant')) { fontDisplay = 'Cormorant Garamond'; fontBody = 'Inter'; }
  else if (p.includes('Space Mono')) { fontDisplay = 'Space Mono'; fontBody = 'Space Mono'; }
  else if (p.includes('Playfair')) { fontDisplay = 'Playfair Display'; fontBody = 'Manrope'; }
  else if (p.includes('Manrope'))  { fontDisplay = 'Space Grotesk'; fontBody = 'Manrope'; }

  return {
    bg, text, accent, fontDisplay, fontBody,
    vibe: 'Cinematic precision — the portfolio speaks before you do.',
    bio: `${userData.name || 'This designer'} is a visionary ${userData.role || 'creative professional'} who transforms complex ideas into elegant, high-impact solutions.`,
    aboutText: `Driven by curiosity and precision, operating at the intersection of art and technology.`,
    skills: ['Design Systems', 'Creative Direction', 'Product Strategy', 'UI Engineering', 'Brand Identity', 'Motion Design'],
    experience: [
      { role: userData.role || 'Creative Lead', company: 'Freelance Studio', duration: '2022–Present', description: 'Leading end-to-end creative strategy and execution for global clients.' },
      { role: 'Senior Designer', company: 'Innovation Lab', duration: '2019–2022', description: 'Shaped the visual identity and product experience for a rapidly growing platform.' },
      { role: 'Design Lead', company: 'Creative Agency', duration: '2017–2019', description: 'Delivered award-winning campaigns across digital and physical touchpoints.' },
    ],
    imagePrompts: [
      'Abstract 3D architectural render matching the portfolio theme',
      'Minimalist editorial studio photography',
      'Technical geometric detail shot',
    ],
    _isFallback: true,
  };
};


export const generatePortfolioData = async (userData) => {
  if (!genAI) {
    console.warn("[Neural Engine] No API key — using demo portfolio data.");
    return buildFallback(userData);
  }

  // Priority order: highest free-tier quota first
  const modelNames = [
    "gemini-2.5-flash-preview-04-17",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro",
  ];

  for (const modelName of modelNames) {
    try {
      console.log(`[Neural Engine] Attempting synthesis with: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 2048 },
      });

      const prompt = `
        You are a world-class creative director and UI designer in 2026.

        TASK: Generate a cinematic portfolio design system for this person.
        NAME: ${userData.name || 'Creative Professional'}
        ROLE: ${userData.role || 'Designer'}
        THEME REQUEST: ${userData.prompt || 'Minimalist dark editorial portfolio'}

        CRITICAL: Follow the THEME REQUEST exactly. If it specifies hex colors like (#0d0221) use those EXACT values.
        If it specifies fonts like "Space Mono", use those EXACT font names.

        Return ONLY a valid JSON object — no markdown, no backticks, no explanation:
        {
          "bg": "background hex color matching the theme",
          "text": "text hex color (light for dark bg, dark for light bg)",
          "accent": "accent hex color matching the theme",
          "fontDisplay": "display font family name",
          "fontBody": "body font family name",
          "vibe": "One sentence describing the design aesthetic",
          "bio": "A sophisticated 2-sentence bio for ${userData.name || 'this person'} as a ${userData.role || 'designer'}",
          "aboutText": "One sentence about their design philosophy",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
          "experience": [
            { "role": "Job Title", "company": "Company Name", "duration": "2022–Present", "description": "One impactful sentence about this role" },
            { "role": "Job Title", "company": "Company Name", "duration": "2019–2022", "description": "One impactful sentence about this role" },
            { "role": "Job Title", "company": "Company Name", "duration": "2017–2019", "description": "One impactful sentence about this role" }
          ],
          "imagePrompts": [
            "Abstract 3D render prompt matching the theme aesthetic",
            "Editorial photography prompt matching the theme",
            "Technical detail prompt"
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      // Strip markdown code fences if present
      const cleaned = rawText.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) throw new Error("Invalid AI response format");

      const parsed = JSON.parse(cleaned.substring(jsonStart, jsonEnd));
      console.log(`[Neural Engine] ✅ Success with ${modelName}`);
      return parsed;

    } catch (error) {
      const errMsg = error?.message || '';
      console.warn(`[Neural Engine] ${modelName} failed:`, errMsg);

      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('404') || errMsg.includes('not found')) {
        await new Promise(r => setTimeout(r, 800));
        continue;
      }

      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('403') ||
          errMsg.includes('401') || errMsg.includes('API key')) {
        console.error('[Neural Engine] Invalid API key — using fallback data.');
        return buildFallback(userData);
      }

      continue;
    }
  }

  // All models exhausted — use theme-aware fallback
  console.warn('[Neural Engine] All models exhausted — using theme-aware fallback.');
  return buildFallback(userData);
};
