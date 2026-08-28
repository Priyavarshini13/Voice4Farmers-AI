import axios from 'axios';

export const translateText = async (text, targetLang, sourceLang = 'auto') => {
  if (targetLang === 'en' && sourceLang === 'en') return text;
  
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/translate`, {
      text,
      targetLang,
      sourceLang
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
