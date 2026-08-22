# 🚀 Melih Yılmaz - Personal Portfolio

Welcome to my personal portfolio and interactive resume! You can view the live site here: **[melihyilmaz.vercel.app](https://melihyilmaz.vercel.app/)**

## 🎯 What It Does & For Whom
This project serves as a digital portfolio for tech recruiters, engineering managers, and developers. It showcases my software engineering background.

## ⚙️ Setup (How to Run Locally)
Because this project is built with standard web technologies, anyone can easily run the project on their computer without needing complex build tools:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Melih-Yilmaz06/flyrank-ai-fluency-internship-portfolio-last-version.git](https://github.com/Melih-Yilmaz06/flyrank-ai-fluency-internship-portfolio-last-version.git)
   cd flyrank-ai-fluency-internship-portfolio-last-version
Run the site locally:
Since this is a front-end project (HTML/CSS/JS), you simply need to open the index.html file in your browser.
Alternatively, you can use a local server (like Live Server in VS Code or Python):

Bash
python -m http.server 8000
Then open http://localhost:8000 in your browser.

🏗️ Architecture Sketch
Frontend: HTML, CSS, and Vanilla JavaScript.

Hosting/Deployment: Vercel (Continuous Integration / CI active directly via GitHub).

Analytics: Vercel Web Analytics is integrated to monitor site traffic.

AI Agent: Integrated via an embedded widget/script, strictly constrained with my personal background and professional experiences.

📊 AI Agent Evaluation
I ran evaluation tests to ensure the AI agent acts as a reliable assistant regarding my resume:

Factual Accuracy: ~90% (Accurately identifies my education at İnönü University, my ML projects, and the tech stack I use).

Tone: 100% (Maintains a professional and helpful engineering tone).

Context Management: Good, but relies on the initial system prompt provided.

⚠️ Limitations & Guardrails
Hallucination Risk: Although fed with my specific CV data, the agent might occasionally hallucinate details or code I haven't written if pushed with very ambiguous prompts.

UI Constraint: The AI chat interface is an embedded component; meaning its design is constrained by the provider and may not 100% match the custom CSS of the main portfolio layout.

🤖 AI Transparency Statement (AI Fluency)
I used AI tools (Claude/Gemini) as a coding partner while building the core structure of this portfolio and generating the foundational code. However, I personally tested the UI responsiveness, integrated Vercel Web Analytics, structured the repository for deployment, and manually verified the factual accuracy of the AI agent's responses to ensure it reflects my true engineering background.
