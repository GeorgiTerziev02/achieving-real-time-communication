// DOM Elements
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const statusElement = document.getElementById('status');
// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
}
// Add message to the message area
export function addMessage(message, type = 'received') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    const contentElement = document.createElement('div');
    contentElement.textContent = message.content;
    const timestampElement = document.createElement('span');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = formatTimestamp(message.timestamp);
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timestampElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}
// Send message to server
export function sendMessage() {
    const content = messageInput.value.trim();
    if (!content)
        return;
    const message = {
        type: 'message',
        content: content,
        timestamp: new Date().toISOString()
    };
    // This will be overridden by each transport method
    console.warn('sendMessage function should be overridden by the transport method');
    messageInput.value = '';
}
// Update connection status
export function updateStatus(status, message) {
    statusElement.textContent = message;
    statusElement.className = 'status ' + status;
}
// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
//# sourceMappingURL=ui.js.map