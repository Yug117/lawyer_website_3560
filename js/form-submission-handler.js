// /home/ubuntu/app/lawyer_website/js/form-submission-handler.js

/**
 * Form Submission Handler for Direct Email and WhatsApp Integration
 * Handles form submissions without database storage
 */
class FormSubmissionHandler {
    constructor() {
        this.emailService = new EmailService();
        this.whatsappService = new WhatsAppService();
        this.submissionInProgress = false;
    }

    async handleSubmission(formData) {
        if (this.submissionInProgress) {
            throw new Error('Submission already in progress');
        }

        this.submissionInProgress = true;
        
        try {
            // Generate unique reference number
            const referenceNumber = this.generateReferenceNumber();
            
            // Prepare submission data
            const submissionData = {
                ...formData,
                referenceNumber: referenceNumber,
                timestamp: new Date().toISOString(),
                submittedAt: new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata'
                })
            };

            // Results tracking
            const results = {
                email: { success: false, error: null },
                whatsapp: { success: false, error: null },
                overall: false
            };

            // Send email (primary method)
            try {
                const emailResult = await this.emailService.sendInquiry(submissionData);
                results.email.success = true;
                results.email.response = emailResult;
                console.log('Email sent successfully:', emailResult);
            } catch (emailError) {
                results.email.error = emailError.message;
                console.error('Email sending failed:', emailError);
            }

            // Send WhatsApp (secondary method)
            try {
                const whatsappResult = await this.whatsappService.sendInquiry(submissionData);
                results.whatsapp.success = true;
                results.whatsapp.response = whatsappResult;
                console.log('WhatsApp opened successfully:', whatsappResult);
            } catch (whatsappError) {
                results.whatsapp.error = whatsappError.message;
                console.error('WhatsApp sending failed:', whatsappError);
            }

            // Determine overall success
            results.overall = results.email.success || results.whatsapp.success;

            if (results.overall) {
                // Store submission data for confirmation screen
                const confirmationData = {
                    ...submissionData,
                    metadata: {
                        referenceNumber: referenceNumber,
                        timestamp: submissionData.submittedAt,
                        submissionId: Date.now(),
                        deliveryStatus: {
                            email: results.email.success,
                            whatsapp: results.whatsapp.success
                        }
                    }
                };

                localStorage.setItem('formSubmissionData', JSON.stringify(confirmationData));
                
                return {
                    success: true,
                    data: confirmationData,
                    deliveryResults: results,
                    message: this.getSuccessMessage(results)
                };
            } else {
                throw new Error(this.getErrorMessage(results));
            }

        } catch (error) {
            console.error('Form submission failed:', error);
            throw error;
        } finally {
            this.submissionInProgress = false;
        }
    }

    generateReferenceNumber() {
        const prefix = 'SJ';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    getSuccessMessage(results) {
        if (results.email.success && results.whatsapp.success) {
            return 'Your inquiry has been sent via both email and WhatsApp successfully!';
        } else if (results.email.success) {
            return 'Your inquiry has been sent via email successfully! WhatsApp link is also available.';
        } else if (results.whatsapp.success) {
            return 'WhatsApp has been opened with your inquiry! Please send the pre-filled message.';
        }
        return 'Inquiry processed successfully!';
    }

    getErrorMessage(results) {
        const errors = [];
        if (results.email.error) {
            errors.push(`Email: ${results.email.error}`);
        }
        if (results.whatsapp.error) {
            errors.push(`WhatsApp: ${results.whatsapp.error}`);
        }
        return `Failed to send inquiry. ${errors.join(', ')}. Please try again or contact directly.`;
    }

    // Validate form data before submission
    validateFormData(formData) {
        const errors = [];

        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Please provide a valid email address');
        }

        if (formData.phone && !this.isValidPhone(formData.phone)) {
            errors.push('Please provide a valid phone number');
        }

        if (!formData.message || formData.message.trim().length < 20) {
            errors.push('Message must be at least 20 characters long');
        }

        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        if (!phone) return true; // Phone is optional
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10;
    }

    // Get submission status for debugging
    getSubmissionStatus() {
        return {
            inProgress: this.submissionInProgress,
            emailConfigured: this.emailService.isConfigured(),
            whatsappNumber: this.whatsappService.phoneNumber
        };
    }
}

// Export for use in other scripts
window.FormSubmissionHandler = FormSubmissionHandler;