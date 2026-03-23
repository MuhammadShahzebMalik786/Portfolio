document.addEventListener('DOMContentLoaded', function() {
    // Create chat widget HTML
    const chatHTML = `
        <button id="chat-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </button>
        <div id="chat-popup">
            <div class="chat-header">
                <h3>Let's Chat!</h3>
                <button id="chat-close">×</button>
            </div>
            <div class="chat-messages">
                <div class="message bot">Hi! How can I help you with your project today?</div>
            </div>
            <div class="chat-input">
                <input type="text" id="message-input" placeholder="Type your message...">
                <button id="send-btn">Send</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // Add event listeners
    const toggle = document.getElementById('chat-toggle');
    const popup = document.getElementById('chat-popup');
    const close = document.getElementById('chat-close');
    
    toggle.onclick = function() {
        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
    };
    
    close.onclick = function() {
        popup.style.display = 'none';
    };
});
