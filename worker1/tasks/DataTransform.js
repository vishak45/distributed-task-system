/**
 * Data Transformation Task Handler
 * Converts between CSV, JSON, XML formats
 */

const dataTransform = async (job) => {
  const task = job.data;
  console.log('🔧 Processing Data Transformation:', task.payload);
  
  try {
    const { inputFormat, outputFormat, data } = task.payload;
    
    if (!inputFormat || !outputFormat || !data) {
      throw new Error('inputFormat, outputFormat, and data are required');
    }
    
    console.log(`🔄 Converting from ${inputFormat} to ${outputFormat}`);
    
    let transformedData;
    
    // Parse input
    let parsedData = data;
    if (inputFormat === 'csv') {
      parsedData = parseCSV(data);
    } else if (inputFormat === 'json') {
      parsedData = JSON.parse(data);
    } else if (inputFormat === 'xml') {
      parsedData = parseXML(data);
    }
    
    // Transform to output format
    if (outputFormat === 'json') {
      transformedData = JSON.stringify(parsedData, null, 2);
    } else if (outputFormat === 'csv') {
      transformedData = convertToCSV(parsedData);
    } else if (outputFormat === 'xml') {
      transformedData = convertToXML(parsedData);
    }
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`✅ Data transformation completed`);
    
    return {
      status: 'completed',
      taskId: task.id,
      inputFormat: inputFormat,
      outputFormat: outputFormat,
      originalSize: data.length,
      transformedSize: transformedData.length,
      data: transformedData,
      message: `Successfully transformed data from ${inputFormat} to ${outputFormat}`
    };
  } catch (error) {
    console.error('❌ Data transformation error:', error.message);
    throw error;
  }
};

function parseCSV(csvData) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const values = lines[i].split(',');
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    result.push(obj);
  }
  return result;
}

function parseXML(xmlData) {
  // Simplified XML to JSON conversion
  return { xml: 'parsed', data: xmlData };
}

function convertToCSV(data) {
  if (!Array.isArray(data)) return JSON.stringify(data);
  
  const headers = Object.keys(data[0]);
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    csv += headers.map(h => `"${row[h]}"`).join(',') + '\n';
  });
  
  return csv;
}

function convertToXML(data) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      xml += '  <item>\n';
      Object.keys(item).forEach(key => {
        xml += `    <${key}>${item[key]}</${key}>\n`;
      });
      xml += '  </item>\n';
    });
  }
  
  xml += '</root>';
  return xml;
}

module.exports = dataTransform;