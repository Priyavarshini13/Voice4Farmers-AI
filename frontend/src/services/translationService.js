import axios from 'axios';

export const translateText = async (text, targetLang, sourceLang = 'auto') => {
  // Skip translation if source and target are the same
  if (targetLang === sourceLang) return text;
  if (!text) return '';
  
  console.log('Translating:', { text: text.substring(0, 50), targetLang, sourceLang });
  
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/translate`, {
      text,
      targetLang,
      sourceLang
    });
    console.log('Translation result:', response.data.translatedText?.substring(0, 50));
    return response.data.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
