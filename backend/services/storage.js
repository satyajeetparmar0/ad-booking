const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const STORAGE_URL = 'https://integrations.emergentagent.com/objstore/api/v1/storage';
const EMERGENT_KEY = process.env.EMERGENT_LLM_KEY;
const APP_NAME = 'adadda';

let storage_key = null;

const initStorage = async () => {
  if (storage_key) return storage_key;
  
  try {
    const response = await axios.post(
      `${STORAGE_URL}/init`,
      { emergent_key: EMERGENT_KEY },
      { timeout: 30000 }
    );
    storage_key = response.data.storage_key;
    return storage_key;
  } catch (error) {
    console.error('Storage init error:', error.message);
    throw error;
  }
};

const putObject = async (path, data, contentType) => {
  const key = await initStorage();
  
  try {
    const response = await axios.put(
      `${STORAGE_URL}/objects/${path}`,
      data,
      {
        headers: {
          'X-Storage-Key': key,
          'Content-Type': contentType
        },
        timeout: 120000
      }
    );
    return response.data;
  } catch (error) {
    console.error('Put object error:', error.message);
    throw error;
  }
};

const getObject = async (path) => {
  const key = await initStorage();
  
  try {
    const response = await axios.get(
      `${STORAGE_URL}/objects/${path}`,
      {
        headers: { 'X-Storage-Key': key },
        responseType: 'arraybuffer',
        timeout: 60000
      }
    );
    return {
      content: response.data,
      contentType: response.headers['content-type'] || 'application/octet-stream'
    };
  } catch (error) {
    console.error('Get object error:', error.message);
    throw error;
  }
};

module.exports = { initStorage, putObject, getObject, APP_NAME };
