/**
 * StudyMate – Secure Backend Server & AI API Integration
 * 
 * Provides:
 * 1. Static file hosting for frontend assets (HTML, CSS, JS)
 * 2. Secure server-side AI endpoints (/api/explain, /api/notes, /api/quiz, /api/ask)
 * 3. Environment variable management for AI_API_KEY (never exposed to browser)
 * 4. Dual provider support (Google Gemini & OpenAI-compatible)
 * 5. Robust fallback handling with mockData.js integration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Load .env file automatically (zero external dependencies) ---
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const equalIdx = line.indexOf('=');
        if (equalIdx > 0) {
          const key = line.slice(0, equalIdx).trim();
          let val = line.slice(equalIdx + 1).trim();
          // Remove surrounding quotes if present
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          // Do not overwrite existing process.env variables if already set
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (err) {
      console.warn('Notice: Could not parse .env file:', err.message);
    }
  }
}

loadEnv();

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

// Determine if AI API is configured
function getAIConfig() {
  const apiKey = (process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  const isPlaceholder = !apiKey || apiKey === 'your_api_key_here';
  const provider = process.env.AI_PROVIDER || (apiKey.startsWith('sk-') ? 'openai' : 'gemini');

  return {
    isConfigured: !isPlaceholder,
    apiKey: isPlaceholder ? '' : apiKey,
    provider: provider
  };
}

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Utility: Robust JSON cleaner and extractor
 * Strips markdown code blocks like ```json ... ``` and extracts the outermost JSON.
 */
function extractJSON(text) {
  if (!text) throw new Error('Empty AI response');
  let cleaned = text.trim();

  // Strip Markdown fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt substring between first { and last }, or first [ and last ]
    const firstObj = cleaned.indexOf('{');
    const lastObj = cleaned.lastIndexOf('}');
    if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
      return JSON.parse(cleaned.substring(firstObj, lastObj + 1));
    }
    const firstArr = cleaned.indexOf('[');
    const lastArr = cleaned.lastIndexOf(']');
    if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
      return JSON.parse(cleaned.substring(firstArr, lastArr + 1));
    }
    throw new Error(`Failed to parse AI response as JSON: ${err.message}`);
  }
}

/**
 * Call AI service securely from the backend (API key stays on server)
 */
async function callAIService(systemPrompt, userPrompt) {
  const config = getAIConfig();
  if (!config.isConfigured) {
    throw new Error('AI_API_KEY is not configured in .env file.');
  }

  if (config.provider === 'openai') {
    // OpenAI Chat Completions API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    return extractJSON(rawContent);
  } else {
    // Default: Google Gemini API (v1beta)
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const fallbackModels = [primaryModel, 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash'].filter((v, i, a) => a.indexOf(v) === i);

    let lastError = null;
    for (const model of fallbackModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
        const promptText = `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}\n\nRespond with strict JSON ONLY.`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          })
        });

        if (!response.ok) {
          const errBody = await response.text();
          lastError = new Error(`Gemini API model ${model} error (${response.status}): ${errBody}`);
          continue; // Try next candidate model if available
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Gemini API returned an empty response.');
        }
        return extractJSON(rawText);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini candidate models failed.');
  }
}

