// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
});

// Initialize dark mode based on user preference
function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('sun-icon').classList.toggle('hidden', isDark);
    document.getElementById('moon-icon').classList.toggle('hidden', !isDark);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeIcons();
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    updateThemeIcons();
    
    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        updateThemeIcons();
    });
});

// Navigation functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const menuItems = document.getElementById('menu-items');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// Toggle mobile menu with animation
mobileMenuButton.addEventListener('click', () => {
    if (menuItems.classList.contains('hidden')) {
        menuItems.classList.remove('hidden');
        menuItems.classList.add('animate-slide-down');
    } else {
        menuItems.classList.add('hidden');
        menuItems.classList.remove('animate-slide-down');
    }
});

// Handle navigation with smooth transitions
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Hide mobile menu when a link is clicked
        if (window.innerWidth < 768) {
            menuItems.classList.add('hidden');
        }
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active', 'bg-primary-50', 'dark:bg-primary-900', 'dark:bg-opacity-30'));
        link.classList.add('active', 'bg-primary-50', 'dark:bg-primary-900', 'dark:bg-opacity-30');
        
        // Show corresponding section with animation
        const sectionId = link.getAttribute('data-section');
        
        contentSections.forEach(section => {
            if (section.classList.contains('active')) {
                section.style.opacity = 0;
                setTimeout(() => {
                    section.classList.remove('active');
                    
                    // Activate the new section
                    const newSection = document.getElementById(`${sectionId}-section`);
                    newSection.classList.add('active');
                    setTimeout(() => {
                        newSection.style.opacity = 1;
                        // Reinitialize AOS for the new section
                        AOS.refresh();
                    }, 50);
                }, 300);
            }
        });
        
        // If no section is currently active
        if (!document.querySelector('.content-section.active')) {
            const newSection = document.getElementById(`${sectionId}-section`);
            newSection.classList.add('active');
            setTimeout(() => {
                newSection.style.opacity = 1;
                AOS.refresh();
            }, 50);
        }
    });
});

// Chat functionality
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.querySelector('.messages-container');

// Conversation state
let conversationState = {
    stage: 'greeting',
    subject: null,
    level: null,
    area: null,
    knowledge: null,
    struggle: null
};

// Initial greeting
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addMessage('AI', 'Hello! I\'m your AI Tutor. Which subject would you like to study today?', [
            'Mathematics', 'Science'
        ]);
    }, 800);
});

