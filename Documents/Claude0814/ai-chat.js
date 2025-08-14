class AIChat {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatInterface();
        this.bindEvents();
    }

    createChatInterface() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'ai-chat-container';
        chatContainer.innerHTML = `
            <div class="ai-chat-toggle" id="aiChatToggle">
                <div class="ai-chat-icon">🤖</div>
                <div class="ai-chat-label">AI Assistant</div>
            </div>
            
            <div class="ai-chat-window" id="aiChatWindow">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <div class="ai-avatar">🤖</div>
                        <span data-i18n="aiAssistant">AI Assistant</span>
                    </div>
                    <button class="ai-chat-close" id="aiChatClose">&times;</button>
                </div>
                
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message ai-message-bot">
                        <div class="ai-message-avatar">🤖</div>
                        <div class="ai-message-content">
                            <div class="ai-message-text">
                                안녕하세요! AI 혁신에 대해 무엇이든 물어보세요. 
                                Hello! Ask me anything about AI innovation.
                            </div>
                            <div class="ai-message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="ai-chat-input-container">
                    <div class="ai-chat-input-wrapper">
                        <input type="text" 
                               class="ai-chat-input" 
                               id="aiChatInput" 
                               data-i18n-placeholder="askQuestion"
                               placeholder="Ask me anything about AI innovation...">
                        <button class="ai-chat-send" id="aiChatSend">
                            <span data-i18n="send">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatContainer);
    }

    bindEvents() {
        const toggle = document.getElementById('aiChatToggle');
        const close = document.getElementById('aiChatClose');
        const input = document.getElementById('aiChatInput');
        const send = document.getElementById('aiChatSend');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        send.addEventListener('click', () => this.sendMessage());
    }

    toggleChat() {
        const window = document.getElementById('aiChatWindow');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const window = document.getElementById('aiChatWindow');
        window.classList.add('ai-chat-open');
        this.isOpen = true;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('aiChatInput').focus();
        }, 300);
    }

    closeChat() {
        const window = document.getElementById('aiChatWindow');
        window.classList.remove('ai-chat-open');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Simulate AI response
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(this.generateAIResponse(message), 'bot');
        }, 1500 + Math.random() * 2000);
    }

    addMessage(text, sender) {
        const messages = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = this.getCurrentTime();
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">${avatar}</div>
            <div class="ai-message-content">
                <div class="ai-message-text">${text}</div>
                <div class="ai-message-time">${time}</div>
            </div>
        `;
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    showTyping() {
        this.isTyping = true;
        const messages = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-message-bot ai-typing';
        typingDiv.id = 'aiTyping';
        
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="ai-message-text">
                    <span data-i18n="thinking">Thinking</span>
                    <span class="typing-dots">...</span>
                </div>
            </div>
        `;
        
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    hideTyping() {
        this.isTyping = false;
        const typing = document.getElementById('aiTyping');
        if (typing) typing.remove();
    }

    generateAIResponse(userMessage) {
        const responses = {
            'ai': 'AI는 인공지능의 줄임말로, 기계가 인간의 지능을 모방하여 학습하고 문제를 해결할 수 있도록 하는 기술입니다.',
            'machine learning': '머신러닝은 AI의 한 분야로, 데이터로부터 패턴을 학습하여 예측이나 분류를 수행하는 기술입니다.',
            'deep learning': '딥러닝은 머신러닝의 하위 분야로, 인공신경망을 사용하여 복잡한 패턴을 학습합니다.',
            'innovation': '혁신은 새로운 아이디어나 방법을 통해 기존 문제를 해결하거나 새로운 가치를 창출하는 과정입니다.',
            'challenge': '챌린지는 도전을 의미하며, AI 혁신 챌린지에서는 참가자들이 창의적인 AI 솔루션을 개발하도록 장려합니다.',
            'competition': '대회는 참가자들이 자신의 기술과 창의성을 보여줄 수 있는 플랫폼입니다.',
            'project': '프로젝트는 특정 목표를 달성하기 위한 계획된 작업으로, AI 혁신 프로젝트는 실제 문제를 해결하는 AI 솔루션을 개발하는 것입니다.',
            'technology': '기술은 과학적 지식을 실제 문제 해결에 적용하는 방법으로, AI 기술은 다양한 분야에서 혁신을 가져올 수 있습니다.',
            'future': '미래는 AI 기술의 발전과 함께 더욱 스마트하고 효율적인 세상이 될 것입니다.',
            'development': '개발은 소프트웨어나 시스템을 만드는 과정으로, AI 개발은 지능형 시스템을 구축하는 것을 의미합니다.'
        };

        const lowerMessage = userMessage.toLowerCase();
        
        // Check for specific keywords
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        // Default responses
        const defaultResponses = [
            'AI 혁신에 대한 흥미로운 질문이네요! 더 구체적으로 설명해주시면 더 자세한 답변을 드릴 수 있습니다.',
            '좋은 질문입니다! AI 기술은 계속 발전하고 있으며, 여러분의 아이디어가 다음 혁신을 이끌 수 있습니다.',
            'AI 혁신은 다양한 분야에서 가능합니다. 어떤 특정 분야에 관심이 있으신가요?',
            '혁신적인 아이디어는 작은 것에서 시작됩니다. AI를 활용한 창의적인 솔루션을 생각해보세요!',
            'AI 기술의 발전은 우리의 삶을 더욱 편리하고 효율적으로 만들 것입니다.'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Update language
    updateLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (locales[currentLang] && locales[currentLang][key]) {
                element.textContent = locales[currentLang][key];
            }
        });

        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            if (locales[currentLang] && locales[currentLang][key]) {
                input.placeholder = locales[currentLang][key];
            }
        });
    }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIChat();
});
