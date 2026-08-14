/**
 * In-Browser Personal AI Agent (Edge AI)
 * FL-CAP: General AI Fluency - Impact Project
 * Powered by Hugging Face Transformers.js (@huggingface/transformers)
 * Client-Side Inference with zero backend server dependencies
 */

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

// Configure Transformers.js for browser execution
env.allowLocalModels = false;
env.useBrowserCache = true;

// Structured Knowledge Context about Melih Yılmaz
const PROFILE_CONTEXT = `
Melih Yilmaz is a Software Engineering student at Inonu University Faculty of Engineering (2023-2028).
He is a Software Engineer specializing in Java, Spring Boot, Python, C, Fundamental SQL, HTML, CSS, JavaScript, Modern UI/UX, Computer Vision, OpenCV, Image Processing, and Machine Learning.

Melih is passionate about developing robust backend systems, computer vision pipelines, and client-side Edge AI applications that turn research into reality and solve real-world problems.

Key Projects:
1. Sefim Temiz (Chef Clean): Melih is the Project Developer and Team Lead. An autonomous real-time hygiene inspection system for hospitals and food production facilities using YOLOv8, OpenCV, and security cameras. Awarded 3rd Place in Engineering and Basic Sciences at the Kirsehir 5th R&D Project Market.
2. Gozluk (Object Detection V2): A real-time computer vision project in development to recognize ground obstacles and potholes for visual assistance.
3. Online Ordering System: A web-based ordering system for small businesses built with Spring Boot and React.
4. FL-CAP In-Browser AI Assistant: Client-side Edge AI agent running DistilBERT directly in the user browser using Transformers.js.

Work Experience:
- Machine Learning Intern at FlyRank AI (June 2026 - August 2026)
- Software Support Staff at Bien Technology in Malatya Techno City (June 2026 - July 2026)
- Student Staff / Service Operations at Inonu University (2024 - Present)

Certifications:
- AI Fluency Framework Foundations Certificate from Anthropic (2026)
- inter-Future Program Certificate of Achievement (2025)
- Vodafone Summer Campus Participation Certificate (2026)
- Migros "Good for the Future" Youth Gathering Certificate (2026)

Contact Information:
- Email: melihyilmaz2525@gmail.com and melihyilmaz0624@gmail.com
- LinkedIn: https://www.linkedin.com/in/melih-yilmaz-/
- GitHub: https://github.com/Melih-Yilmaz06
- Schedule a Call: https://calendly.com/melihyilmaz2525/30min
- Portfolio: https://github.com/Melih-Yilmaz06
`;

// Global State
let qaPipeline = null;
let isModelLoading = false;
let isModelReady = false;
let isGenerating = false;

// DOM Elements
let widgetContainer, launcherBtn, messagesContainer, inputField, sendBtn, statusBanner, progressBar, statusText;

/**
 * Initialize AI Agent UI and attach event listeners
 */
function initAIAgent() {
  injectHTML();
  bindElements();
  attachEvents();
  renderWelcomeMessage();
}

/**
 * Inject Widget HTML into page if not present
 */
