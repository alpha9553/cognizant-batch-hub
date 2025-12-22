const API_BASE_URL = 'http://localhost:3001/api';

export const saveBatchesToAPI = async (batches: any[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batches),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Batches saved to database:', result.message);
    return result;
  } catch (error) {
    console.error('Failed to save batches to database:', error);
    throw error;
  }
};

export const loadBatchesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/batches`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const batches = await response.json();
    console.log('Batches loaded from database:', batches.length);
    return batches;
  } catch (error) {
    console.error('Failed to load batches from database:', error);
    throw error;
  }
};