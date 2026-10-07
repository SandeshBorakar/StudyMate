// Test live prompt and response formatting
const fs = require('fs');
const path = require('path');

// Read .env
const envContent = fs.readFileSync('.env', 'utf8');
let apiKey = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('AI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
});

console.log('Testing with API key present:', !!apiKey && apiKey !== 'your_api_key_here');

// Helper to extract clean topic name
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

console.log('Extracted topic from "What is DBMS normalization?":', extractCoreTopic("What is DBMS normalization?"));

async function testGemini() {
  const query = "What is DBMS normalization?";
  const cleanTopic = extractCoreTopic(query);

  const systemPrompt = `You are StudyMate, an expert academic professor and learning assistant for college students.
A student entered: "${query}".
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
  "simpleDefinition": "...",
  "detailedExplanation": "...",
  "realWorldExample": "...",
  "keyTakeaways": ["...", "...", "..."],
  "beginnerExplanation": "..."
}`;

  const promptText = `${systemPrompt}\n\nUSER REQUEST:\nExplain the academic topic: "${cleanTopic}" (User query: "${query}")\n\nRespond with strict JSON ONLY.`;

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  console.log('Calling Gemini API for query:', query);
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  console.log('Gemini HTTP Status:', resp.status);
  const data = await resp.json();
  if (!resp.ok) {
    console.error('Gemini API Error details:', JSON.stringify(data, null, 2));
    return;
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('\n--- Gemini Generated Response ---');
  console.log(rawText);

  const parsed = JSON.parse(rawText);
  console.log('\n--- Parsed Fields ---');
  console.log('Title:', parsed.title);
  console.log('Simple Definition:', parsed.simpleDefinition);
  console.log('Has 1NF/2NF/3NF in detailed explanation:', /1NF|2NF|3NF|normal form/i.test(parsed.detailedExplanation));
  console.log('Has redundancy in detailed explanation:', /redundancy/i.test(parsed.detailedExplanation));
  console.log('Has anomalies in detailed explanation:', /anomal/i.test(parsed.detailedExplanation));
  console.log('Real-World Example:', parsed.realWorldExample);
  console.log('Key Takeaways count:', parsed.keyTakeaways?.length);
  console.log('Does NOT start with "What is...":', !parsed.simpleDefinition.startsWith('What is'));
}

testGemini().catch(console.error);
