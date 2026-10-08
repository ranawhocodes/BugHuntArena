import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelRequest extends IncomingMessage {
  body?: {
    language?: 'python' | 'javascript';
    difficulty?: 1 | 2 | 3;
  };
  query?: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'gemini-1.5-flash';

  const body = req.body || {};
  const language = body.language === 'javascript' ? 'javascript' : 'python';
  const difficulty = [1, 2, 3].includes(body.difficulty as number) ? body.difficulty : 1;

  if (!apiKey || apiKey === 'your-api-key-here') {
    // Graceful fallback signal when no key is configured
    return res.status(200).json({
      fallback: true,
      reason: 'No LLM_API_KEY set on server; using curated fallback.',
    });
  }

  const prompt = `You are a coding instructor creating a bug hunt challenge for beginners learning ${language}.
Create a short buggy program (5 to 10 lines) with EXACTLY ONE bug.
The code lines must each be under 55 characters long.
Return ONLY valid JSON matching this structure:
{
  "id": "ai-${language}-${Date.now()}",
  "title": "Short creative title",
  "language": "${language}",
  "category": "logic_error",
  "difficulty": ${difficulty},
  "concept": "Core topic being taught",
  "brief": "What the program is supposed to accomplish",
  "buggyCode": "code with exactly one bug",
  "bugLineNumber": 3,
  "expectedOutput": "correct output string",
  "actualOutput": "error or buggy output",
  "options": [
    { "id": "opt-a", "codeReplacement": "fixed code line", "explanation": "why this is correct" },
    { "id": "opt-b", "codeReplacement": "distractor line 1", "explanation": "why this is wrong" },
    { "id": "opt-c", "codeReplacement": "distractor line 2", "explanation": "why this is wrong" },
    { "id": "opt-d", "codeReplacement": "distractor line 3", "explanation": "why this is wrong" }
  ],
  "correctOptionId": "opt-a",
  "hints": [
    "Tier 1: Where to look",
    "Tier 2: Why it behaves unexpectedly",
    "Tier 3: Concrete fix strategy"
  ],
  "explanation": "Post-mortem explanation",
  "creature": {
    "id": "c-ai-creature",
    "name": "CreativeBugName",
    "species": "Glitch Species",
    "rarity": "rare",
    "description": "Fun creature personality lore",
    "avatarEmoji": "👾"
  }
}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 11000); // 11s timeout

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(200).json({
        fallback: true,
        reason: `Gemini API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(200).json({ fallback: true, reason: 'Empty candidate text from Gemini' });
    }

    const parsedPuzzle = JSON.parse(candidateText);
    return res.status(200).json({
      fallback: false,
      puzzle: parsedPuzzle,
    });
  } catch (err) {
    return res.status(200).json({
      fallback: true,
      reason: `Error during AI generation: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
