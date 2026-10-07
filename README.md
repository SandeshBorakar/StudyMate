# StudyMate – AI Learning Assistant 🎓

An interactive, AI-powered study assistant built specifically for college students to master academic topics, review structured notes, test their knowledge with practice quizzes, and get instant answers to study doubts.

---

## 📌 Project Overview

StudyMate bridges the gap between dense textbooks and effective college-level learning. Students can enter any academic topic—from Computer Science and Biology to Economics and Physics—to instantly receive:
- Clear theoretical explanations with a beginner-friendly analogy mode.
- Well-organized, exam-ready study notes with bullet points.
- An interactive 5-question multiple-choice quiz with scoring and explanations.
- An AI tutor to answer specific academic questions and clarify doubts.

---

## ✨ Features

1. **Smart Topic Explorer (Home Page)**
   - Enter any college topic or pick from popular presets (*Operating Systems*, *Photosynthesis*, *Data Structures*, *Machine Learning*, *Microeconomics*).
   - Three quick-action study buttons: **Explain Topic**, **Generate Notes**, and **Generate Quiz**.

2. **AI Concept Explanation**
   - **Academic Summary Mode:** Rigorous, college-level theoretical overview of mechanisms and principles.
   - **🌱 Beginner-Friendly Mode (ELI5):** Real-world intuitive analogies making complex topics easy to grasp.
   - **Key Takeaways Checklist:** High-yield summary bullets.
   - One-click copy to clipboard.

3. **Organized Study Notes**
   - Structured revision notes with clear headings and bullet points.
   - Key definitions, processes, workflows, and high-yield exam takeaways.
   - One-click **Copy Notes** and **Print Notes** buttons for study sheets.

4. **Interactive 5-Question Quiz**
   - 5 multiple-choice questions (4 options each) generated for the chosen topic.
   - Real-time answer counter (e.g., `5 / 5 Answered`).
   - Detailed score card showing total score, percentage, and mastery badges.
   - Review mode highlighting correct options (emerald green) and incorrect selections (red), complete with rationale explanations.
   - **Retake Quiz** button for spaced repetition.

5. **Ask StudyMate AI**
   - Dedicated doubt-clearing section where students can type any question.
   - Helpful suggestion chips (e.g., *TCP vs UDP*, *Mitochondria & ATP*, *Study Tips*).
   - Instant structured AI response box with one-click copy.

6. **Dual Mode: Live AI & Resilient Local Fallback**
   - Connected to live AI when an API key is configured.
   - If the AI API is unconfigured, unreachable, or offline, StudyMate automatically switches to its local knowledge base (`mockData.js`) so the application never breaks.

---

## 🛠️ Technology Stack

- **Frontend:**
  - **HTML5:** Semantic markup, accessible components, and clean section structure.
  - **CSS3:** Custom Vanilla CSS design system with CSS variables, light educational theme, glassmorphism, responsive Flexbox/Grid, and micro-animations.
  - **JavaScript (ES6+):** Modular client-side controllers, interactive tab switching, quiz grading engine, and async API calls.
  - **Typography:** Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
- **Backend:**
  - **Node.js:** Lightweight server using native `http`, `fs`, and `path` modules with zero mandatory third-party dependencies.
  - **Security:** Server-side API key handling via `.env` file (API keys are never exposed to the client or browser).
- **AI Integration:**
  - **Google Gemini API** (default: `gemini-1.5-flash`) or OpenAI-compatible models.

---

## 📦 How to Install Dependencies

StudyMate is built with zero mandatory external npm packages—it runs directly using Node.js (v18 or higher) built-in modules!

1. Make sure you have **Node.js** (v18+) installed:
   ```bash
   node -v
   ```
2. (Optional) If you want to use npm scripts:
   ```bash
   npm install
   ```

---

## 🔑 How to Configure the AI API Key

> [!IMPORTANT]
> The AI API key is processed exclusively on the backend server. It is **never** sent to the client browser or exposed in frontend JavaScript.

1. In the project root directory, locate the `.env` file (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor and add your API key:
   ```env
   AI_API_KEY=your_actual_api_key_here
   ```

3. **Supported Providers:**
   - **Google Gemini (Default & Recommended):** Paste your Gemini API key (starts with `AIza...`). Get a free key at [Google AI Studio](https://aistudio.google.com/).
   - **OpenAI:** Paste your OpenAI API key (starts with `sk-...`). StudyMate will automatically detect OpenAI format.

4. If you leave `AI_API_KEY=your_api_key_here`, StudyMate will automatically activate **Offline / Fallback Mode** using `mockData.js` so you can still test every feature immediately!

---

## 🚀 How to Run the Project

1. Start the server:
   ```bash
   node server.js
   ```
   *Or using npm:*
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. **Status Indicator:**
   - Look at the top-right navbar badge:
     - ⚡ **Live AI Active** (green dot): AI key is configured and active.
     - 📚 **Fallback Mode** (amber dot): AI key is not set; curated reference dataset is active.

---

## 📁 Project Structure

```
StudyMate/
├── .env              # Private environment configuration (contains AI_API_KEY)
├── .env.example      # Template for environment configuration
├── package.json      # Project metadata & start scripts
├── server.js         # Secure Node.js server & AI API integration
├── index.html        # Main frontend UI structure
├── style.css         # Modern light educational styling & responsiveness
├── app.js            # Frontend logic, state management, & API fetchers
├── mockData.js       # Curated college knowledge base & dynamic fallback generator
└── README.md         # Documentation & guide
```