/**
 * Handle HTTP request body parsing
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Helper to respond with JSON
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

// --- Main HTTP Server ---
const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const pathname = decodeURI(urlParts[0]);

  // =========================================================================
  // API Routes
  // =========================================================================

  // 1. API Status (Does NOT expose API key)
  if (req.method === 'GET' && pathname === '/api/status') {
    const config = getAIConfig();
    return sendJson(res, 200, {
      aiAvailable: config.isConfigured,
      provider: config.isConfigured ? config.provider : 'none',
      message: config.isConfigured
        ? 'Real AI backend is online and configured.'
        : 'AI_API_KEY is not configured in .env. Mock data fallback is active.'
    });
  }

  // Helper to extract clean topic name from natural questions
  function extractCoreTopic(query) {
    if (!query) return '';
    let cleaned = query.trim().replace(/[?!.,;:]+$/, '').trim();
    const prefixes = [
      /^what\s+(is|are)\s+(a\s+|an\s+|the\s+)?/i,
      /^(can\s+you\s+)?explain\s+(about\s+|the\s+)?/i,
      /^define\s+(the\s+)?/i,
      /^tell\s+me\s+about\s+(the\s+)?/i,
      /^teach\s+me\s+(about\s+)?/i,
      /^how\s+does\s+/i,
      /^how\s+do\s+/i,
      /^give\s+me\s+(notes\s+on|a\s+summary\s+of|an\s+overview\s+of)\s+/i,
      /^overview\s+of\s+/i,
      /^introduction\s+to\s+/i
    ];
    for (const prefix of prefixes) {
      if (prefix.test(cleaned)) {
        cleaned = cleaned.replace(prefix, '').trim();
        break;
      }
    }
    if (!cleaned) cleaned = query.trim();
    return cleaned.split(/\s+/).map(w => {
      const upper = w.toUpperCase();
      if (['DBMS', 'SQL', 'CPU', 'RAM', 'OS', 'TCP', 'UDP', 'AI', 'ML', 'API', 'REST', 'HTTP', 'IP', 'DNS', 'DFS', 'BFS', 'BST', '1NF', '2NF', '3NF', 'BCNF'].includes(upper)) {
        return upper;
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }

  // 2. Explain Topic Endpoint
  if (req.method === 'POST' && pathname === '/api/explain') {
    try {
      const { topic } = await readJsonBody(req);
      if (!topic || !topic.trim()) {
        return sendJson(res, 400, { error: 'Topic is required.' });
      }

      const cleanTopic = extractCoreTopic(topic);
      const config = getAIConfig();
      if (!config.isConfigured) {
        return sendJson(res, 200, {
          fallback: true,
          message: 'AI_API_KEY not configured. Falling back to local knowledge base.'
        });
      }

      const systemPrompt = `You are StudyMate, an expert academic professor and learning assistant for college students.
A student entered: "${topic.trim()}".
The identified academic topic is: "${cleanTopic}".

CORE REQUIREMENTS:
1. If the student entered a question (e.g. "What is DBMS normalization?"), answer that question directly.
2. If the student entered only a topic name (e.g. "DBMS normalization"), explain that topic directly.
3. NEVER repeat awkward phrases like "What is DBMS normalization? is...". Always write direct, grammatical sentences.
4. Avoid generic filler text such as "is an essential academic subject that encompasses fundamental theoretical principles". Focus strictly on the real technical definitions, mechanisms, and facts of "${cleanTopic}".
5. Structure your output exactly into these 5 components:
   - "title": Clean standardized academic title (e.g. "${cleanTopic}").
   - "simpleDefinition": Direct, plain-English 1-2 sentence definition explaining WHAT it is without fluff.
   - "detailedExplanation": Thorough, accurate college-level explanation focusing on the actual technical mechanisms, components, rules, and problems solved (for example, if explaining DBMS normalization, explain reducing data redundancy, eliminating insertion/update/deletion anomalies, and the progression of normal forms 1NF, 2NF, 3NF, BCNF).
   - "realWorldExample": Concrete, relatable real-world or industry scenario (e.g. comparing an unnormalized table suffering from update anomalies with normalized relational tables).
   - "keyTakeaways": An array of 3-4 specific, high-yield bullet strings covering essential exam takeaways.
   - "beginnerExplanation": An intuitive analogy or "Explain Like I'm 5" explanation that makes the concept visual and relatable.

Return ONLY a valid JSON object matching this schema:
{
  "title": "${cleanTopic}",
  "simpleDefinition": "1-2 sentence direct definition",
  "detailedExplanation": "Comprehensive college-level explanation detailing core mechanisms, components, and rules.",
  "realWorldExample": "Concrete, relatable real-world scenario.",
  "keyTakeaways": [
    "First specific takeaway",
    "Second specific takeaway",
    "Third specific takeaway"
  ],
  "beginnerExplanation": "Intuitive everyday analogy."
}`;

      const aiData = await callAIService(systemPrompt, `Explain the academic topic: "${cleanTopic}" (User query: "${topic.trim()}")`);
      return sendJson(res, 200, { success: true, source: 'ai', data: aiData });
    } catch (err) {
      console.error('Explain API Error:', err.message);
      return sendJson(res, 200, {
        fallback: true,
        error: err.message,
        message: 'Live AI request failed. Falling back to reference knowledge base.'
      });
    }
  }

  // 3. Generate Notes Endpoint
  if (req.method === 'POST' && pathname === '/api/notes') {
    try {
      const { topic } = await readJsonBody(req);
      if (!topic || !topic.trim()) {
        return sendJson(res, 400, { error: 'Topic is required.' });
      }

      const cleanTopic = extractCoreTopic(topic);
      const config = getAIConfig();
      if (!config.isConfigured) {
        return sendJson(res, 200, {
          fallback: true,
          message: 'AI_API_KEY not configured. Falling back to local notes.'
        });
      }

      const systemPrompt = `You are StudyMate, an expert academic professor for college students.
Generate structured, exam-focused study notes specifically about: "${cleanTopic}".

CORE REQUIREMENTS:
1. Notes must be specifically and directly about "${cleanTopic}".
2. Do NOT use generic filler sentences. Every heading and point must contain real technical terms, rules, and mechanisms relevant to "${cleanTopic}".
3. Provide:
   - "overview": A concise 1-2 sentence summary defining "${cleanTopic}".
   - "sections": An array of 3 logically organized sections:
     - Section 1: Core Fundamentals & Definitions (key terminology, definitions)
     - Section 2: Key Mechanisms, Workflows, or Stages (step-by-step processes, forms, or equations)
     - Section 3: Applications, Best Practices, and Exam Tips (high-yield tips, trade-offs)
4. Use markdown bolding (**Term:** description) for key concepts.

Return ONLY a valid JSON object matching this schema:
{
  "title": "${cleanTopic}",
  "notes": {
    "overview": "Concise high-level overview of ${cleanTopic}.",
    "sections": [
      {
        "heading": "1. ...",
        "points": [
          "**Key Term:** Explanation",
          "**Concept:** Explanation"
        ]
      },
      {
        "heading": "2. ...",
        "points": [
          "**Mechanism/Stage:** Explanation",
          "**Workflow:** Explanation"
        ]
      },
      {
        "heading": "3. ...",
        "points": [
          "**Exam Tip:** Explanation",
          "**Application:** Explanation"
        ]
      }
    ]
  }
}`;

      const aiData = await callAIService(systemPrompt, `Generate revision notes for: "${cleanTopic}"`);
      return sendJson(res, 200, { success: true, source: 'ai', data: aiData });
    } catch (err) {
      console.error('Notes API Error:', err.message);
      return sendJson(res, 200, {
        fallback: true,
        error: err.message,
        message: 'Live AI request failed. Falling back to reference notes.'
      });
    }
  }

  // 4. Generate Quiz Endpoint (5 MCQs, 4 options each)
  if (req.method === 'POST' && pathname === '/api/quiz') {
    try {
      const { topic } = await readJsonBody(req);
      if (!topic || !topic.trim()) {
        return sendJson(res, 400, { error: 'Topic is required.' });
      }

      const cleanTopic = extractCoreTopic(topic);
      const config = getAIConfig();
      if (!config.isConfigured) {
        return sendJson(res, 200, {
          fallback: true,
          message: 'AI_API_KEY not configured. Falling back to local quiz.'
        });
      }

      const systemPrompt = `You are StudyMate, an expert academic exam creator for college students.
Generate an interactive multiple-choice quiz specifically testing comprehension of: "${cleanTopic}".

CORE REQUIREMENTS:
1. Generate EXACTLY 5 questions directly and specifically about "${cleanTopic}".
2. Each question must have EXACTLY 4 distinct options (options array of length 4).
3. "answer" must be the 0-based integer index (0, 1, 2, or 3) indicating the single correct option.
4. "explanation" must provide a clear rationale explaining why that option is correct.
5. Questions must be college-level, testing real definitions, mechanisms, normal forms, formulas, or trade-offs.

Return ONLY a valid JSON object matching this schema:
{
  "quiz": [
    {
      "question": "Specific question about ${cleanTopic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Clear explanation of why this answer is correct."
    }
  ]
}
The array MUST contain exactly 5 question objects.`;

      const aiData = await callAIService(systemPrompt, `Generate a 5-question quiz for: "${cleanTopic}"`);
      return sendJson(res, 200, { success: true, source: 'ai', data: aiData });
    } catch (err) {
      console.error('Quiz API Error:', err.message);
      return sendJson(res, 200, {
        fallback: true,
        error: err.message,
        message: 'Live AI request failed. Falling back to reference quiz.'
      });
    }
  }

  // 5. Ask AI Q&A Endpoint
  if (req.method === 'POST' && pathname === '/api/ask') {
    try {
      const { question, topic } = await readJsonBody(req);
      if (!question || !question.trim()) {
        return sendJson(res, 400, { error: 'Question is required.' });
      }

      const cleanTopic = topic ? extractCoreTopic(topic) : '';
      const config = getAIConfig();
      if (!config.isConfigured) {
        return sendJson(res, 200, {
          fallback: true,
          message: 'AI_API_KEY not configured. Falling back to local Q&A engine.'
        });
      }

      const systemPrompt = `You are StudyMate, an encouraging, highly knowledgeable AI academic tutor for college students.
A student is asking: "${question.trim()}".
${cleanTopic ? `Current Study Topic Context: "${cleanTopic}".` : ''}

CORE REQUIREMENTS:
1. Answer the question directly, accurately, and supportively.
2. If the user asks a question like "What is DBMS normalization?", explain it directly using simple English without generic fluff.
3. Structure the response using markdown bolding and bullet points for effortless reading.
4. Keep the explanation focused on college-level understanding.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Clear descriptive title for the answer",
  "answer": "Direct, structured answer with markdown bullets and bold text."
}`;

      const userPrompt = `Context Topic: ${cleanTopic ? `"${cleanTopic}"` : 'General Academic Studies'}\nQuestion: "${question.trim()}"`;
      const aiData = await callAIService(systemPrompt, userPrompt);
      return sendJson(res, 200, { success: true, source: 'ai', data: aiData });
    } catch (err) {
      console.error('Ask AI Error:', err.message);
      return sendJson(res, 200, {
        fallback: true,
        error: err.message,
        message: 'Live AI request failed. Falling back to local Q&A answer.'
      });
    }
  }

  // =========================================================================
  // Static File Serving
  // =========================================================================
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(path.join(BASE_DIR, reqPath));

  // Security: Prevent directory traversal outside BASE_DIR
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const config = getAIConfig();
  console.log(`StudyMate server listening at http://localhost:${PORT}`);
  if (config.isConfigured) {
    console.log(`⚡ AI Mode Active (Provider: ${config.provider})`);
  } else {
    console.log(`📚 AI_API_KEY is not set or placeholder. Fallback mode (mockData.js) ready.`);
  }
});
