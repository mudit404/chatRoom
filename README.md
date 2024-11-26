# ChatRoom

A real-time chat application built using WebSocket. This application enables users to communicate seamlessly in a chat room by leveraging server-client WebSocket connections.

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.x or above)
- A modern web browser

### Installation Steps
1. Clone the repository to your local machine:
   ```bash
   git clone <repository_url>
   cd chatApp
2. Install the necessary dependencies:
   ```bash
    npm install
   
## Running the Application
### Starting the Server
1. Run the following command from the project directory:
   ```bash
    npm start
2. The server will start and listen on port `3000` by default. Open a terminal to confirm:
   ```bash
    Server is running on http://localhost:3000
### Accessing the Client
- Open your web browser and navigate to:
   ```bash
    http://localhost:3000
   
## Architecture Overview
### Application Structure
- server.js: Contains the WebSocket server logic for managing real-time communication.
- public: Holds static assets for the client, such as HTML, CSS, and JavaScript files.
- node_modules: Stores installed Node.js dependencies.
- package.json: Defines project metadata and dependencies.
  
### Concurrency Handling
This application uses WebSocket for handling multiple concurrent connections:

- The WebSocket Server (ws) listens for incoming connections from clients.
- Each client is assigned a unique socket connection.
- Messages sent by one client are broadcast to all connected clients, ensuring real-time communication.


## Design Choices
1. WebSocket over HTTP:
  - WebSocket was chosen for its low-latency, full-duplex communication capabilities, ideal for chat applications.

2. Broadcasting Messages:
  - Messages are broadcast to all active users in the chat room. No private messaging is implemented in this version.
    
3. Port Selection:
  - Default port 3000 is used. This can be modified in server.js if needed.
    
4. Static Client:
  - The client interface is served as static assets from the public folder.

## Snapshot:
<img width="1144" alt="Screenshot 2024-11-27 at 1 27 58 AM" src="https://github.com/user-attachments/assets/4695d0a4-4226-4e72-886f-94043b4c1051">

