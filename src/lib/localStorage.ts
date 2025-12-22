// Simple localStorage-based database for browser compatibility
export const saveBatchesToStorage = (newBatches: any[]) => {
  try {
    // Get existing batches
    const existing = loadBatchesFromStorage();
    const existingMap = new Map(existing.map(b => [b.id, b]));
    
    // Update with new batches (merge)
    newBatches.forEach(batch => {
      existingMap.set(batch.id, batch);
    });
    
    // Save merged data
    const mergedBatches = Array.from(existingMap.values());
    localStorage.setItem('cognizant_batches', JSON.stringify(mergedBatches));
    console.log(`${newBatches.length} batches updated, ${mergedBatches.length - newBatches.length} preserved`);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadBatchesFromStorage = () => {
  try {
    const stored = localStorage.getItem('cognizant_batches');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

export const clearBatchesFromStorage = () => {
  try {
    localStorage.removeItem('cognizant_batches');
    console.log('Batches cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};