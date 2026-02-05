/**
 * OpenHouse ICC Chatbot - Chat Logic
 * Modern UI with SSE streaming
 */

// State
let messageHistory = [];
let isStreaming = false;

// DOM Elements
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const welcomeMessage = document.getElementById('welcomeMessage');
const suggestions = document.getElementById('suggestions');

/**
 * Send message from input field
 */
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isStreaming) return;

    messageInput.value = '';
    processMessage(message);
}

/**
 * Send a suggestion
 */
function sendSuggestion(text) {
    if (isStreaming) return;
    processMessage(text);
}

/**
 * Handle Enter key
 */
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

/**
 * Process and send message
 */
async function processMessage(text) {
    // Hide welcome on first message
    if (welcomeMessage && messageHistory.length === 0) {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            welcomeMessage.style.display = 'none';
        }, 300);
    }

    // Hide suggestions after a few messages
    if (suggestions && messageHistory.length >= 2) {
        suggestions.style.opacity = '0';
        suggestions.style.transform = 'translateY(10px)';
        setTimeout(() => {
            suggestions.style.display = 'none';
        }, 300);
    }

    // Add user message to UI
    addMessageToUI(text, 'user');

    // Add to history
    messageHistory.push({ role: 'user', content: text });

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    // Disable input
    setInputState(false);

    try {
        await streamResponse(typingIndicator);
    } catch (error) {
        console.error('Error:', error);
        removeElement(typingIndicator);
        addMessageToUI('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.', 'assistant');
    }

    // Re-enable input
    setInputState(true);
    messageInput.focus();
}

/**
 * Stream response from server
 */
async function streamResponse(typingIndicator) {
    isStreaming = true;
    let assistantMessage = '';
    let messageElement = null;
    let typingRemoved = false;

    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messageHistory }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);

                if (data === '[DONE]') {
                    if (assistantMessage) {
                        messageHistory.push({ role: 'assistant', content: assistantMessage });
                    }
                    isStreaming = false;
                    return;
                }

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                        // Remove typing indicator on first content
                        if (!typingRemoved) {
                            removeElement(typingIndicator);
                            typingRemoved = true;
                        }

                        assistantMessage += parsed.content;

                        if (!messageElement) {
                            messageElement = createAssistantMessageElement();
                        }

                        // Render markdown
                        messageElement.innerHTML = marked.parse(assistantMessage);
                        scrollToBottom();
                    }
                } catch (e) {
                    // Ignore parse errors for partial chunks
                }
            }
        }
    }

    // Save message if not done
    if (assistantMessage && !messageHistory.some(m => m.content === assistantMessage)) {
        messageHistory.push({ role: 'assistant', content: assistantMessage });
    }

    isStreaming = false;
}

/**
 * Add message to chat UI
 */
function addMessageToUI(text, role) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message message-enter`;

    if (role === 'user') {
        // User messages: plain text with icon
        messageDiv.innerHTML = `
            <div class="flex items-start gap-2">
                <span>${escapeHtml(text)}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = marked.parse(text);
    }

    wrapper.appendChild(messageDiv);
    chatBox.appendChild(wrapper);
    scrollToBottom();

    return messageDiv;
}

/**
 * Create empty assistant message for streaming
 */
function createAssistantMessageElement() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-start';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message message-enter';

    wrapper.appendChild(messageDiv);
    chatBox.appendChild(wrapper);

    return messageDiv;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-start';
    wrapper.id = 'typing-wrapper';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <span class="typing-text">Pensando...</span>
    `;

    wrapper.appendChild(indicator);
    chatBox.appendChild(wrapper);
    scrollToBottom();

    return wrapper;
}

/**
 * Remove element with animation
 */
function removeElement(element) {
    if (element && element.parentNode) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        setTimeout(() => element.remove(), 200);
    }
}

/**
 * Set input state
 */
function setInputState(enabled) {
    messageInput.disabled = !enabled;
    sendButton.disabled = !enabled;

    if (!enabled) {
        sendButton.classList.add('opacity-50');
    } else {
        sendButton.classList.remove('opacity-50');
    }
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });
}

/**
 * Escape HTML for security
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add transition styles dynamically
const style = document.createElement('style');
style.textContent = `
    #welcomeMessage, #suggestions {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);
