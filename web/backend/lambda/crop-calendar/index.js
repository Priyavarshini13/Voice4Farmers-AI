exports.handler = async function(event) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const crop = (event.queryStringParameters && event.queryStringParameters.crop) || 'paddy';
        const language = (event.queryStringParameters && event.queryStringParameters.language) || 'english';

        const cropData = getCropCalendar(crop.toLowerCase(), language.toLowerCase());

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(cropData)
        };

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

function getCropCalendar(crop, language) {
    const calendars = {
        paddy: {
            english: [
                { week: 'Week 1-2', stage: 'Land Preparation', description: 'Plow and level the field. Ensure proper drainage.' },
                { week: 'Week 3-4', stage: 'Sowing/Transplanting', description: 'Sow seeds or transplant seedlings with 20cm spacing.' },
                { week: 'Week 5-8', stage: 'Vegetative Growth', description: 'Maintain water level. Apply first dose of fertilizer.' },
                { week: 'Week 9-12', stage: 'Tillering', description: 'Monitor for pests. Apply second fertilizer dose.' },
                { week: 'Week 13-16', stage: 'Flowering', description: 'Ensure adequate water. Watch for diseases.' },
                { week: 'Week 17-20', stage: 'Grain Filling', description: 'Reduce water gradually. Protect from birds.' },
                { week: 'Week 21-24', stage: 'Maturity & Harvest', description: 'Harvest when 80% grains turn golden yellow.' }
            ],
            tamil: [
                { week: 'வாரம் 1-2', stage: 'நில தயாரிப்பு', description: 'நிலத்தை உழுது சமன் செய்யவும். வடிகால் வசதி உறுதி செய்யவும்.' },
                { week: 'வாரம் 3-4', stage: 'விதைத்தல்/நடவு', description: '20 செ.மீ இடைவெளியில் விதைகள் அல்லது நாற்றுகளை நடவும்.' },
                { week: 'வாரம் 5-8', stage: 'தாவர வளர்ச்சி', description: 'நீர் மட்டத்தை பராமரிக்கவும். முதல் உரம் இடவும்.' },
                { week: 'வாரம் 9-12', stage: 'கிளை வளர்ச்சி', description: 'பூச்சிகளை கண்காணிக்கவும். இரண்டாவது உரம் இடவும்.' },
                { week: 'வாரம் 13-16', stage: 'பூக்கும் காலம்', description: 'போதுமான நீர் உறுதி செய்யவும். நோய்களை கவனிக்கவும்.' },
                { week: 'வாரம் 17-20', stage: 'தானிய நிரப்புதல்', description: 'நீரை படிப்படியாக குறைக்கவும். பறவைகளிடமிருந்து பாதுகாக்கவும்.' },
                { week: 'வாரம் 21-24', stage: 'முதிர்ச்சி & அறுவடை', description: '80% தானியங்கள் தங்க மஞ்சள் நிறமாக மாறும்போது அறுவடை செய்யவும்.' }
            ],
            hindi: [
                { week: 'सप्ताह 1-2', stage: 'भूमि तैयारी', description: 'खेत की जुताई और समतल करें। उचित जल निकासी सुनिश्चित करें।' },
                { week: 'सप्ताह 3-4', stage: 'बुवाई/रोपाई', description: '20 सेमी की दूरी पर बीज या पौध रोपें।' },
                { week: 'सप्ताह 5-8', stage: 'वानस्पतिक वृद्धि', description: 'जल स्तर बनाए रखें। पहली खाद डालें।' },
                { week: 'सप्ताह 9-12', stage: 'कल्ले फूटना', description: 'कीटों की निगरानी करें। दूसरी खाद डालें।' },
                { week: 'सप्ताह 13-16', stage: 'फूल आना', description: 'पर्याप्त पानी सुनिश्चित करें। बीमारियों पर नजर रखें।' },
                { week: 'सप्ताह 17-20', stage: 'दाना भरना', description: 'धीरे-धीरे पानी कम करें। पक्षियों से बचाएं।' },
                { week: 'सप्ताह 21-24', stage: 'परिपक्वता और कटाई', description: 'जब 80% दाने सुनहरे पीले हो जाएं तो कटाई करें।' }
            ]
        },
        tomato: {
            english: [
                { week: 'Week 1-2', stage: 'Nursery Preparation', description: 'Prepare seedbed with well-decomposed manure.' },
                { week: 'Week 3-4', stage: 'Seedling Growth', description: 'Water regularly. Protect from direct sunlight.' },
                { week: 'Week 5-6', stage: 'Transplanting', description: 'Transplant 30-day old seedlings with 60x45cm spacing.' },
                { week: 'Week 7-10', stage: 'Vegetative Growth', description: 'Apply fertilizer. Stake plants for support.' },
                { week: 'Week 11-14', stage: 'Flowering', description: 'Ensure adequate water. Monitor for pests.' },
                { week: 'Week 15-18', stage: 'Fruit Development', description: 'Regular watering. Remove diseased fruits.' },
                { week: 'Week 19-24', stage: 'Harvesting', description: 'Harvest ripe fruits every 3-4 days.' }
            ],
            tamil: [
                { week: 'வாரம் 1-2', stage: 'நாற்றங்கால் தயாரிப்பு', description: 'நன்கு மக்கிய உரத்துடன் விதைப்பாத்தி தயார் செய்யவும்.' },
                { week: 'வாரம் 3-4', stage: 'நாற்று வளர்ச்சி', description: 'தவறாமல் நீர் பாய்ச்சவும். நேரடி சூரிய ஒளியிலிருந்து பாதுகாக்கவும்.' },
                { week: 'வாரம் 5-6', stage: 'நடவு', description: '30 நாள் நாற்றுகளை 60x45 செ.மீ இடைவெளியில் நடவும்.' },
                { week: 'வாரம் 7-10', stage: 'தாவர வளர்ச்சி', description: 'உரம் இடவும். செடிகளுக்கு ஆதரவு கம்பம் வழங்கவும்.' },
                { week: 'வாரம் 11-14', stage: 'பூக்கும் காலம்', description: 'போதுமான நீர் உறுதி செய்யவும். பூச்சிகளை கண்காணிக்கவும்.' },
                { week: 'வாரம் 15-18', stage: 'காய் வளர்ச்சி', description: 'தவறாமல் நீர் பாய்ச்சவும். நோயுற்ற காய்களை அகற்றவும்.' },
                { week: 'வாரம் 19-24', stage: 'அறுவடை', description: 'முதிர்ந்த காய்களை 3-4 நாட்களுக்கு ஒருமுறை அறுவடை செய்யவும்.' }
            ],
            hindi: [
                { week: 'सप्ताह 1-2', stage: 'नर्सरी तैयारी', description: 'अच्छी तरह सड़ी खाद के साथ बीज क्यारी तैयार करें।' },
                { week: 'सप्ताह 3-4', stage: 'पौध वृद्धि', description: 'नियमित रूप से पानी दें। सीधी धूप से बचाएं।' },
                { week: 'सप्ताह 5-6', stage: 'रोपाई', description: '30 दिन पुरानी पौध को 60x45 सेमी की दूरी पर रोपें।' },
                { week: 'सप्ताह 7-10', stage: 'वानस्पतिक वृद्धि', description: 'खाद डालें। पौधों को सहारा दें।' },
                { week: 'सप्ताह 11-14', stage: 'फूल आना', description: 'पर्याप्त पानी सुनिश्चित करें। कीटों की निगरानी करें।' },
                { week: 'सप्ताह 15-18', stage: 'फल विकास', description: 'नियमित पानी दें। रोगग्रस्त फलों को हटाएं।' },
                { week: 'सप्ताह 19-24', stage: 'कटाई', description: 'पके फलों को हर 3-4 दिन में तोड़ें।' }
            ]
        },
        cotton: {
            english: [
                { week: 'Week 1-2', stage: 'Land Preparation', description: 'Deep plowing and harrowing. Apply basal fertilizer.' },
                { week: 'Week 3-4', stage: 'Sowing', description: 'Sow seeds with 60x30cm spacing. Ensure good seed-soil contact.' },
                { week: 'Week 5-8', stage: 'Germination & Early Growth', description: 'Thin out weak seedlings. First irrigation.' },
                { week: 'Week 9-12', stage: 'Vegetative Growth', description: 'Apply nitrogen fertilizer. Control weeds.' },
                { week: 'Week 13-16', stage: 'Square Formation', description: 'Monitor for bollworm. Apply pesticides if needed.' },
                { week: 'Week 17-20', stage: 'Flowering & Boll Formation', description: 'Ensure adequate moisture. Apply potash fertilizer.' },
                { week: 'Week 21-28', stage: 'Boll Development', description: 'Regular pest monitoring. Reduce irrigation.' },
                { week: 'Week 29-36', stage: 'Boll Opening & Harvesting', description: 'Harvest cotton when bolls fully open. Multiple pickings.' }
            ],
            tamil: [
                { week: 'வாரம் 1-2', stage: 'நில தயாரிப்பு', description: 'ஆழமாக உழுது கொத்தவும். அடி உரம் இடவும்.' },
                { week: 'வாரம் 3-4', stage: 'விதைத்தல்', description: '60x30 செ.மீ இடைவெளியில் விதைகளை விதைக்கவும்.' },
                { week: 'வாரம் 5-8', stage: 'முளைப்பு & ஆரம்ப வளர்ச்சி', description: 'பலவீனமான நாற்றுகளை அகற்றவும். முதல் நீர்ப்பாசனம்.' },
                { week: 'வாரம் 9-12', stage: 'தாவர வளர்ச்சி', description: 'நைட்ரஜன் உரம் இடவும். களைகளை கட்டுப்படுத்தவும்.' },
                { week: 'வாரம் 13-16', stage: 'சதுர உருவாக்கம்', description: 'பருத்தி புழுவை கண்காணிக்கவும். தேவைப்பட்டால் பூச்சிக்கொல்லி தெளிக்கவும்.' },
                { week: 'வாரம் 17-20', stage: 'பூக்கும் & காய் உருவாக்கம்', description: 'போதுமான ஈரப்பதம் உறுதி செய்யவும். பொட்டாஷ் உரம் இடவும்.' },
                { week: 'வாரம் 21-28', stage: 'காய் வளர்ச்சி', description: 'தவறாமல் பூச்சி கண்காணிப்பு. நீர்ப்பாசனம் குறைக்கவும்.' },
                { week: 'வாரம் 29-36', stage: 'காய் திறப்பு & அறுவடை', description: 'காய்கள் முழுவதும் திறந்தவுடன் அறுவடை செய்யவும்.' }
            ],
            hindi: [
                { week: 'सप्ताह 1-2', stage: 'भूमि तैयारी', description: 'गहरी जुताई और हैरोइंग। बेसल खाद डालें।' },
                { week: 'सप्ताह 3-4', stage: 'बुवाई', description: '60x30 सेमी की दूरी पर बीज बोएं।' },
                { week: 'सप्ताह 5-8', stage: 'अंकुरण और प्रारंभिक वृद्धि', description: 'कमजोर पौधों को हटाएं। पहली सिंचाई।' },
                { week: 'सप्ताह 9-12', stage: 'वानस्पतिक वृद्धि', description: 'नाइट्रोजन खाद डालें। खरपतवार नियंत्रण।' },
                { week: 'सप्ताह 13-16', stage: 'वर्ग निर्माण', description: 'बॉलवर्म की निगरानी करें। आवश्यकता पर कीटनाशक डालें।' },
                { week: 'सप्ताह 17-20', stage: 'फूल और गोला निर्माण', description: 'पर्याप्त नमी सुनिश्चित करें। पोटाश खाद डालें।' },
                { week: 'सप्ताह 21-28', stage: 'गोला विकास', description: 'नियमित कीट निगरानी। सिंचाई कम करें।' },
                { week: 'सप्ताह 29-36', stage: 'गोला खुलना और कटाई', description: 'जब गोले पूरी तरह खुल जाएं तो कपास तोड़ें।' }
            ]
        }
    };

    return {
        crop: crop,
        language: language,
        stages: calendars[crop] && calendars[crop][language] ? calendars[crop][language] : calendars.paddy.english
    };
}
