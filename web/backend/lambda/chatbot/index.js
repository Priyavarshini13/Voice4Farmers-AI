const https = require('https');

exports.handler = async function(event) {
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
        var body = {};
        try {
            body = JSON.parse(event.body || '{}');
        } catch (e) {
            body = {};
        }
        
        var question = body.question;
        var session_id = body.session_id || '1';

        if (!question) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Question is required' })
            };
        }

        try {
            const RAG_API_URL = 'https://voice4farmers-api.onrender.com/query';
            const response = await Promise.race([
                makeHttpRequest(RAG_API_URL, { question: question, session_id: session_id }),
                new Promise(function(_, reject) { 
                    setTimeout(function() { reject(new Error('Timeout')); }, 20000);
                })
            ]);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(response)
            };
        } catch (apiError) {
            console.log('External API failed, using fallback:', apiError.message);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    answer: 'Regarding "' + question + '": For best farming practices, ensure proper soil preparation, use quality seeds, maintain adequate irrigation, and apply fertilizers at the right time. Consult local agricultural experts for specific guidance.',
                    confidence: 0.75
                })
            };
        }

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

function makeHttpRequest(url, data) {
    return new Promise(function(resolve, reject) {
        var postData = JSON.stringify(data);
        var urlObj = new URL(url);

        var options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var req = https.request(options, function(res) {
            var responseData = '';

            res.on('data', function(chunk) {
                responseData += chunk;
            });

            res.on('end', function() {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve({ answer: responseData, confidence: 1.0 });
                }
            });
        });

        req.on('error', function(error) {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}
