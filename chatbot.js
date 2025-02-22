(() => {
    // Configuration object with default values
    const config = {
      botName: 'Nexus Bot',
      themeColor: '#007bff'
    };
  
    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 8px;
        z-index: 1000;
        font-family: Georgia, sans-serif;
      }
  
      .chatbot-window {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 400px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        transform-origin: bottom right;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        transform: scale(0.1) translateY(100px);
        pointer-events: none;
      }
  
      .chatbot-window.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: all;
      }
  
      .chatbot-header {
        padding: 15px;
        background-color: ${config.themeColor};
        color: white;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-weight: bold;
      }
  
      .chatbot-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
      }
  
      .message {
        margin-bottom: 20px;
        max-width: 80%;
      }
  
      .message.user {
        margin-left: auto;
        background-color: ${config.themeColor};
        color: white;
        padding: 8px 12px;
        border-radius: 15px 15px 0 15px;
      }
  
      .message.bot {
        margin-right: auto;
        background-color: #f0f0f0;
        color: #333;
        padding: 8px 12px;
        border-radius: 15px 15px 15px 0;
      }
  
      .chatbot-input {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }
  
      .chatbot-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
      }
  
      .chatbot-input input:focus {
        border-color: ${config.themeColor};
      }
  
      .send-button {
        background-color: ${config.themeColor};
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }
  
      .send-button:hover {
        transform: scale(1.1);
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
      }
  
      .typing-dot {
        width: 8px;
        height: 8px;
        background: #666;
        border-radius: 50%;
        animation: bounce 1s infinite;
      }
  
      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
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
        border-top: 1px solid #eee;
      }
    `;
    document.head.appendChild(style);
  
    // Create HTML structure
    const container = document.createElement('div');
    container.className = 'chatbot-container';
  
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chatbot-window';
  
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.textContent = config.botName;
  
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chatbot-messages';
  
    const inputArea = document.createElement('div');
    inputArea.className = 'chatbot-input';
  
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
  
    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
  
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
  
    const poweredBy = document.createElement('div');
    poweredBy.className = 'powered-by';
    poweredBy.textContent = 'Powered by Nexus Botix';
  
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
  
    function addMessage(text, sender) {
      const message = document.createElement('div');
      message.className = `message ${sender}`;
      message.textContent = text;
      messagesContainer.appendChild(message);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    function showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
      }
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return indicator;
    }
  
    async function handleSendMessage() {
      const text = input.value.trim();
      if (!text) return;
  
      // Add user message
      addMessage(text, 'user');
      input.value = '';
  
      // Show typing indicator
      const typingIndicator = showTypingIndicator();
  
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        typingIndicator.remove();
        addMessage('This is a sample response.', 'bot');
      } catch (error) {
        console.error('Error:', error);
        typingIndicator.remove();
        addMessage('Sorry, I encountered an error.', 'bot');
      }
    }
  
    // Event listeners
    toggleButton.addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open');
      toggleButton.innerHTML = isOpen 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    });
  
    sendButton.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
  
    // Initial greeting
    addMessage(`Hello! I'm ${config.botName}. How can I help you?`, 'bot');
  })();