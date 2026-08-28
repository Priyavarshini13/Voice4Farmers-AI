const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");

const translate = new TranslateClient({ region: "ap-south-1" });

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
        const { text, targetLang, sourceLang } = body;

        if (targetLang === 'en' && !sourceLang) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ translatedText: text })
            };
        }

        const params = {
            Text: text,
            SourceLanguageCode: sourceLang || 'auto',
            TargetLanguageCode: targetLang
        };

        const command = new TranslateTextCommand(params);
        const response = await translate.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ translatedText: response.TranslatedText })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message, translatedText: body.text })
        };
    }
};
