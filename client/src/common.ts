// Types
export interface Message {
  type: string;
  content: string;
  timestamp: string;
}

// DOM Elements
const messageArea = document.getElementById('messageArea') as HTMLDivElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
const statusElement = document.getElementById('status') as HTMLDivElement;

// Format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

// Add message to the message area
export function addMessage(message: Message, type: 'received' | 'sent' | 'system' = 'received'): void {
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
export function sendMessage(): void {
  const content = messageInput.value.trim();
  if (!content) return;
  
  const message: Message = {
    type: 'message',
    content: content,
    timestamp: new Date().toISOString()
  };
  
  // This will be overridden by each transport method
  console.warn('sendMessage function should be overridden by the transport method');
  
  messageInput.value = '';
}

// Update connection status
export function updateStatus(status: 'connected' | 'disconnected' | 'connecting', message: string): void {
  statusElement.textContent = message;
  statusElement.className = 'status ' + status;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
}); 