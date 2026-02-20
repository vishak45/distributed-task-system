/**
 * Email Sending Task Handler
 * Bulk email delivery and templating
 */

const sendMail = async (job) => {
  const task = job.data;
  console.log('🔧 Processing Email Sending:', task.payload);
  
  try {
    const { recipients, subject, template, templateData = {} } = task.payload;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients array is required');
    }
    
    if (!subject || !template) {
      throw new Error('Subject and template are required');
    }
    
    console.log(`📧 Preparing to send ${recipients.length} emails`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`🎨 Template: ${template}`);
    
    // Simulate email sending
    const emailResults = [];
    
    for (const recipient of recipients) {
      // Simulate processing each email
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const emailContent = renderTemplate(template, templateData);
      
      emailResults.push({
        recipient: recipient,
        email: recipient,
        status: 'sent',
        messageId: `msg_${Date.now()}_${Math.random()}`,
        sentAt: new Date().toISOString(),
        subject: subject
      });
      
      console.log(`✅ Email sent to: ${recipient}`);
    }
    
    // Summary
    const successCount = emailResults.filter(e => e.status === 'sent').length;
    
    return {
      status: 'completed',
      taskId: task.id,
      recipientCount: recipients.length,
      successCount: successCount,
      failureCount: recipients.length - successCount,
      subject: subject,
      template: template,
      results: emailResults,
      message: `Successfully sent ${successCount}/${recipients.length} emails`
    };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw error;
  }
};

function renderTemplate(template, data) {
  let content = template;
  
  // Replace template variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, data[key]);
  });
  
  return content;
}

module.exports = sendMail;