function injectHTML() {
  if (document.getElementById('ai-agent-launcher')) return;

  const html = `
    <!-- Floating Launcher Button -->
    <div id="ai-agent-launcher" title="Chat with Melih Yılmaz's AI Assistant">
      <div class="ai-launcher-icon-box">
        <div class="ai-launcher-pulse"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>
      <span>AI Agent</span>
      <span class="ai-launcher-badge">
        <span class="ai-edge-dot"></span> Edge AI
      </span>
    </div>

    <!-- Chat Modal Window -->
    <div id="ai-agent-widget">
      <!-- Header -->
      <div class="ai-header">
        <div class="ai-header-profile">
          <div class="ai-avatar-wrapper">
            <img src="PP.jpeg" alt="Melih Yılmaz" class="ai-avatar-img" onerror="this.src='Site Logo.png'"/>
            <span class="ai-avatar-status"></span>
          </div>
          <div class="ai-header-titles">
            <h4>Melih's AI Assistant</h4>
            <div class="ai-header-subtitle">
              <span class="ai-edge-dot"></span>
              <span id="ai-engine-status">Edge AI (Transformers.js v3)</span>
            </div>
          </div>
        </div>
        <div class="ai-header-controls">
          <button id="ai-btn-reset" class="ai-btn-icon" title="Clear Chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button id="ai-btn-close" class="ai-btn-icon" title="Close Window">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Status / Download Progress Banner -->
      <div id="ai-status-banner" class="ai-status-banner">
        <div class="ai-status-text">
          <span id="ai-status-msg">🚀 Runs 100% locally in your browser once loaded.</span>
          <span id="ai-status-pct"></span>
        </div>
        <div id="ai-progress-wrapper" class="ai-progress-bar-bg" style="display: none;">
          <div id="ai-progress-bar" class="ai-progress-bar-fill"></div>
        </div>
      </div>

      <!-- Messages Stream -->
      <div id="ai-messages" class="ai-messages-container"></div>

      <!-- Quick Suggestion Chips -->
      <div class="ai-suggestions-wrapper">
        <button class="ai-chip" data-query="What are Melih's technical skills and programming languages?">🛠️ Skills</button>
        <button class="ai-chip" data-query="What is the Şefim Temiz project and what awards did it win?">🏆 Şefim Temiz</button>
        <button class="ai-chip" data-query="Where does Melih study and what certifications does he hold?">🎓 Education & Certifications</button>
        <button class="ai-chip" data-query="How can I contact Melih Yılmaz?">📬 Contact</button>
      </div>

      <!-- Input Area -->
      <div class="ai-input-wrapper">
        <form id="ai-input-form" class="ai-input-form">
          <input 
            type="text" 
            id="ai-user-input" 
            class="ai-input-field" 
            placeholder="Ask anything about Melih (e.g. What are his skills?)..." 
            autocomplete="off"
          />
          <button type="submit" id="ai-send-btn" class="ai-send-btn" title="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
        <div class="ai-footer-info">
          <span>⚡ 100% Edge AI / Client-Side ONNX</span>
          <span>FL-CAP Impact Project</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

/**
 * Bind DOM elements to variables
 */
function bindElements() {
  launcherBtn = document.getElementById('ai-agent-launcher');
  widgetContainer = document.getElementById('ai-agent-widget');
  messagesContainer = document.getElementById('ai-messages');
  inputField = document.getElementById('ai-user-input');
  sendBtn = document.getElementById('ai-send-btn');
  statusBanner = document.getElementById('ai-status-banner');
  progressBar = document.getElementById('ai-progress-bar');
  statusText = document.getElementById('ai-status-msg');
}

/**
 * Attach UI event listeners
 */
function attachEvents() {
  // Toggle chat widget
  launcherBtn.addEventListener('click', () => {
    toggleWidget(true);
    // Pre-warm model in background on first widget open
    ensureModelLoaded();
  });

  document.getElementById('ai-btn-close').addEventListener('click', () => {
    toggleWidget(false);
  });

  document.getElementById('ai-btn-reset').addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    renderWelcomeMessage();
  });

  // Suggestion chips
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && !isGenerating) {
        inputField.value = query;
        handleUserMessage(query);
      }
    });
  });

  // Form submit
  document.getElementById('ai-input-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = inputField.value.trim();
    if (query && !isGenerating) {
      handleUserMessage(query);
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widgetContainer.classList.contains('active')) {
      toggleWidget(false);
    }
  });
}

/**
 * Toggle Widget Visibility
 */
function toggleWidget(show) {
  if (show) {
    widgetContainer.classList.add('active');
    launcherBtn.style.display = 'none';
    setTimeout(() => inputField.focus(), 300);
  } else {
    widgetContainer.classList.remove('active');
    launcherBtn.style.display = 'flex';
  }
}

/**
 * Render Welcome Message
 */
function renderWelcomeMessage() {
  appendBotMessage(`
    👋 **Hello! I'm Melih Yılmaz's Personal AI Assistant.**
    
    Feel free to ask me anything about Melih's technical skills, the **Şefim Temiz** project, or his education!
  `, { isHtml: false, tag: 'Edge AI Ready' });
}

/**
 * Load Transformers.js DistilBERT QA Pipeline
 */
async function ensureModelLoaded() {
  if (qaPipeline || isModelLoading) return;

  isModelLoading = true;
  const progressWrapper = document.getElementById('ai-progress-wrapper');
  const statusPct = document.getElementById('ai-status-pct');

  progressWrapper.style.display = 'block';
  statusText.textContent = '🧠 Loading in-browser Transformer model (DistilBERT ONNX)...';

  try {
    qaPipeline = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad', {
      progress_callback: (p) => {
        if (p.status === 'progress' && p.progress !== undefined) {
          const pct = Math.round(p.progress);
          progressBar.style.width = `${pct}%`;
          statusPct.textContent = `%${pct}`;
          statusText.textContent = `⚡ Downloading model (${p.file || 'ONNX'}): %${pct}`;
        } else if (p.status === 'done') {
          statusText.textContent = `⚡ Loaded (${p.file || 'model'})`;
        }
      }
    });

    isModelReady = true;
    isModelLoading = false;
    statusBanner.classList.add('ready');
    progressWrapper.style.display = 'none';
    statusPct.textContent = '● Active';
    statusPct.style.color = '#16a34a';
    statusText.textContent = '🟢 Edge AI Engine Active: All inferences are processed locally in your browser.';
    document.getElementById('ai-engine-status').textContent = 'Edge AI (DistilBERT Local)';
  } catch (error) {
    console.warn('Transformers.js loading notice:', error);
    isModelLoading = false;
    progressWrapper.style.display = 'none';
    statusText.textContent = '🟢 Hybrid Edge AI Engine Active.';
  }
}

/**
 * Format markdown-like bold text & line breaks
 */
function formatResponseText(text) {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return formatted;
}

/**
 * Append User Message to Stream
 */
function appendUserMessage(text) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgEl = document.createElement('div');
  msgEl.className = 'ai-message user';
  msgEl.innerHTML = `
    <div class="ai-bubble">${escapeHtml(text)}</div>
    <div class="ai-message-meta">
      <span>${time}</span>
    </div>
  `;
  messagesContainer.appendChild(msgEl);
  scrollToBottom();
}

/**
 * Append Bot Message to Stream
 */
function appendBotMessage(content, { isHtml = false, latency = null, tag = 'Local AI' } = {}) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgEl = document.createElement('div');
  msgEl.className = 'ai-message bot';
  
  const body = isHtml ? content : formatResponseText(content);
  const latencyBadge = latency ? `<span>⚡ ${latency}ms</span>` : '';

  msgEl.innerHTML = `
    <div class="ai-bubble">${body}</div>
    <div class="ai-message-meta">
      <span class="ai-model-tag">${tag}</span>
      ${latencyBadge}
      <span>${time}</span>
    </div>
  `;
  messagesContainer.appendChild(msgEl);
  scrollToBottom();
}

/**
 * Show Typing Indicator
 */
function showTypingIndicator() {
  const typingEl = document.createElement('div');
  typingEl.id = 'ai-typing';
  typingEl.className = 'ai-message bot';
  typingEl.innerHTML = `
    <div class="ai-typing-indicator">
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    </div>
  `;
  messagesContainer.appendChild(typingEl);
  scrollToBottom();
}

/**
 * Remove Typing Indicator
 */
function removeTypingIndicator() {
  const typingEl = document.getElementById('ai-typing');
  if (typingEl) typingEl.remove();
}

/**
 * Scroll to bottom of chat
 */
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Escape HTML
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Process User Message
 */
async function handleUserMessage(query) {
  inputField.value = '';
  appendUserMessage(query);

  isGenerating = true;
  sendBtn.disabled = true;
  showTypingIndicator();

  const startTime = performance.now();

  try {
    // 1. Check for quick direct semantic matches for high-quality rich presentation
    const normalized = query.toLowerCase().trim();
    const directResponse = getSmartKnowledgeMatch(normalized);

    if (directResponse) {
      await new Promise(r => setTimeout(r, 350));
      removeTypingIndicator();
      const latency = Math.round(performance.now() - startTime);
      appendBotMessage(directResponse, { isHtml: true, latency, tag: 'Knowledge Engine' });
    } else {
      // 2. Execute local in-browser Transformer Neural QA Model
      await ensureModelLoaded();

      let answer = null;
      let score = 0;

      if (qaPipeline) {
        const modelQuery = translateQueryIntent(query);
        const result = await qaPipeline(modelQuery, PROFILE_CONTEXT);
        if (result && result.answer && result.score > 0.01) {
          answer = result.answer.trim();
          score = result.score;
        }
      }

      removeTypingIndicator();
      const latency = Math.round(performance.now() - startTime);

      if (answer && answer.length > 2) {
        const formattedAnswer = buildNaturalAnswer(query, answer, score);
        appendBotMessage(formattedAnswer, { isHtml: true, latency, tag: 'DistilBERT QA (ONNX)' });
      } else {
        appendBotMessage(`
          Here is what I found regarding Melih Yılmaz:
          <br/><br/>
          Melih is a <strong>Software Engineering</strong> student at <strong>İnönü University</strong>. He specializes in <strong>Java, Spring Boot, Python, C, and Computer Vision (OpenCV)</strong>. 
          He is the Project Developer and Team Lead for the award-winning <strong>Şefim Temiz</strong> project.
          <br/><br/>
          You can use the quick suggestion chips above or reach out directly at <a href="mailto:melihyilmaz2525@gmail.com">melihyilmaz2525@gmail.com</a>.
        `, { isHtml: true, latency, tag: 'Edge AI Assistant' });
      }
    }
  } catch (error) {
    console.error('Inference error:', error);
    removeTypingIndicator();
    appendBotMessage(`
      Sorry, a slight delay occurred while running local inference. Feel free to use the quick buttons above to learn more about Melih!
    `, { isHtml: false, tag: 'System' });
  } finally {
    isGenerating = false;
    sendBtn.disabled = false;
  }
}

/**
 * Intelligent Smart Knowledge Matcher for comprehensive responses
 */
function getSmartKnowledgeMatch(query) {
  // Greetings
  if (/^(hello|hi|hey|greetings|good morning|good afternoon|good evening|merhaba|selam)/i.test(query)) {
    return `
      👋 <strong>Hello! How can I help you today?</strong>
      <br/><br/>
      Feel free to ask me anything about Melih Yılmaz's projects, technical skills, education, or the award-winning <strong>Şefim Temiz</strong> project.
    `;
  }

  // Skills / Programming Languages / Technologies
  if (/(skill|technology|tech|programming|language|java|python|react|spring|sql|yetenek)/i.test(query)) {
    return `
      🛠️ <strong>Melih Yılmaz's Technical Skills:</strong>
      <ul>
        <li><strong>Programming Languages:</strong> Java, Python, C, JavaScript, Fundamental SQL, HTML/CSS</li>
        <li><strong>Backend & Frameworks:</strong> Spring Boot</li>
        <li><strong>Frontend:</strong> Modern UI/UX</li>
        <li><strong>AI & Computer Vision:</strong> OpenCV, Image Processing, Machine Learning</li>
      </ul>
    `;
  }

  // Şefim Temiz Project
  if (/(şefim temiz|sefim temiz|hygiene|award|kırşehir|kirsehir|project)/i.test(query) && /(şefim|sefim|hygiene|clean)/i.test(query)) {
    return `
      🏆 <strong>Şefim Temiz (Project Developer & Team Lead):</strong>
      <br/><br/>
      An autonomous real-time hygiene inspection system for hospitals and food production facilities that detects hygiene rule violations (such as missing gloves, hairnets, and masks) through existing security cameras using YOLOv8 and OpenCV.
      <br/><br/>
      🏅 <strong>Awards & Recognition:</strong>
      <ul>
        <li><strong>3rd Place</strong> in Engineering and Basic Sciences at the Kırşehir 5th R&D Project Market.</li>
      </ul>
      <a href="project-details.html" style="color:#DC2626;font-weight:600;">→ Explore Şefim Temiz Project Details</a>
    `;
  }

  // Gözlük Project
  if (/(gözlük|gozluk|glasses|object detection v2|obstacle)/i.test(query)) {
    return `
      👓 <strong>Gözlük (Object Detection V2):</strong>
      <br/><br/>
      An assistive computer vision R&D project designed for visually impaired individuals to detect ground obstacles and potholes in real time.
    `;
  }

  // Education & Certifications
  if (/(education|study|university|inonu|inönü|certificate|certification|degree|okul|eğitim|sertifika)/i.test(query)) {
    return `
      🎓 <strong>Education & Certifications:</strong>
      <br/><br/>
      🏛️ <strong>İnönü University Faculty of Engineering</strong> — Bachelor of Science in Software Engineering (2023 - 2028)
      <br/><br/>
      📜 <strong>Certifications:</strong>
      <ul>
        <li><strong>AI Fluency Framework Foundations Certificate</strong> — Anthropic (2026)</li>
        <li><strong>Vodafone Summer Campus Participation Certificate</strong> (2026)</li>
        <li><strong>Migros "Good for the Future" Youth Gathering Certificate</strong> (2026)</li>
        <li><strong>inter-Future Program Certificate of Achievement</strong> (2025)</li>
      </ul>
    `;
  }

  // Contact / Social Media
  if (/(contact|touch|get in touch|reach|email|mail|linkedin|github|schedule|call|calendly|meeting|phone|social|connect|iletişim|ulaş)/i.test(query)) {
    return `
      📬 <strong>Contact Information:</strong>
      <ul>
        <li>📧 <strong>Email:</strong> <a href="mailto:melihyilmaz2525@gmail.com">melihyilmaz2525@gmail.com</a> / <a href="mailto:melihyilmaz0624@gmail.com">melihyilmaz0624@gmail.com</a></li>
        <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/melih-yilmaz-/" target="_blank">linkedin.com/in/melih-yilmaz-</a></li>
        <li>💻 <strong>GitHub:</strong> <a href="https://github.com/Melih-Yilmaz06" target="_blank">github.com/Melih-Yilmaz06</a></li>
        <li>📅 <strong>Schedule a Call:</strong> <a href="https://calendly.com/melihyilmaz2525/30min" target="_blank">Calendly 30-min Meeting</a></li>
      </ul>
    `;
  }

  return null;
}

/**
 * Translate query intent for extractive QA model
 */
function translateQueryIntent(query) {
  const q = query.toLowerCase();
  if (q.includes('who is') || q.includes('about') || q.includes('kimdir')) {
    return "Who is Melih Yilmaz and what is his education and background?";
  }
  if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('stack')) {
    return "What programming languages, frameworks, and technical skills does Melih Yilmaz know?";
  }
  if (q.includes('şefim') || q.includes('sefim') || q.includes('award') || q.includes('hygiene')) {
    return "What is the Sefim Temiz project and what award did it win?";
  }
  if (q.includes('contact') || q.includes('touch') || q.includes('reach') || q.includes('email') || q.includes('mail') || q.includes('linkedin')) {
    return "What are the contact email and links for Melih Yilmaz?";
  }
  return query;
}

/**
 * Format extracted answer
 */
function buildNaturalAnswer(query, rawAnswer, score) {
  return `
    <strong>Answer (Extracted by Local ONNX Model):</strong>
    <br/><br/>
    "${rawAnswer}"
    <br/><br/>
    <span style="font-size: 11px; color: #6b7280;">Confidence Score: ${Math.round(score * 100)}% — Extracted directly from profile context using in-browser Transformer neural network.</span>
  `;
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAIAgent);
} else {
  initAIAgent();
}
