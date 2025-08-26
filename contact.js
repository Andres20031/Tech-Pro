// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeChatWidget();
    initializeMap();
    initializeAnimations();
});

// Contact Form Functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('form-success');
    const messageTextarea = document.getElementById('message');
    const charCounter = document.getElementById('char-count');
    
    if (!form) return;

    // Character counter for message
    if (messageTextarea && charCounter) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count;
            
            if (count > 1000) {
                charCounter.style.color = '#ff3b30';
                this.value = this.value.substring(0, 1000);
                charCounter.textContent = '1000';
            } else {
                charCounter.style.color = '#86868b';
            }
        });
    }

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const errors = validateForm(formData);
        
        // Clear previous errors
        clearFormErrors();
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Submit form
        submitForm(formData);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(formData) {
    const errors = [];
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            errors.push({
                field: field,
                message: 'Este campo es obligatorio'
            });
        }
    });
    
    // Email validation
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Por favor ingresa un email válido'
        });
    }
    
    // Phone validation (if provided)
    const phone = formData.get('phone');
    if (phone && !isValidPhone(phone)) {
        errors.push({
            field: 'phone',
            message: 'Por favor ingresa un teléfono válido'
        });
    }
    
    // Message length validation
    const message = formData.get('message');
    if (message && message.length < 10) {
        errors.push({
            field: 'message',
            message: 'El mensaje debe tener al menos 10 caracteres'
        });
    }
    
    // Privacy policy validation
    if (!formData.get('privacy')) {
        errors.push({
            field: 'privacy',
            message: 'Debes aceptar la política de privacidad'
        });
    }
    
    return errors;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    // Required field check
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message', 'privacy'];
    if (requiredFields.includes(fieldName) && !value) {
        isValid = false;
        message = 'Este campo es obligatorio';
    }
    
    // Specific validations
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                message = 'Por favor ingresa un email válido';
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                message = 'Por favor ingresa un teléfono válido';
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                isValid = false;
                message = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    // Update field appearance
    const errorElement = field.parentElement.querySelector('.error-message');
    if (isValid) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    } else {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    return isValid;
}

function showFormErrors(errors) {
    errors.forEach(error => {
        const field = document.querySelector(`[name="${error.field}"]`);
        if (field) {
            field.classList.add('error');
            const errorElement = field.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = error.message;
                errorElement.classList.add('show');
            }
        }
    });
}

function clearFormErrors() {
    const errorFields = document.querySelectorAll('.error');
    const errorMessages = document.querySelectorAll('.error-message.show');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => {
        message.classList.remove('show');
        message.textContent = '';
    });
}

function submitForm(formData) {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Send confirmation email simulation
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Reset form after delay
        setTimeout(() => {
            form.style.display = 'block';
            successMessage.style.display = 'none';
            form.reset();
            clearFormErrors();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Reset character counter
            const charCounter = document.getElementById('char-count');
            if (charCounter) charCounter.textContent = '0';
        }, 5000);
        
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Chat Widget Functionality
function initializeChatWidget() {
    const chatButton = document.getElementById('start-chat');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!chatButton || !chatWidget) return;
    
    // Open chat
    chatButton.addEventListener('click', function() {
        chatWidget.classList.add('open');
        chatInput.focus();
    });
    
    // Close chat
    closeChat.addEventListener('click', function() {
        chatWidget.classList.remove('open');
    });
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "Gracias por tu mensaje. Un agente se comunicará contigo pronto.",
                "He registrado tu consulta. ¿Hay algo más en lo que pueda ayudarte?",
                "Perfecto, voy a transferir tu consulta al departamento correspondiente.",
                "Entiendo tu situación. Te conectaré con un especialista.",
                "Gracias por contactarnos. Te responderemos en breve."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage(randomResponse, 'bot');
        }, 1000 + Math.random() * 2000);
    }
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addChatMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const currentTime = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
            messageElement.style.transition = 'all 0.3s ease';
        }, 50);
    }
}

// Interactive Map Functionality
function initializeMap() {
    const loadMapButton = document.getElementById('load-map');
    const mapContainer = document.getElementById('map');
    
    if (!loadMapButton || !mapContainer) return;
    
    loadMapButton.addEventListener('click', function() {
        // Show loading state
        this.textContent = 'Cargando...';
        this.disabled = true;
        
        // Simulate map loading
        setTimeout(() => {
            // Replace placeholder with interactive map
            mapContainer.innerHTML = `
                <div style="height: 400px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="text-align: center; color: #666;">
                        <h3 style="margin-bottom: 10px;">🗺️ Mapa Interactivo</h3>
                        <p>Aquí se mostraría el mapa real con nuestras ubicaciones</p>
                        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                            <div style="background: #0071e3; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">📍 San Francisco</div>
                            <div style="background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">📍 Nueva York</div>
                            <div style="background: #34c759; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">📍 Londres</div>
                        </div>
                    </div>
                </div>
            `;
        }, 1500);
    });
    
    // Location button functionality
    const locationButtons = document.querySelectorAll('.btn-location');
    locationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const locationCard = this.closest('.location-card');
            const locationName = locationCard.querySelector('h3').textContent;
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Abriendo...';
            this.disabled = true;
            
            setTimeout(() => {
                alert(`Abriendo mapa de ${locationName}...`);
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Page Animations
function initializeAnimations() {
    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Staggered animation for grid items
                if (entry.target.parentElement.classList.contains('contact-options') ||
                    entry.target.parentElement.classList.contains('support-grid') ||
                    entry.target.parentElement.classList.contains('locations-grid')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Animate contact options
    document.querySelectorAll('.contact-option, .support-card, .location-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        animateOnScroll.observe(el);
    });
    
    // Form animation
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(50px)';
        formContainer.style.transition = 'all 0.8s ease';
        animateOnScroll.observe(formContainer);
    }
    
    // Contact option hover effects
    document.querySelectorAll('.contact-option').forEach(option => {
        option.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.option-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.option-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Support card animations
    document.querySelectorAll('.support-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.support-icon');
            if (icon) {
                icon.style.animation = 'bounce 0.6s ease';
            }
        });
    });
    
    // Location card image parallax effect
    document.querySelectorAll('.location-image').forEach(image => {
        image.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Floating action button for quick contact
function createFloatingContactButton() {
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'floating-contact-btn';
    floatingBtn.innerHTML = '💬';
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #0071e3, #005bb5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 113, 227, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
        animation: floatUp 3s ease-in-out infinite;
    `;
    
    floatingBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 15px 40px rgba(0, 113, 227, 0.4)';
    });
    
    floatingBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(0, 113, 227, 0.3)';
    });
    
    floatingBtn.addEventListener('click', function() {
        document.getElementById('start-chat').click();
    });
    
    document.body.appendChild(floatingBtn);
    
    // Add floating animation
    const floatingStyle = document.createElement('style');
    floatingStyle.textContent = `
        @keyframes floatUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(floatingStyle);
}

// Initialize floating button
setTimeout(createFloatingContactButton, 2000);

// Auto-scroll to form if coming from another page with hash
if (window.location.hash === '#contact-form') {
    setTimeout(() => {
        document.querySelector('.contact-form-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 500);
}

// Add page load animation
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
});