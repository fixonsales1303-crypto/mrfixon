// =========================================================================
// Mr. Fixon - EmailJS Contact Form Handler
// =========================================================================

/**
 * EMAILJS CONFIGURATION
 * -------------------------------------------------------------------------
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Add an Email Service (e.g., Gmail, Outlook) -> copy Service ID below
 * 3. Create an Email Template -> copy Template ID below
 *    Template parameters available:
 *      - {{from_name}}         : Sender's name
 *      - {{from_email}}        : Sender's email
 *      - {{phone}}             : Sender's phone number
 *      - {{subject}}           : Inquiry subject
 *      - {{budget}}            : Budget range
 *      - {{preferred_contact}} : Preferred contact methods (e.g., Email, Phone, WhatsApp)
 *      - {{message}}           : Message body
 * 4. Go to Account > API Keys -> copy Public Key below
 * -------------------------------------------------------------------------
 */
const EMAILJS_CONFIG = {
    SERVICE_ID: "service_xs2nr2r",
    TEMPLATE_ID: "template_efxjoi6",
    PUBLIC_KEY: "jew_b-4huA7BsoVGQ"
};

// Initialize EmailJS when library is available
(function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        try {
            emailjs.init({
                publicKey: EMAILJS_CONFIG.PUBLIC_KEY
            });
            console.log('✅ EmailJS successfully initialized');
        } catch (err) {
            console.warn('⚠️ EmailJS initialization error:', err);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Real-time Captcha feedback
    const captchaInput = document.getElementById('captcha');
    if (captchaInput) {
        captchaInput.addEventListener('input', function () {
            if (this.value.trim() === '7') {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.3)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }

    // Form Submit Handler
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. Anti-spam honeypot verification
        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value.trim() !== '') {
            console.warn('Spam detected via honeypot field.');
            return;
        }

        // 2. Anti-spam math captcha verification (3 + 4 = 7)
        if (captchaInput && captchaInput.value.trim() !== '7') {
            captchaInput.style.borderColor = '#ef4444';
            captchaInput.focus();
            showFormToast('Please enter the correct answer for 3 + 4 = 7', 'error');
            return;
        }

        // 3. Extract form values
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const fromName = nameInput ? nameInput.value.trim() : '';
        const fromEmail = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
        const subject = subjectInput && subjectInput.value ? subjectInput.value : 'General Inquiry';
        const message = messageInput ? messageInput.value.trim() : '';

        // Selected budget
        const budgetRadio = contactForm.querySelector('input[name="budget"]:checked');
        const budget = budgetRadio ? budgetRadio.value : 'Not specified';

        // Preferred contact methods
        const contactMethods = Array.from(contactForm.querySelectorAll('input[name="contact_method[]"]:checked'))
            .map(cb => cb.value)
            .join(', ') || 'Email';

        // 4. UI Button State -> Loading
        const submitBtn = document.getElementById('submitBtn') || contactForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';
        }

        const templateParams = {
            from_name: fromName,
            from_email: fromEmail,
            reply_to: fromEmail,
            phone: phone,
            subject: subject,
            budget: budget,
            preferred_contact: contactMethods,
            message: message
        };

        // 5. Send via EmailJS
        const isConfigured = EMAILJS_CONFIG.PUBLIC_KEY && 
                             EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                             EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                             EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

        if (!isConfigured) {
            // Demo mode / Placeholder notification
            setTimeout(() => {
                showFormToast(
                    'Demo Mode: Please insert your EmailJS Service ID, Template ID & Public Key in assets/js/contact.js to send live emails.',
                    'info'
                );
                console.info('EmailJS Template Parameters that would be sent:', templateParams);
                
                // Show successful submission UX for testing
                setTimeout(() => {
                    showFormToast('Thank you! Your inquiry was submitted (Demo Mode).', 'success');
                    contactForm.reset();
                    if (captchaInput) {
                        captchaInput.style.borderColor = '';
                        captchaInput.style.boxShadow = '';
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHTML;
                    }
                }, 1000);
            }, 600);
            return;
        }

        try {
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS SDK failed to load. Please check your internet connection.');
            }

            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            console.log('EmailJS Success:', response.status, response.text);
            showFormToast('Thank you! Your message has been sent successfully. We will get back to you shortly.', 'success');
            contactForm.reset();
            if (captchaInput) {
                captchaInput.style.borderColor = '';
                captchaInput.style.boxShadow = '';
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            const errorText = (error && error.text) ? error.text : (error.message || 'Failed to send message. Please try again.');
            showFormToast(`Error: ${errorText}`, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        }
    });

    /**
     * Toast Notification helper
     */
    function showFormToast(message, type = 'success') {
        const existingToasts = document.querySelectorAll('.form-toast-notification');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `form-toast-notification ${type}`;

        const borderColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#f97316');
        const iconClass = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');

        toast.innerHTML = `
            <div style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                max-width: 420px;
                background: rgba(13, 17, 23, 0.96);
                border: 1px solid ${borderColor};
                color: #ffffff;
                padding: 1.1rem 1.4rem;
                border-radius: 16px;
                box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
                z-index: 999999;
                display: flex;
                align-items: flex-start;
                gap: 0.9rem;
                backdrop-filter: blur(16px);
                font-family: 'Inter', sans-serif;
                font-size: 0.92rem;
                line-height: 1.45;
                animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            ">
                <i class="fas ${iconClass}" style="color: ${borderColor}; font-size: 1.25rem; margin-top: 2px;"></i>
                <div style="flex: 1;">${message}</div>
                <button type="button" onclick="this.closest('.form-toast-notification').remove()" style="
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 0;
                    margin-left: 0.5rem;
                ">&times;</button>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.remove();
            }
        }, 7000);
    }
});
