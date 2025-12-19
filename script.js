/**
 * VoiceCart - Voice-Enabled Commerce Platform
 * Frontend Demo Application
 */

// ============================================
// Screen Navigation
// ============================================

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// Mobile Menu
// ============================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    }
});

// ============================================
// Theme Toggle (Dark Mode)
// ============================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('voicecart-theme', newTheme);

    // Show toast notification
    const themeLabel = newTheme === 'dark' ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️';
    showToast(themeLabel);
}

function initTheme() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('voicecart-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('voicecart-theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// Initialize theme before DOMContentLoaded to prevent flash
initTheme();

// ============================================
// Chat Interface
// ============================================

const demoResponses = [
    "I'd be happy to help with that! Let me check our menu for you.",
    "Great choice! I've added that to your order. Would you like anything else?",
    "Your order is being processed. Estimated delivery time is 25-30 minutes.",
    "I found several options for you. Would you like the regular or large size?",
    "Perfect! Your total comes to ₹850. Should I confirm the order?",
    "Order confirmed! You'll receive a notification when it's on the way."
];

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        addMessage(response, 'system');
    }, 1500);
}

function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    if (type === 'system') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.add('active');
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.remove('active');
}

// ============================================
// Voice Input (UI Demo Only)
// ============================================

let isMicActive = false;

function toggleMic() {
    const micBtn = document.getElementById('micBtn');
    isMicActive = !isMicActive;

    if (isMicActive) {
        micBtn.classList.add('active');

        // Simulate voice recording for demo
        setTimeout(() => {
            if (isMicActive) {
                toggleMic();
                // Add a demo voice message
                addMessage("Two chicken burgers and a large fries please", 'user');

                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    addMessage("Got it! 2 Chicken Burgers and 1 Large Fries. Your total is ₹450. Would you like to confirm?", 'system');
                }, 1500);
            }
        }, 3000);
    } else {
        micBtn.classList.remove('active');
    }
}

// ============================================
// Order Panel
// ============================================

function toggleOrderPanel() {
    const panel = document.getElementById('orderPanel');
    panel.classList.toggle('active');
}

function updateQty(btn, delta) {
    const qtyContainer = btn.parentElement;
    const qtySpan = qtyContainer.querySelector('span');
    let qty = parseInt(qtySpan.textContent);

    qty = Math.max(1, qty + delta);
    qtySpan.textContent = qty;

    // Add subtle animation
    qtySpan.style.transform = 'scale(1.2)';
    setTimeout(() => {
        qtySpan.style.transform = 'scale(1)';
    }, 150);
}

function confirmOrder() {
    const statusBadge = document.querySelector('.order-status');
    statusBadge.textContent = 'Confirmed';
    statusBadge.classList.remove('draft');
    statusBadge.classList.add('confirmed');

    showToast('Order confirmed successfully! 🎉');

    // Add confirmation message to chat
    setTimeout(() => {
        addMessage("Your order has been confirmed! Estimated delivery time is 25-30 minutes. Thank you for ordering! 🎉", 'system');
    }, 500);
}

// ============================================
// Seller Dashboard Actions
// ============================================

function acceptOrder(btn) {
    const card = btn.closest('.order-card');

    // Animate transition
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';

    setTimeout(() => {
        // Move to pending column
        const pendingColumn = document.querySelector('.dashboard-column:nth-child(2) .order-cards');
        card.classList.remove('new');
        card.classList.add('pending');
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';

        // Update card content for pending state
        const footer = card.querySelector('.order-card-footer');
        const actions = footer.querySelector('.order-actions');
        actions.innerHTML = '<button class="btn btn-complete" onclick="completeOrder(this)">Mark Complete</button>';

        // Add progress bar
        const progressDiv = document.createElement('div');
        progressDiv.className = 'order-progress';
        progressDiv.innerHTML = '<div class="progress-bar" style="width: 0%"></div>';
        card.appendChild(progressDiv);

        pendingColumn.prepend(card);

        // Animate progress bar
        setTimeout(() => {
            progressDiv.querySelector('.progress-bar').style.width = '30%';
        }, 300);

        updateOrderCounts();
        showToast('Order accepted!');
    }, 300);
}

function rejectOrder(btn) {
    const card = btn.closest('.order-card');

    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';

    setTimeout(() => {
        card.remove();
        updateOrderCounts();
        showToast('Order rejected');
    }, 300);
}

