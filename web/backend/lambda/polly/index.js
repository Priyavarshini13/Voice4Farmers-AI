const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

const polly = new PollyClient({ region: "ap-south-1" });

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const body = JSON.parse(event.body);
        const { text, language } = body;

        const voiceMap = {
            'en': { voice: 'Joanna', engine: 'neural' },
            'ta': { voice: 'Aditi', engine: 'standard' },
            'hi': { voice: 'Aditi', engine: 'standard' }
        };

        const voiceConfig = voiceMap[language] || { voice: 'Joanna', engine: 'neural' };

        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voiceConfig.voice,
            Engine: voiceConfig.engine
        };

        const command = new SynthesizeSpeechCommand(params);
        const response = await polly.send(command);
        
        const audioStream = await response.AudioStream.transformToByteArray();
        const audioBase64 = Buffer.from(audioStream).toString('base64');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ audio: audioBase64 })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
