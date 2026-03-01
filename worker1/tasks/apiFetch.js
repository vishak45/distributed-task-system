

const axios = require('axios');

const apiFetch = async (task) => {
  console.log('🔧 Processing API Integration:', task.payload);
  
  try {
    const { 
      apiEndpoint, 
      method = 'GET', 
      params = {}, 
      headers = {},
      timeout = 30000 
    } = task.payload;
    
    // Also check in data for apiEndpoint from frontend
    const endpoint = apiEndpoint || task.data?.apiEndpoint;
    
    if (!endpoint) {
      throw new Error('API endpoint is required');
    }
    
    console.log(`📡 Fetching from: ${endpoint}`);
    console.log(`📋 Method: ${method}`);
    console.log(`📦 Params:`, params);
    
    // Make actual API request
    const response = await axios({
      url: endpoint,
      method: method,
      params: method === 'GET' ? params : undefined,
      data: method !== 'GET' ? params : undefined,
      headers: headers,
      timeout: timeout
    });
    
    const responseData = response.data;
    const isArray = Array.isArray(responseData);
    const dataArray = isArray ? responseData : [responseData];
    
    console.log(`✅ API call completed: ${dataArray.length} records fetched`);
    
    return {
      status: 'completed',
      taskId: task.id,
      apiEndpoint: endpoint,
      method: method,
      statusCode: response.status,
      recordsFetched: dataArray.length,
      data: dataArray,
      message: `Successfully fetched ${dataArray.length} records from API`
    };
  } catch (error) {
    console.error('❌ API fetch error:', error.message);
    throw error;
  }
};

module.exports = apiFetch;