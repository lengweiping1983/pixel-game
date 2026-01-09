const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const getQuestions = async (count = 5) => {
  if (!API_URL) {
    console.warn('API URL not set, using mock data');
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: i + 1,
        question: `Pixel Question ${i + 1}: What is 1 + ${i}?`,
        options: {
          A: `${1 + i}`,
          B: `${2 + i}`,
          C: `${3 + i}`,
          D: `${4 + i}`,
        },
        answer: 'A', // For mock, always A
        seed: `boss-${i}` // For avatar
      });
    }
    return questions;
  }

  try {
    const response = await fetch(`${API_URL}?action=getQuestions&count=${count}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    // In case of error (or dev without net), maybe fallback or re-throw
    // Rethrowing to handle UI error state
    throw error;
  }
};

export const submitResult = async (resultData) => {
  if (!API_URL) {
    console.log('Mock submit result:', resultData);
    return { success: true };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'submitResult', ...resultData }),
      // GAS often requires no-cors or specific handling, but 'cors' is standard for fetch if backend supports it.
      // Usually GAS web apps need 'text/plain' body to avoid CORS preflight issues sometimes, 
      // but let's assume standard JSON POST for now. 
      // If CORS issues arise, we might need 'no-cors' mode but then we can't read response.
      // A common GAS pattern is using hidden form or JSONP, but modern fetch often works if GAS headers are set.
    });
    // With GAS, sometimes reading JSON response is tricky if redirect happens.
    // Let's assume the user knows how to setup GAS for CORS (doGet/doPost returning JSON).
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting result:', error);
    return { success: false, error };
  }
};
