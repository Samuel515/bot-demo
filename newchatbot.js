document.addEventListener('DOMContentLoaded', () => {
  // Function to dynamically load DOMPurify
  function loadDOMPurify() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load DOMPurify'));
      document.head.appendChild(script);
    });
  }

  // Load DOMPurify and initialize chatbot
  loadDOMPurify()
    .then(() => {
      if (typeof DOMPurify === 'undefined') {
        throw new Error('DOMPurify is not defined after loading');
      }
      initializeChatbot();
    })
    .catch((error) => {
      console.error('Error loading DOMPurify:', error);
      const errorMessage = document.createElement('div');
      errorMessage.style.position = 'fixed';
      errorMessage.style.bottom = '20px';
      errorMessage.style.right = '20px';
      errorMessage.style.backgroundColor = '#ffcccc';
      errorMessage.style.padding = '10px';
      errorMessage.style.borderRadius = '5px';
      errorMessage.textContent = 'Failed to load necessary resources. Chatbot cannot be initialized.';
      document.body.appendChild(errorMessage);
    });

  // Chatbot initialization function
  function initializeChatbot() {
    const config = {
      botName: "AI Assistant",
      themeColor: "#5a5a5a",
      botAvatar: "data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 32 32%22 fill%3D%22none%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath d%3D%22M25.3327 21.3334V18.6667C25.3327 14.8955 25.3327 13.0099 24.1611 11.8383C22.9895 10.6667 21.1039 10.6667 17.3327 10.6667H14.666C10.8948 10.6667 9.00916 10.6667 7.83759 11.8383C6.66602 13.0099 6.66602 14.8955 6.66602 18.6667V21.3334C6.66602 25.1046 6.66602 26.9902 7.83759 28.1618C9.00916 29.3334 10.8948 29.3334 14.666 29.3334H17.3327C21.1039 29.3334 22.9895 29.3334 24.1611 28.1618C25.3327 26.9902 25.3327 25.1046 25.3327 21.3334Z%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M25.334 24C27.2196 24 28.1624 24 28.7483 23.4143C29.334 22.8284 29.334 21.8856 29.334 20C29.334 18.1144 29.334 17.1716 28.7483 16.5857C28.1624 16 27.2196 16 25.334 16%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M6.66602 24C4.7804 24 3.83759 24 3.2518 23.4143C2.66602 22.8284 2.66602 21.8856 2.66602 20C2.66602 18.1144 2.66602 17.1716 3.2518 16.5857C3.83759 16 4.7804 16 6.66602 16%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M18 4.66675C18 5.77132 17.1045 6.66675 16 6.66675C14.8955 6.66675 14 5.77132 14 4.66675C14 3.56217 14.8955 2.66675 16 2.66675C17.1045 2.66675 18 3.56217 18 4.66675Z%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22%2F%3E%3Cpath d%3D%22M16 6.66675V10.6667%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M12 17.3333V18.6666%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M20 17.3333V18.6666%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%2F%3E%3Cpath d%3D%22M13.334 23.3333C13.334 23.3333 14.2229 23.9999 16.0007 23.9999C17.7784 23.9999 18.6673 23.3333 18.6673 23.3333%22 stroke%3D%22%23292929%22 stroke-width%3D%221.5%22 stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E",
      welcomeMessage: "Hi, how can I help you today?"
    };

    const scriptTag = document.querySelector('script[data-script-id][data-x-api-key]');
    if (!scriptTag) {
      console.error("Chatbot Error: Script tag not found.");
      return;
    }

    const scriptId = scriptTag.getAttribute('data-script-id');
    const xApiKey = scriptTag.getAttribute('data-x-api-key');
    const botName = scriptTag.getAttribute('data-bot-name');
    const llmProvider = scriptTag.getAttribute('data-llm-provider');

    if (!scriptId || !xApiKey) {
      console.error("Chatbot Error: Missing required data attributes (script-id or x-api-key).");
      return;
    }

    if (botName) config.botName = botName;
    if (llmProvider) config.llmProvider = llmProvider;
    if (typeof chatbotConfig !== "undefined") Object.assign(config, chatbotConfig);

    const style = document.createElement("style");
    style.textContent = `
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: 'Figtree', sans-serif;
      }
      .chatbot-window {
        position: absolute;
        bottom: 70px;
        right: 10px;
        width: calc(100% - 20px);
        min-width: 320px;
        max-width: 350px;
        height: 500px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.1) translateY(100px);
        transform-origin: bottom right;
        transition: all 0.3s ease-in-out;
        pointer-events: none;
      }
      @media (min-width: 768px) {
        .chatbot-window {
          width: 400px;
          max-width: 400px;
          min-width: 400px;
        }
      }
      .chatbot-window.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }
      .chatbot-header {
        background-color: #e9e9eb;
        color: #333;
        padding: 15px;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #ddd;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
      }
      .refresh-button {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }
      .refresh-button:hover {
        background-color: #ddd;
        transform: rotate(45deg);
      }
      .refresh-button svg {
        width: 20px;
        height: 20px;
        stroke: #666;
      }
      .initial-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 0px;
        gap: 15px;
        margin-bottom: 15px;
        color: #111;
      }
      .initial-message img {
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
      }
      .chatbot-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 0px;
        -webkit-overflow-scrolling: touch;
      }
      .message {
        max-width: 80%;
        min-width: 20%;
        padding: 10px 15px 15px 10px;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        font-size: 12px;
        word-break: break-word;
        position: relative;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .message.user {
        margin-left: auto;
        background-color: #333;
        color: #fff;
      }
      .message.bot {
        margin-right: auto;
        background-color: #f0f0f0;
        color: #333;
      }
      .message .timestamp {
        font-size: 0.7em;
        color: #777;
        position: absolute;
        bottom: 2px;
        right: 5px;
        white-space: nowrap;
      }
      .chatbot-input {
        padding: 8px;
        border-top: 1px solid #ddd;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      input {
        color: #111;
      }
      .chatbot-input input {
        flex: 1;
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        outline: none;
        color: #333;
        font-size: 14px;
      }
      .chatbot-input input:focus {
        border-color: #bbb;
      }
      .send-button {
        background-color: #333;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
      }
      .send-button:hover {
        background-color: #555;
      }
      .toggle-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${config.themeColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .toggle-button:hover {
        transform: scale(1.1);
      }
      .toggle-button svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
      .typing-indicator {
        display: flex;
        gap: 5px;
        padding: 8px 12px;
        background: #f0f0f0;
        border-radius: 15px;
        width: fit-content;
        margin-right: auto;
      }
      .typing-dot {
        width: 5px;
        height: 5px;
        background: #666;
        border-radius: 50%;
        animation: bounce 1s infinite;
      }
      .typing-dot:nth-child(2) { animation-delay: 0.3s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .powered-by {
        text-align: center;
        padding: 8px;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #ddd;
      }
      .powered-by a {
        color: #666;
        text-decoration: none;
        font-weight: bold;
      }
      .powered-by a:hover {
        text-decoration: underline;
      }
      .message.bot .section-header {
        font-weight: bold;
        margin-top: 10px;
      }
      .message.bot .bullet {
        margin-left: 20px;
        text-indent: -20px;
      }
      .message.bot .sub-bullet {
        margin-left: 40px;
        text-indent: -20px;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.className = "chatbot-container";

    const chatWindow = document.createElement("div");
    chatWindow.className = "chatbot-window";

    const header = document.createElement("div");
    header.className = "chatbot-header";

    const botInfo = document.createElement("div");
    botInfo.style.display = "flex";
    botInfo.style.alignItems = "center";
    botInfo.style.gap = "5px";
    botInfo.innerHTML = `<img style="width: 24px; height: 24px;" src="${config.botAvatar}"> ${config.botName}`;

    const refreshButton = document.createElement("button");
    refreshButton.className = "refresh-button";
    refreshButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
    `;

    header.appendChild(botInfo);
    header.appendChild(refreshButton);

    const messagesContainer = document.createElement("div");
    messagesContainer.className = "chatbot-messages";

    const initialMessage = document.createElement("div");
    initialMessage.className = "initial-message";
    initialMessage.innerHTML = `
      <img src="${config.botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; margin-bottom: 5px;">
      <span>${config.welcomeMessage}</span>`;

    messagesContainer.appendChild(initialMessage);

    const inputArea = document.createElement("div");
    inputArea.className = "chatbot-input";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Message";
    input.id = "chatbot-input-field";

    const sendButton = document.createElement("button");
    sendButton.className = "send-button";
    sendButton.textContent = "Send";

    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle-button";
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    const poweredBy = document.createElement("div");
    poweredBy.className = "powered-by";
    poweredBy.innerHTML = `Powered by <a href="https://nexusbotix.io" target="_blank">Nexus Botix</a>`;

    inputArea.appendChild(input);
    inputArea.appendChild(sendButton);

    chatWindow.appendChild(header);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputArea);
    chatWindow.appendChild(poweredBy);

    container.appendChild(chatWindow);
    container.appendChild(toggleButton);

    document.body.appendChild(container);

    let isOpen = false;
    const CHAT_HISTORY_KEY = "chatbotHistory";
    let isUserScrolledUp = false;
    let isTyping = false;

    function typeMessage(element, text, callback) {
      let charIndex = 0;
      element.innerHTML = '<span></span>';
      const spanElement = element.firstChild;
      isTyping = true;

      function typeText() {
        if (charIndex < text.length) {
          const char = text.charAt(charIndex);
          if (char === '\n') {
            spanElement.innerHTML += '<br>';
          } else {
            const escapedChar = char === '<' ? '<' : char === '>' ? '>' : char === '&' ? '&' : char;
            spanElement.innerHTML += escapedChar;
          }
          charIndex++;
          const typingSpeed = 20;
          if (!isUserScrolledUp && isTyping) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
          setTimeout(typeText, typingSpeed);
        } else {
          finalizeMessage(spanElement);
          isTyping = false;
          if (callback) callback();
          if (!isUserScrolledUp) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      }

      function finalizeMessage(span) {
        const lines = span.innerHTML.split('<br>');
        let formattedHtml = '';
        lines.forEach((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('•')) {
            formattedHtml += `<div class="bullet">${trimmedLine}</div>`;
          } else if (/^[📊🔧👤ℹ️]/.test(trimmedLine)) {
            formattedHtml += `<div class="section-header">${trimmedLine}</div>`;
          } else if (trimmedLine.startsWith('-')) {
            formattedHtml += `<div class="sub-bullet">${trimmedLine}</div>`;
          } else if (trimmedLine) {
            formattedHtml += `<div>${trimmedLine}</div>`;
          } else {
            formattedHtml += '<br>';
          }
        });
        span.innerHTML = formattedHtml;
      }

      typeText();
    }

    function loadChatHistory() {
      const history = localStorage.getItem(CHAT_HISTORY_KEY);
      if (history) {
        try {
          const parsedHistory = JSON.parse(history);
          parsedHistory.forEach((message) => {
            if (message.sender === "bot") {
              addMessage(message.text, message.sender, false);
            } else {
              addMessage(message.text, message.sender);
            }
          });
        } catch (error) {
          console.error("Error parsing chat history:", error);
          localStorage.removeItem(CHAT_HISTORY_KEY);
        }
      }
    }

    function clearChat() {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      messagesContainer.innerHTML = "";
      const newInitialMessage = document.createElement("div");
      newInitialMessage.className = "initial-message";
      newInitialMessage.innerHTML = `
        <img src="${config.botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; margin-bottom: 5px;">
        <span>${config.welcomeMessage}</span>`;
      messagesContainer.appendChild(newInitialMessage);
    }

    function addMessage(text, sender, animate = true) {
      const message = document.createElement("div");
      message.className = `message ${sender}`;

      const messageText = document.createElement("span");
      const timestamp = document.createElement("span");
      timestamp.className = "timestamp";
      timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      message.appendChild(messageText);
      message.appendChild(timestamp);
      messagesContainer.appendChild(message);

      if (!animate) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      if (sender === "bot" && animate) {
        messageText.innerHTML = "";
        typeMessage(messageText, text, () => {
          updateChatHistory(text, sender);
        });
      } else {
        messageText.innerHTML = text.replace(/\n/g, '<br>');
        updateChatHistory(text, sender);
      }

      if (window.innerWidth >= 768) {
        focusInput();
      }
    }

    function updateChatHistory(text, sender) {
      let chatHistory = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
      chatHistory.push({ text: text, sender: sender });
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }

    function showTypingIndicator() {
      const indicator = document.createElement("div");
      indicator.className = "typing-indicator";
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.className = "typing-dot";
        indicator.appendChild(dot);
      }
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return indicator;
    }

    async function handleSendMessage() {
      const text = input.value.trim();
      if (!text) return;

      let sanitizedText = text;
      if (typeof DOMPurify !== 'undefined') {
        sanitizedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
      }

      addMessage(sanitizedText, "user");
      input.value = "";

      const typingIndicator = showTypingIndicator();

      if (!scriptId || !xApiKey) {
        typingIndicator.remove();
        addMessage("Error: Chatbot is not properly configured.", "bot");
        return;
      }

      try {
        const llmProvider = config.llmProvider || "gemini";
        const response = await fetch(
          `https://api-nexusbotix-v2.vercel.app/api/ai-agent/query-agent2/${scriptId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": xApiKey,
            },
            body: JSON.stringify({
              query: sanitizedText,
              llm_provider: llmProvider,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        typingIndicator.remove();

        let botResponse;
        if (data && data.message) {
          botResponse = data.message;
        } else if (data && data.response && data.response.response) {
          botResponse = data.response.response;
        } else {
          addMessage("Sorry, I didn't get a response. Please check your internet connection and try again.", "bot");
          return;
        }

        if (botResponse) {
          addMessage(botResponse, "bot", true);
        } else {
          addMessage("Sorry, I didn't get a response.", "bot");
        }
      } catch (error) {
        console.error("API Error:", error);
        typingIndicator.remove();
        addMessage(`Sorry, I encountered an error: ${error.message}`, "bot");
      }
    }

    function focusInput() {
      const inputField = document.getElementById("chatbot-input-field");
      if (inputField) inputField.focus();
    }

    function preventBackgroundScroll(e) {
      e.stopPropagation();
    }

    messagesContainer.addEventListener('scroll', () => {
      const isAtBottom = Math.abs(messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight) < 1;
      isUserScrolledUp = !isAtBottom;
    });

    messagesContainer.addEventListener('wheel', preventBackgroundScroll, { passive: true });
    messagesContainer.addEventListener('touchmove', preventBackgroundScroll, { passive: true });

    toggleButton.addEventListener("click", () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle("open");
      toggleButton.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>`;
      if (window.innerWidth >= 768) focusInput();
    });

    refreshButton.addEventListener("click", clearChat);
    sendButton.addEventListener("click", handleSendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });

    loadChatHistory();
    if (window.innerWidth >= 768) focusInput();
  }
});