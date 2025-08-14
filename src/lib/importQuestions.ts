export const importQuestionsFromRawData = async (rawData: string) => {
  try {
    const response = await fetch('/api/import-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to import questions');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const processRawData = (rawData: string) => {
  const lines = rawData.trim().split('\n');
  let processed = 0;
  let skipped = 0;
  
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length === 4 && parts.every(part => part.trim())) {
      processed++;
    } else {
      skipped++;
    }
  }
  
  return { processed, skipped, total: lines.length };
};