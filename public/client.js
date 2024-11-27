class ChatClient {
    constructor() {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        this.ws = new WebSocket(`${protocol}://${window.location.host}`);
        this.messageContainer = document.getElementById('messageContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.setupEventListeners();
        this.setupWebSocket();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    setupWebSocket() {
        this.ws.onopen = () => {
            this.displaySystemMessage('Connected to chat server');
            this.sendButton.disabled = false;
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.displayMessage(message);
        };

        this.ws.onclose = () => {
            this.displaySystemMessage('Disconnected from server');
            this.sendButton.disabled = true;
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.displaySystemMessage('Connection error');
        };
    }

    sendMessage() {
        const content = this.messageInput.value.trim();
        if (content && this.ws.readyState === WebSocket.OPEN) {
            const message = {
                content: content
            };
            this.ws.send(JSON.stringify(message));
            this.displayMessage({
                type: 'message',
                sender: 'You',
                content: content,
                timestamp: new Date().toISOString()
            }, true);
            this.messageInput.value = '';
        }
    }

    displayMessage(message, isSent = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type === 'system' ? 'system' : (isSent ? 'sent' : 'received')}`;

        if (message.type !== 'system') {
            const sender = document.createElement('div');
            sender.className = 'sender';
            sender.textContent = message.sender;
            messageDiv.appendChild(sender);
        }

        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = message.content;
        messageDiv.appendChild(content);

        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date(message.timestamp).toLocaleTimeString();
        messageDiv.appendChild(timestamp);

        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    displaySystemMessage(content) {
        this.displayMessage({
            type: 'system',
            content: content,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize chat client when the page loads
window.addEventListener('load', () => {
    new ChatClient();
});