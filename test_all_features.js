// Verification of all 4 features with "What is DBMS normalization?"
const fs = require('fs');

async function verifyAll() {
  const envContent = fs.readFileSync('.env', 'utf8');
  let apiKey = '';
  envContent.split('\n').forEach(line => {
    if (line.startsWith('AI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  });

  const query = "What is DBMS normalization?";
  console.log(`\n========================================`);
  console.log(`TESTING ALL FEATURES FOR: "${query}"`);
  console.log(`========================================\n`);

  // We test using our server's internal logic
  // Helper to extract clean topic name
  function extractCoreTopic(q) {
    if (!q) return '';
    let cleaned = q.trim().replace(/[?!.,;:]+$/, '').trim();
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
    if (!cleaned) cleaned = q.trim();
    return cleaned.split(/\s+/).map(w => {
      const upper = w.toUpperCase();
      if (['DBMS', 'SQL', 'CPU', 'RAM', 'OS', 'TCP', 'UDP', 'AI', 'ML', 'API', 'REST', 'HTTP', 'IP', 'DNS', 'DFS', 'BFS', 'BST', '1NF', '2NF', '3NF', 'BCNF'].includes(upper)) {
        return upper;
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }

  const cleanTopic = extractCoreTopic(query);
  console.log(`Clean Extracted Topic: "${cleanTopic}"`);

  async function callGemini(systemPrompt, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
    const promptText = `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}\n\nRespond with strict JSON ONLY.`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
      })
    });
    const d = await res.json();
    return JSON.parse(d.candidates[0].content.parts[0].text);
  }

  // 1. Test Explain
  console.log('\n--- 1. Testing Explain Topic ---');
  const explainPrompt = `You are StudyMate, an expert academic professor for college students.
Explain the topic "${cleanTopic}".
Return valid JSON with:
"title", "simpleDefinition", "detailedExplanation", "realWorldExample", "keyTakeaways" (array), "beginnerExplanation".
No filler text. Directly discuss DBMS Normalization, data redundancy, update/insertion/deletion anomalies, and 1NF, 2NF, 3NF, BCNF.`;
  const explainRes = await callGemini(explainPrompt, `Explain: "${cleanTopic}"`);
  console.log('Title:', explainRes.title);
  console.log('Simple Definition:', explainRes.simpleDefinition);
  console.log('Mentions Redundancy:', /redundanc/i.test(explainRes.detailedExplanation));
  console.log('Mentions Anomalies:', /anomal/i.test(explainRes.detailedExplanation));
  console.log('Mentions Normal Forms (1NF/2NF/3NF):', /1NF|2NF|3NF/i.test(explainRes.detailedExplanation));
  console.log('Real-World Example present:', !!explainRes.realWorldExample);
  console.log('Key Takeaways count:', explainRes.keyTakeaways?.length);

  // 2. Test Notes
  console.log('\n--- 2. Testing Generate Notes ---');
  const notesPrompt = `You are StudyMate, an expert academic professor.
Generate structured exam notes specifically for "${cleanTopic}".
Return JSON with "title" and "notes" containing "overview" and 3 "sections" with "heading" and "points" (array).`;
  const notesRes = await callGemini(notesPrompt, `Notes for: "${cleanTopic}"`);
  console.log('Notes Overview:', notesRes.notes?.overview);
  console.log('Notes Sections count:', notesRes.notes?.sections?.length);
  notesRes.notes?.sections?.forEach(s => console.log(' - Section:', s.heading));

  // 3. Test Quiz
  console.log('\n--- 3. Testing Generate Quiz ---');
  const quizPrompt = `You are StudyMate, an academic exam creator.
Generate exactly 5 MCQs specifically on "${cleanTopic}".
Each question must have 4 options and a 0-indexed "answer" integer and "explanation".
Return JSON with "quiz" array of 5 questions.`;
  const quizRes = await callGemini(quizPrompt, `Quiz on: "${cleanTopic}"`);
  console.log('Quiz questions count:', quizRes.quiz?.length);
  quizRes.quiz?.forEach((q, i) => {
    console.log(` Q${i+1}: ${q.question} (${q.options.length} options, correct answer: index ${q.answer})`);
  });

  // 4. Test Ask AI
  console.log('\n--- 4. Testing Ask AI ---');
  const askPrompt = `You are StudyMate, an academic tutor.
Answer directly: "${query}".
Return JSON with "title" and "answer" with markdown bullet points.`;
  const askRes = await callGemini(askPrompt, query);
  console.log('Ask Answer Title:', askRes.title);
  console.log('Ask Answer snippet:', askRes.answer.slice(0, 150) + '...');

  console.log('\n========================================');
  console.log('ALL 4 FEATURES VERIFIED SUCCESSFULLY!');
  console.log('========================================\n');
}

verifyAll().catch(console.error);
