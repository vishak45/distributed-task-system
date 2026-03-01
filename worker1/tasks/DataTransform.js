

const dataTransform = async (task) => {
  console.log('🔧 Processing Data Transformation:', task.payload);
  
  try {
    const { outputFormat, textInput, uploadedFile, inputFormat } = task.data;
    
    if (!outputFormat) {
      throw new Error('outputFormat is required');
    }
    

    let data = textInput || '';
    let detectedInputFormat = inputFormat || 'text';
    
    if (uploadedFile) {
      data = Buffer.from(uploadedFile.buffer, 'base64').toString('utf-8');
      detectedInputFormat = inputFormat || uploadedFile.filename?.split('.').pop()?.toLowerCase() || 'text';
    }
    
    if (!data || data.trim() === '') {
      throw new Error('Either textInput or uploadedFile is required');
    }
    
    console.log(`🔄 Converting from ${detectedInputFormat} to ${outputFormat}`);
    
    let transformedData;
    
  
    let parsedData = data;
    if (detectedInputFormat === 'csv') {
      parsedData = parseCSV(data);
    } else if (detectedInputFormat === 'json') {
      parsedData = JSON.parse(data);
    } else if (detectedInputFormat === 'xml') {
      parsedData = parseXML(data);
    }
    

    if (outputFormat === 'json') {
      transformedData = JSON.stringify(parsedData, null, 2);
    } else if (outputFormat === 'csv') {
      transformedData = convertToCSV(parsedData);
    } else if (outputFormat === 'xml') {
      transformedData = convertToXML(parsedData);
    }
    

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`✅ Data transformation completed`);
    
    return {
      status: 'completed',
      taskId: task.id,
      inputFormat: detectedInputFormat,
      outputFormat: outputFormat,
      originalSize: data.length,
      transformedSize: transformedData.length,
      data: transformedData,
      message: `Successfully transformed data from ${detectedInputFormat} to ${outputFormat}`
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