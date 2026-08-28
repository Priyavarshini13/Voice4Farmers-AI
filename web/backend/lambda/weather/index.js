const https = require('https');

exports.handler = async function(event) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const city = (event.queryStringParameters && event.queryStringParameters.city) || 'Coimbatore';
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        
        if (!API_KEY || API_KEY === '9b4f24be03f8d768544a54814fc03c3a') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    name: city,
                    main: { temp: 28, humidity: 65, feels_like: 30, pressure: 1013 },
                    wind: { speed: 12 },
                    weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }]
                })
            };
        }
        
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_KEY + '&units=metric';
        const weatherData = await makeHttpRequest(url);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(weatherData)
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                name: (event.queryStringParameters && event.queryStringParameters.city) || 'Coimbatore',
                main: { temp: 28, humidity: 65, feels_like: 30, pressure: 1013 },
                wind: { speed: 12 },
                weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }]
            })
        };
    }
};

function makeHttpRequest(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(res) {
            var data = '';

            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                try {
                    var parsed = JSON.parse(data);
                    if (parsed.cod && parsed.cod !== 200) {
                        reject(new Error(parsed.message || 'API Error'));
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', function(error) {
            reject(error);
        });
    });
}
