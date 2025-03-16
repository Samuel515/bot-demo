(() => {
    // Configuration object with default values

    const config = {
      botName: 'AI Assistant',
      themeColor: '#5a5a5a',
      botAvatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-bot'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"
  };

  // Override default config with values from global chatbotConfig (if defined)
  if (typeof chatbotConfig !== 'undefined') {
      Object.assign(config, chatbotConfig);
  }

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: 'Figtree', sans-serif; /* Changed Font Family */
      }

      .chatbot-window {
        position: absolute;
        bottom: 70px;
        right: 10px;
        width: 350px;
        height: 550px;
        background: #fff;
        border-radius: 15px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0; /* Initially hidden */
        transform: scale(0.1) translateY(100px);
        transform-origin: bottom right;
        transition: all 0.3s ease-in-out;
        pointer-events: none; /* Initially not interactable */
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
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative; /* For absolute positioning of image */
      }

        /* Styling for the initial bot message/image */
        .initial-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 0px;
            gap: 15px;
            margin-bottom: 15px;
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
        margin-top: 0px; /* Adjusted to move messages down */
      }

      .message {
        max-width: 80%; /* But no more than 80% */
        padding: 10px 15px; /* Increased Padding */
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        word-break: break-word;
        position: relative;
        margin-bottom: 20px; /* Added margin bottom */
        display: flex; /* To align timestamp */
        align-items: baseline; /* Align items on the baseline */
        flex-wrap: wrap; /* Allow content to wrap */
        gap: 5px;
      }

      .message.user {
        margin-left: auto;
        background-color: #333;
        color: #fff;
        justify-content: flex-end; /* Align to the right */
      }

      .message.bot {
        margin-right: auto;
        background-color: #f0f0f0;
        color: #333;
        justify-content: flex-start; /* Align to the left */
      }

      .message .timestamp {
        font-size: 0.7em;
        margin-top: auto;
        color: #777;
        margin-left: auto;
        white-space: nowrap;
      }

      .chatbot-input {
        padding: 10px;
        border-top: 1px solid #ddd;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .chatbot-input input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        outline: none;
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
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
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
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;600&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);

    document.head.appendChild(style);

    // Create HTML structure
    const container = document.createElement('div');
    container.className = 'chatbot-container';

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chatbot-window';

    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `<img style="width: 24px; height: 24px; margin-right: 5px;" src="${config.botAvatar}"> ${config.botName}`;

    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chatbot-messages';

    const inputArea = document.createElement('div');
    inputArea.className = 'chatbot-input';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Message';
    input.id = 'chatbot-input-field'; //Add ID to the input

    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.textContent = 'Send';


    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    const poweredBy = document.createElement('div');
    poweredBy.className = 'powered-by';
    poweredBy.innerHTML = `Powered by <a href="https://nexus-botix.com" target="_blank">Nexus Botix</a>`;

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

        const messageText = document.createElement('span');
        messageText.textContent = text;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        message.appendChild(messageText);
        message.appendChild(timestamp);

        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        if (window.innerWidth >= 768) { // Check screen size
            focusInput();
        }
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

        addMessage(text, 'user');
        input.value = '';

        const typingIndicator = showTypingIndicator();

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            typingIndicator.remove();
            let botResponse = '';
            if (text.toLowerCase() === 'hello' || text.toLowerCase() === 'hi') {
                botResponse = 'Hi there! Welcome to London Cookie Company. How can I assist you today? You can ask me about our products, store locations, or even place an order!';
            } else if (text.toLowerCase() === 'what is your return policy?') {
                botResponse = 'We accept returns within 30 days of purchase as long as the item is unopened. For more details, visit our Return Policy page.';
            } else {
                botResponse = 'This is a sample response. lorem ipsum dolor sit amet.';
            }
            addMessage(botResponse, 'bot');
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessage('Sorry, I encountered an error.', 'bot');
        }
    }

    function focusInput() {
      const inputField = document.getElementById('chatbot-input-field');
      if (inputField) {
        inputField.focus();
      }
    }

    // Event listeners
    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('open');
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

    sendButton.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Create initial message element
    const initialMessage = document.createElement('div');
    initialMessage.className = 'initial-message'; // Removed message and bot classes
    initialMessage.innerHTML = `
        <img src="${config.botAvatar}" alt="Bot Avatar" style="width: 50px; height: 50px; margin-bottom: 5px;">
        <span>Hi, how can I help you today?</span>`;

    // Move initial message inside the messages container
    messagesContainer.appendChild(initialMessage);

    if (window.innerWidth >= 768) {
        focusInput();
    }

})();