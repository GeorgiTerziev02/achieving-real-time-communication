import { addMessage, updateStatus } from './common.js';
let ws = null;
// Connect to WebSocket server
function connect() {
    updateStatus('connecting', 'Connecting to WebSocket server...');
    // Create WebSocket connection
    ws = new WebSocket(`ws://${window.location.host}`);
    // Connection opened
    ws.addEventListener('open', (event) => {
        updateStatus('connected', 'Connected to WebSocket server');
    });
    // Listen for messages
    ws.addEventListener('message', (event) => {
        try {
            const message = JSON.parse(event.data);
            addMessage(message, message.type === 'system' ? 'system' : 'received');
        }
        catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    });
    // Connection closed
    ws.addEventListener('close', (event) => {
        updateStatus('disconnected', 'Disconnected from WebSocket server');
        // Try to reconnect after 5 seconds
        setTimeout(connect, 5000);
    });
    // Connection error
    ws.addEventListener('error', (event) => {
        updateStatus('disconnected', 'Error connecting to WebSocket server');
    });
}
// Override the common sendMessage function
function sendMessage() {
    const content = document.getElementById('messageInput').value.trim();
    if (!content)
        return;
    const message = {
        type: 'message',
        content: content,
        timestamp: new Date().toISOString()
    };
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        addMessage(message, 'sent');
        document.getElementById('messageInput').value = '';
    }
    else {
        updateStatus('disconnected', 'Cannot send message: WebSocket is not connected');
    }
}
// Connect when the page loads
connect();
//# sourceMappingURL=websocket.js.map