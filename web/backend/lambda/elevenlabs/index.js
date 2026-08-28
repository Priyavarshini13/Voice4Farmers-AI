const https = require('https');

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
        const { text, apiKey } = body;

        // ElevenLabs multilingual v2 model supports Tamil
        const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - multilingual voice
        
        const postData = JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        });

        const audioBuffer = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.elevenlabs.io',
                path: `/v1/text-to-speech/${voiceId}`,
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                    'Content-Length': postData.length
                }
            };

            const req = https.request(options, (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(Buffer.concat(chunks));
                    } else {
                        reject(new Error(`ElevenLabs API error: ${res.statusCode}`));
                    }
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        const audioBase64 = audioBuffer.toString('base64');

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
