import AWS from 'aws-sdk';

// Configure AWS SDK (you'll need to add your credentials)
AWS.config.update({
  region: 'ap-south-1',
  // Add your AWS credentials here or use environment variables
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const polly = new AWS.Polly();

export const synthesizeSpeech = async (text, language) => {
  const voiceMap = {
    'en': { VoiceId: 'Joanna', Engine: 'neural' },
    'hi': { VoiceId: 'Aditi', Engine: 'standard' },
    'ta': { VoiceId: 'Aditi', Engine: 'standard' }
  };

  const voiceConfig = voiceMap[language] || { VoiceId: 'Joanna', Engine: 'neural' };

  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceConfig.VoiceId,
    Engine: voiceConfig.Engine
  };

  try {
    const result = await polly.synthesizeSpeech(params).promise();
    const audioBlob = new Blob([result.AudioStream], { type: 'audio/mpeg' });
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Polly synthesis failed:', error);
    throw error;
  }
};