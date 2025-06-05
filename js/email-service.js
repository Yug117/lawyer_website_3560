// /home/ubuntu/app/lawyer_website/js/email-service.js

/**
 * Email Service for sending inquiries directly to Advocate Shivam Jivani
 * Uses EmailJS for reliable client-side email delivery
 */
class EmailService {
    constructor() {
        this.initialized = false;
        this.emailjsUserId = 'your_emailjs_user_id'; // Replace with actual EmailJS User ID
        this.serviceId = 'your_service_id'; // Replace with actual EmailJS Service ID
        this.templateId = 'inquiry_template'; // Replace with actual EmailJS Template ID
        this.advocateEmail = 'shivamjivani2018@gmail.com';
        this.init();
    }

    async init() {
        try {
            // Load EmailJS SDK if not already loaded
            if (typeof emailjs === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                script.onload = () => {
                    emailjs.init(this.emailjsUserId);
                    this.initialized = true;
                };
                document.head.appendChild(script);
            } else {
                emailjs.init(this.emailjsUserId);
                this.initialized = true;
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }

    async sendInquiry(formData) {
        if (!this.initialized) {
            throw new Error('Email service not initialized');
        }

        try {
            const templateParams = {
                to_email: this.advocateEmail,
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                case_type: this.formatCaseType(formData.caseType),
                message: formData.message,
                reference_number: formData.referenceNumber,
                submission_date: new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return {
                success: true,
                response: response,
                message: 'Inquiry sent successfully to Advocate Shivam Jivani'
            };

        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }

    formatCaseType(caseType) {
        const formatMap = {
            'criminal-law': 'Criminal Law',
            'civil-litigation': 'Civil Litigation',
            'corporate-law': 'Corporate Law',
            'family-law': 'Family Law',
            'property-law': 'Property Law',
            'immigration-law': 'Immigration Law'
        };
        return formatMap[caseType] || caseType || 'General Inquiry';
    }

    // Alternative method using native browser fetch (if EmailJS is not preferred)
    async sendInquiryViaWebhook(formData) {
        try {
            // This would require a backend webhook service
            const webhookUrl = 'https://your-webhook-service.com/send-email';
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.advocateEmail,
                    subject: `New Legal Inquiry - ${formData.referenceNumber}`,
                    formData: formData
                })
            });

            if (!response.ok) {
                throw new Error(`Webhook failed: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                response: result,
                message: 'Inquiry sent successfully via webhook'
            };

        } catch (error) {
            console.error('Webhook email sending failed:', error);
            throw error;
        }
    }

    // Validate email configuration
    isConfigured() {
        return this.emailjsUserId !== 'your_emailjs_user_id' && 
               this.serviceId !== 'your_service_id' && 
               this.templateId !== 'inquiry_template';
    }
}

// Export for use in other scripts
window.EmailService = EmailService;