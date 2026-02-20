/**
 * Report Generation Task Handler
 * Generates PDF and Excel reports from data
 */

const fs = require('fs');
const path = require('path');

const reportGen = async (job) => {
  const task = job.data;
  console.log('🔧 Processing Report Generation:', task.payload);
  
  try {
    const { format, reportType, data, fileName } = task.payload;
    
    // Create reports directory
    const reportDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const filePath = path.join(reportDir, `${fileName || 'report_' + Date.now()}.${format}`);
    
    // Simulate report generation
    let reportContent = '';
    
    if (format === 'pdf') {
      reportContent = generatePDFContent(reportType, data);
    } else if (format === 'excel') {
      reportContent = generateExcelContent(reportType, data);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
    
    // Write report
    fs.writeFileSync(filePath, reportContent);
    const fileSize = fs.statSync(filePath).size;
    
    console.log(`✅ Report generated: ${filePath} (${fileSize} bytes)`);
    
    // Simulate 2s processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      status: 'completed',
      taskId: task.id,
      reportPath: filePath,
      fileSize: fileSize,
      format: format,
      message: `${reportType} report generated successfully`
    };
  } catch (error) {
    console.error('❌ Report generation error:', error.message);
    throw error;
  }
};

function generatePDFContent(reportType, data) {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
${reportType.toUpperCase()} REPORT\n\n${JSON.stringify(data, null, 2)}\n\nGenerated: ${new Date().toISOString()}`;
}

function generateExcelContent(reportType, data) {
  let csv = 'ID,Data,Generated\n';
  if (Array.isArray(data)) {
    data.forEach((item, idx) => {
      csv += `${idx + 1},"${JSON.stringify(item)}",${new Date().toISOString()}\n`;
    });
  } else {
    csv += `1,"${JSON.stringify(data)}",${new Date().toISOString()}\n`;
  }
  return csv;
}

module.exports = reportGen;