function completeOrder(btn) {
    const card = btn.closest('.order-card');

    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';

    setTimeout(() => {
        // Move to completed column
        const completedColumn = document.querySelector('.dashboard-column:nth-child(3) .order-cards');
        card.classList.remove('pending');
        card.classList.add('completed');
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';

        // Remove progress bar
        const progress = card.querySelector('.order-progress');
        if (progress) progress.remove();

        // Update card content for completed state
        const footer = card.querySelector('.order-card-footer');
        const actions = footer.querySelector('.order-actions');
        actions.outerHTML = `
            <span class="completed-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Delivered
            </span>
        `;

        completedColumn.prepend(card);
        updateOrderCounts();
        showToast('Order completed! 🎉');
    }, 300);
}

function updateOrderCounts() {
    const columns = document.querySelectorAll('.dashboard-column');

    columns.forEach(column => {
        const count = column.querySelectorAll('.order-card').length;
        const countBadge = column.querySelector('.order-count');
        countBadge.textContent = count;
    });
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ============================================
// Demo Mode
// ============================================

function showDemo() {
    showScreen('chat');

    // Clear existing messages
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '<div class="message-date">Today</div>';

    // Demo sequence
    const demoSequence = [
        { type: 'system', text: "Hi there! 👋 Welcome to VoiceCart. I'm here to help you place your order.", delay: 500 },
        { type: 'system', text: "You can type your order or tap the microphone to speak. What would you like today?", delay: 1500 },
        { type: 'user', text: "Can I get a large pepperoni pizza?", delay: 3000 },
        { type: 'system', text: "Absolutely! I've added 1 Large Pepperoni Pizza (₹450) to your order. Would you like to add any drinks or sides?", delay: 4500 },
        { type: 'user', text: "Add 2 cokes please", delay: 6500 },
        { type: 'system', text: "Done! Your order:", delay: 7500, hasOrder: true },
    ];

    demoSequence.forEach((item, index) => {
        setTimeout(() => {
            if (index > 0 && demoSequence[index - 1].type === 'user') {
                showTypingIndicator();
                setTimeout(() => {
                    hideTypingIndicator();
                    if (item.hasOrder) {
                        addDemoOrderMessage();
                    } else {
                        addMessage(item.text, item.type);
                    }
                }, 800);
            } else {
                addMessage(item.text, item.type);
            }
        }, item.delay);
    });
}

function addDemoOrderMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
        </div>
        <div class="message-content">
            <p>Perfect! Here's your order:</p>
            <div class="order-preview">
                <div class="order-preview-item">
                    <span>1× Pepperoni Pizza (Large)</span>
                    <span>₹450</span>
                </div>
                <div class="order-preview-item">
                    <span>2× Coca-Cola (500ml)</span>
                    <span>₹100</span>
                </div>
                <div class="order-preview-total">
                    <span>Total</span>
                    <span>₹550</span>
                </div>
            </div>
            <p>Would you like to confirm this order?</p>
            <span class="message-time">${time}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============================================
// Fleet Management
// ============================================

function filterDrivers(filter, btn) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    btn.classList.add('active');

    // Filter drivers
    const driverCards = document.querySelectorAll('.driver-card');
    driverCards.forEach(card => {
        const status = card.dataset.status;

        if (filter === 'all') {
            card.style.display = 'flex';
        } else if (filter === 'active' && status === 'active') {
            card.style.display = 'flex';
        } else if (filter === 'idle' && status === 'idle') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function viewDriverDetails(driverId) {
    showToast(`Viewing details for driver ${driverId}`);
}

function assignDriver(driverId) {
    showToast(`Assigning delivery to driver ${driverId}...`);

    // Find the driver card and update its status
    const driverCards = document.querySelectorAll('.driver-card');
    driverCards.forEach(card => {
        const avatar = card.querySelector('.driver-avatar span:first-child');
        if (avatar && avatar.textContent === driverId) {
            const statusDot = card.querySelector('.driver-status');
            const detail = card.querySelector('.driver-detail');
            const meta = card.querySelector('.driver-meta');

            // Update status
            statusDot.classList.remove('idle');
            statusDot.classList.add('online');
            card.dataset.status = 'active';

            // Update detail text
            detail.classList.remove('idle-text');
            detail.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                Picking up order...
            `;

            // Update meta
            meta.innerHTML = `
                <span class="delivery-eta">Assigned</span>
                <button class="btn-icon-sm" onclick="viewDriverDetails('${driverId}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            `;
        }
    });

    setTimeout(() => {
        showToast(`Driver ${driverId} is now on the way! 🚗`);
    }, 1500);
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Ensure landing page is shown by default
    showScreen('landing');

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add keyboard shortcut for sending messages
    document.addEventListener('keydown', (e) => {
        // If on chat screen and pressing Enter
        if (document.getElementById('chat').classList.contains('active')) {
            const input = document.getElementById('messageInput');
            if (document.activeElement === input && e.key === 'Enter') {
                sendMessage();
            }
        }
    });

    console.log('VoiceCart Demo initialized! 🎉');
});
