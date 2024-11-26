const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

class ChatServer {
    constructor(port) {
        this.port = port;
        this.clients = new Map();
        this.clientCounter = 0;
        this.setupServer();
    }

    setupServer() {
        // Create HTTP server for serving the static files
        this.httpServer = http.createServer((req, res) => {
            let filePath = '';
            let contentType = '';

            switch (req.url) {
                case '/':
                    filePath = path.join(__dirname, 'public', 'index.html');
                    contentType = 'text/html';
                    break;
                case '/styles.css':
                    filePath = path.join(__dirname, 'public', 'styles.css');
                    contentType = 'text/css';
                    break;
                case '/client.js':
                    filePath = path.join(__dirname, 'public', 'client.js');
                    contentType = 'text/javascript';
                    break;
                default:
                    res.writeHead(404);
                    res.end('Not found');
                    return;
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading ${req.url}`);
                    return;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });

        // Create WebSocket server
        this.wss = new WebSocket.Server({ server: this.httpServer });
        this.setupWebSocketServer();
    }

    setupWebSocketServer() {
        this.wss.on('connection', (ws) => {
            const clientId = ++this.clientCounter;
            this.clients.set(clientId, ws);

            // Welcome message
            const welcomeMsg = {
                type: 'system',
                content: `Welcome! You are client #${clientId}`,
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(welcomeMsg));

            // Broadcast join message
            this.broadcast(clientId, {
                type: 'system',
                content: `Client ${clientId} has joined the chat`,
                timestamp: new Date().toISOString()
            });

            ws.on('message', (message) => {
                try {
                    const parsedMessage = JSON.parse(message);
                    this.broadcast(clientId, {
                        type: 'message',
                        sender: `Client ${clientId}`,
                        content: parsedMessage.content,
                        timestamp: new Date().toISOString()
                    });
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            });

            ws.on('close', () => {
                this.handleDisconnection(clientId);
            });

            ws.on('error', (error) => {
                console.error(`Client ${clientId} error:`, error);
                this.handleDisconnection(clientId);
            });
        });
    }

    handleDisconnection(clientId) {
        this.clients.delete(clientId);
        this.broadcast(clientId, {
            type: 'system',
            content: `Client ${clientId} has left the chat`,
            timestamp: new Date().toISOString()
        });
    }

    broadcast(senderId, message) {
        this.clients.forEach((ws, clientId) => {
            if (clientId !== senderId && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}

// Start the server
const server = new ChatServer(3000);
server.start();