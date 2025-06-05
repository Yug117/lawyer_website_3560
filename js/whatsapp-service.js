// /home/ubuntu/app/lawyer_website/js/whatsapp-service.js

/**
 * WhatsApp Service for sending inquiries directly to Advocate Shivam Jivani
 * Uses WhatsApp URL scheme for direct messaging
 */
class WhatsAppService {
    constructor() {
        this.phoneNumber = '917069984696'; // Advocate Shivam Jivani's WhatsApp number
        this.baseUrl = 'https://wa.me/';
    }

    async sendInquiry(formData) {
        try {
            const message = this.formatMessage(formData);
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            
            if (!whatsappWindow) {
                throw new Error('Failed to open WhatsApp. Please allow popups and try again.');
            }

            return {
                success: true,
                message: 'WhatsApp opened successfully. Please send the pre-filled message.',
                whatsappUrl: whatsappUrl
            };

        } catch (error) {
            console.error('Failed to send WhatsApp message:', error);
            throw error;
        }
    }

    formatMessage(formData) {
        const caseType = this.formatCaseType(formData.caseType);
        const submissionDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `🏛️ *NEW LEGAL INQUIRY*\n\n` +
               `📋 *Reference:* ${formData.referenceNumber}\n` +
               `📅 *Date:* ${submissionDate}\n\n` +
               `👤 *Name:* ${formData.name}\n` +
               `📧 *Email:* ${formData.email}\n` +
               `📱 *Phone:* ${formData.phone || 'Not provided'}\n` +
               `⚖️ *Case Type:* ${caseType}\n\n` +
               `💬 *Message:*\n${formData.message}\n\n` +
               `---\n` +
               `This inquiry was submitted through the Advocate Shivam Jivani website contact form.`;
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

    // Alternative method using WhatsApp Business API (requires business account and API key)
    async sendInquiryViaBusinessAPI(formData) {
        try {
            // This would require WhatsApp Business API credentials
            const apiUrl = 'https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages';
            const accessToken = 'YOUR_WHATSAPP_BUSINESS_ACCESS_TOKEN';
            
            const messageData = {
                messaging_product: 'whatsapp',
                to: this.phoneNumber,
                type: 'text',
                text: {
                    body: this.formatMessage(formData)
                }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                throw new Error(`WhatsApp API failed: ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                response: result,
                message: 'WhatsApp message sent successfully via Business API'
            };

        } catch (error) {
            console.error('WhatsApp Business API sending failed:', error);
            throw error;
        }
    }

    // Generate WhatsApp link for copying
    generateWhatsAppLink(formData) {
        const message = this.formatMessage(formData);
        const encodedMessage = encodeURIComponent(message);
        return `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
    }

    // Validate phone number format
    isValidPhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        // Check if it's a valid Indian mobile number (10 digits) with country code
        return /^91[6-9]\d{9}$/.test(cleanNumber) || /^[6-9]\d{9}$/.test(cleanNumber);
    }
}

// Export for use in other scripts
window.WhatsAppService = WhatsAppService;