// Add message to chat
function addMessage(sender, text, choices = null, links = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'w-full', 'my-3');
    
    if (sender === 'User') {
        messageDiv.classList.add('justify-end');
        messageDiv.innerHTML = `
            <div class="message-bubble user-message bg-user-bubble dark:bg-dark-user-bubble shadow-md">
                ${text}
            </div>
        `;
    } else {
        messageDiv.classList.add('justify-start');
        messageDiv.innerHTML = `
            <div class="message-bubble ai-message bg-ai-bubble dark:bg-dark-ai-bubble shadow-md">
                ${text}
                ${links ? `<div class="mt-3 suggestions-links">${links}</div>` : ''}
                ${choices ? `<div class="choice-buttons">${choices.map(choice => 
                    `<button class="choice-button bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 shadow-sm">${choice}</button>`
                ).join('')}</div>` : ''}
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add event listeners to choice buttons if present
    if (choices) {
        messageDiv.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', () => handleChoice(button.textContent));
        });
    }
}

// Show typing indicator
function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('flex', 'w-full', 'my-3', 'justify-start', 'typing-indicator-container');
    indicatorDiv.innerHTML = `
        <div class="message-bubble ai-message bg-ai-bubble dark:bg-dark-ai-bubble shadow-md typing-indicator flex justify-center items-center">
            <span></span><span></span><span></span>
        </div>
    `;
    messagesContainer.appendChild(indicatorDiv);
    scrollToBottom();
    return indicatorDiv;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator-container');
    if (indicator) {
        indicator.remove();
    }
}

// Handle choice button click
function handleChoice(choice) {
    addMessage('User', choice);
    
    setTimeout(() => {
        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            
            if (conversationState.stage === 'greeting') {
                conversationState.subject = choice;
                conversationState.stage = 'level';
                addMessage('AI', `Great! You've selected ${choice}. What is your education level?`, [
                    'Primary School', 'Secondary School'
                ]);
            } 
            else if (conversationState.stage === 'level') {
                conversationState.level = choice;
                conversationState.stage = 'area';
                
                let areaOptions = [];
                if (conversationState.subject === 'Mathematics' && choice === 'Primary School') {
                    areaOptions = ['Numbers & Operations', 'Basic Geometry', 'Fractions & Decimals', 'Measurements'];
                } 
                else if (conversationState.subject === 'Mathematics' && choice === 'Secondary School') {
                    areaOptions = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'];
                }
                else if (conversationState.subject === 'Science' && choice === 'Primary School') {
                    areaOptions = ['Plants & Animals', 'Earth & Space', 'Human Body', 'Simple Machines'];
                }
                else if (conversationState.subject === 'Science' && choice === 'Secondary School') {
                    areaOptions = ['Physics', 'Chemistry', 'Biology', 'Environmental Science'];
                }
                
                addMessage('AI', `What specific topic in ${conversationState.level} ${conversationState.subject} would you like help with?`, areaOptions);
            } 
            else if (conversationState.stage === 'area') {
                conversationState.area = choice;
                conversationState.stage = 'knowledge';
                addMessage('AI', `What do you already know about ${choice}?`, [
                    'Nothing yet', 'Basic concepts', 'Some understanding', 'Need advanced help'
                ]);
            } 
            else if (conversationState.stage === 'knowledge') {
                conversationState.knowledge = choice;
                conversationState.stage = 'struggle';
                addMessage('AI', `What do you struggle with the most in this topic?`, [
                    'Understanding concepts', 'Solving problems', 'Memorizing formulas', 'Applying knowledge'
                ]);
            } 
            else if (conversationState.stage === 'struggle') {
                conversationState.struggle = choice;
                conversationState.stage = 'resources';
                
                const subject = conversationState.subject;
                const level = conversationState.level;
                const area = conversationState.area;
                
                // Generate custom responses based on the selected subject and level
                let resourcesHTML = '';
                let studyOptions = [];
                
                const levelBadge = level.includes('Primary') ? 
                    '<span class="level-badge primary-badge">Primary</span>' : 
                    '<span class="level-badge secondary-badge">Secondary</span>';
                
                if (subject === 'Mathematics') {
                    resourcesHTML = `
                        <p class="mb-3">${levelBadge} Based on what you've told me, here are some resources to help you with ${area} in ${level} Mathematics:</p>
                        <ul class="space-y-2 ml-5">
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">${level} ${area} tutorial</a>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">Practice problems on ${area}</a>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">Step-by-step solutions for ${area}</a>
                            </li>
                        </ul>
                    `;
                    studyOptions = ['Take a quiz on ' + area, 'View practice problems', 'See step-by-step tutorials'];
                } 
                else if (subject === 'Science') {
                    resourcesHTML = `
                        <p class="mb-3">${levelBadge} Based on what you've told me, here are some resources to help you with ${area} in ${level} Science:</p>
                        <ul class="space-y-2 ml-5">
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">Illustrated guide to ${area}</a>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">Interactive experiments for ${level} ${area}</a>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a href="#" target="_blank">Key concepts in ${area}</a>
                            </li>
                        </ul>
                    `;
                    studyOptions = ['Interactive simulation', 'Study key concepts', 'Try a quiz'];
                }
                
                addMessage('AI', resourcesHTML, studyOptions);
            } 
            else if (conversationState.stage === 'resources') {
                conversationState.stage = 'interactive';
                
                if (choice.includes('quiz')) {
                    addMessage('AI', `Great! Let's start a quiz on ${conversationState.area} for ${conversationState.level} students. Here's your first question:`, [
                        'Start Quiz', 'Not right now'
                    ]);
                } 
                else if (choice.includes('problem') || choice.includes('exercise')) {
                    addMessage('AI', `Here are some practice problems for ${conversationState.area} at the ${conversationState.level} level. Would you like to try one?`, [
                        'Yes, show me a problem', 'Not right now'
                    ]);
                } 
                else {
                    addMessage('AI', `I can show you more detailed materials on ${conversationState.area} for ${conversationState.level} students. Would you like to see them?`, [
                        'Yes, show me', 'Let me try something else'
                    ]);
                }
            }
            else {
                // Default response for any other stages
                addMessage('AI', `Is there anything else you'd like to learn about ${conversationState.subject} for ${conversationState.level} students?`, [
                    'Yes, new topic', 'No, thank you'
                ]);
                conversationState.stage = 'greeting';
            }
        }, 1500); // Simulate AI thinking time
    }, 300);
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage('User', message);
        messageInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                
                if (conversationState.stage === 'greeting') {
                    conversationState.subject = message.toLowerCase().includes('math') ? 'Mathematics' : 'Science';
                    conversationState.stage = 'level';
                    addMessage('AI', `Let's talk about ${conversationState.subject}. What is your education level?`, [
                        'Primary School', 'Secondary School'
                    ]);
                } 
                else if (conversationState.stage === 'level') {
                    conversationState.level = message.toLowerCase().includes('primary') ? 'Primary School' : 'Secondary School';
                    conversationState.stage = 'area';
                    addMessage('AI', `What specific topic in ${conversationState.level} ${conversationState.subject} would you like help with?`);
                } 
                else if (conversationState.stage === 'area') {
                    conversationState.area = message;
                    conversationState.stage = 'knowledge';
                    addMessage('AI', `What do you already know about ${message}?`, [
                        'Nothing yet', 'Basic concepts', 'Some understanding', 'Need advanced help'
                    ]);
                } 
                else {
                    // For any other text input, provide a helpful response
                    addMessage('AI', `Thanks for sharing. I'll help you with your ${conversationState.subject} studies for ${conversationState.level}. Would you like some study materials or practice questions?`, [
                        'Study materials', 'Practice questions', 'Both'
                    ]);
                }
            }, 1500); // Simulate AI thinking time
        }, 300);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Scroll to bottom of messages
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}