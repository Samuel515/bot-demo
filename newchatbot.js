(() => {
  // Configuration object with default values
  const config = {
    botName: "AI Assistant",
    themeColor: "#5a5a5a",
    botAvatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-bot'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E",
    welcomeMessage: "Hi, how can I help you today?",
  };

  // Override default config with values from global chatbotConfig (if defined)
  if (typeof chatbotConfig !== "undefined") {
    Object.assign(config, chatbotConfig);
  }

  const scriptTag = document.querySelector('script[src="https://widget.nexusbotix.com/nexus-embeded.min.js"]');
  const scriptId = scriptTag?.getAttribute('data-script-id');
  const xApiKey = scriptTag?.getAttribute('data-x-api-key');

  if (!scriptId || !xApiKey) {
    console.error("Chatbot Error: Missing required data attributes in script tag.");
  }

  // Create and inject CSS
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
        width: 350px;
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

    input{
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
  `;

  // Load Figtree font
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Figtree:wght@400;600&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  document.head.appendChild(style);

  // Create HTML structure
  const container = document.createElement("div");
  container.className = "chatbot-container";

  const chatWindow = document.createElement("div");
  chatWindow.className = "chatbot-window";

  const header = document.createElement("div");
  header.className = "chatbot-header";

  // Add bot name and avatar
  const botInfo = document.createElement("div");
  botInfo.style.display = "flex";
  botInfo.style.alignItems = "center";
  botInfo.style.gap = "5px";
  botInfo.innerHTML = `<img style="width: 24px; height: 24px;" src="${config.botAvatar}"> ${config.botName}`;

  // Add refresh button
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

  // Create initial message element
  const initialMessage = document.createElement("div");
  initialMessage.className = "initial-message";
  initialMessage.innerHTML = `
      <img src="${config.botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; margin-bottom: 5px;">
      <span>${config.welcomeMessage}</span>`;

  // Add initial message to messages container
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

  // Assemble the components
  inputArea.appendChild(input);
  inputArea.appendChild(sendButton);

  chatWindow.appendChild(header);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputArea);
  chatWindow.appendChild(poweredBy);

  container.appendChild(chatWindow);
  container.appendChild(toggleButton);

  document.body.appendChild(container);

  // Chat functionality
  let isOpen = false;
  const CHAT_HISTORY_KEY = "chatbotHistory";

  // Load Marked.js
  const markedScript = document.createElement("script");
  markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  markedScript.onload = () => {
    function loadChatHistory() {
      const history = localStorage.getItem(CHAT_HISTORY_KEY);
      if (history) {
        try {
          const parsedHistory = JSON.parse(history);
          parsedHistory.forEach((message) => {
            addMessage(message.text, message.sender);
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
      // Re-add the initial message
      const newInitialMessage = document.createElement("div");
      newInitialMessage.className = "initial-message";
      newInitialMessage.innerHTML = `
              <img src="${config.botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; margin-bottom: 5px;">
              <span>${config.welcomeMessage}</span>`;
      messagesContainer.appendChild(newInitialMessage);
    }

    function addMessage(text, sender) {
      const message = document.createElement("div");
      message.className = `message ${sender}`;

      const messageText = document.createElement("span");
      messageText.innerHTML = text;

      const timestamp = document.createElement("span");
      timestamp.className = "timestamp";
      timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      message.appendChild(messageText);
      message.appendChild(timestamp);

      messagesContainer.appendChild(message);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Store the message in local storage
      const newMessage = {
        text: text,
        sender: sender,
      };

      let chatHistory =
        JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
      chatHistory.push(newMessage);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));

      if (window.innerWidth >= 768) {
        focusInput();
      }
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

      addMessage(text, "user");
      input.value = "";

      const typingIndicator = showTypingIndicator();

      // Check configuration early
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
              query: text,
              llm_provider: llmProvider,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        typingIndicator.remove();

        let botResponseMarkdown;

        if (data && data.message) {
          botResponseMarkdown = data.message;
        } else if (data && data.response && data.response.response) {
          botResponseMarkdown = data.response.response;
        } else {
          addMessage("Sorry, I didn't get a response. Please check your internet connection and try again.", "bot");
          return;
        }

        if (botResponseMarkdown) {
          const botResponseHTML = marked.parse(botResponseMarkdown);
          addMessage(botResponseHTML, "bot");
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
      if (inputField) {
        inputField.focus();
      }
    }

    // Event listeners
    toggleButton.addEventListener("click", () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle("open");
      toggleButton.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      if (window.innerWidth >= 768) {
        focusInput();
      }
    });

    refreshButton.addEventListener("click", clearChat);
    sendButton.addEventListener("click", handleSendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    });

    loadChatHistory();
    if (window.innerWidth >= 768) {
      focusInput();
    }
  };

  document.head.appendChild(markedScript);
})();