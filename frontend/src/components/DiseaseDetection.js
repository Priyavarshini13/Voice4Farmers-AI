import React, { useState } from 'react';
import axios from 'axios';

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        let base64Image = reader.result;
        
        // Compress image if too large
        if (base64Image.length > 500000) {
          base64Image = await compressImage(base64Image);
        }
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_GATEWAY_URL}/disease-detection`,
          { imageBase64: base64Image }
        );

        const responseData = response.data;
        
        // Handle new response format with treatment
        if (responseData.label) {
          // New format: { label, score, treatment }
          const diseaseName = responseData.label.replace(/_/g, ' ');
          const confidence = responseData.score;
          const treatment = responseData.treatment || '';
          
          const diseaseInfo = getDiseaseInfo(diseaseName, language, confidence, treatment);
          setResult(diseaseInfo);
        } else if (Array.isArray(responseData) && responseData.length > 0) {
          // Old format: [{ label, score }]
          const topPrediction = responseData[0];
          const diseaseName = topPrediction.label.replace(/_/g, ' ');
          const confidence = topPrediction.score;
          
          const diseaseInfo = getDiseaseInfo(diseaseName, language, confidence);
          setResult(diseaseInfo);
        } else {
          throw new Error('Invalid response format');
        }
      };
    } catch (error) {
      console.error('Disease detection failed:', error);
      setResult({
        disease: 'Analysis Failed',
        confidence: 0,
        treatment: 'Please try again with a clearer image of the plant leaves.',
        severity: 'unknown'
      });
    }
    setIsAnalyzing(false);
  };

  const compressImage = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const getDiseaseInfo = (diseaseName, lang, confidence, ragTreatment = null) => {
    const isHealthy = diseaseName.toLowerCase().includes('healthy');
    const severity = confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
    
    // Always prefer RAG treatment if provided
    if (ragTreatment && ragTreatment.trim() !== '') {
      return {
        disease: diseaseName,
        confidence: confidence,
        severity: isHealthy ? 'low' : severity,
        treatment: ragTreatment,
        prevention: 'Consult local agricultural experts for additional guidance.'
      };
    }
    
    // Otherwise use local database
    
    // Disease treatment database
    const treatments = {
      'healthy': {
        en: { name: 'Healthy Plant', treatment: 'No treatment needed. Continue regular care and monitoring.', prevention: 'Maintain proper watering, fertilization, and pest control.' },
        ta: { name: 'ஆரோக்கியமான தாவரம்', treatment: 'சிகிச்சை தேவையில்லை. வழக்கமான பராமரிப்பை தொடரவும்.', prevention: 'சரியான நீர்ப்பாசனம், உரமிடுதல் மற்றும் பூச்சி கட்டுப்பாட்டை பராமரிக்கவும்.' },
        hi: { name: 'स्वस्थ पौधा', treatment: 'कोई उपचार की आवश्यकता नहीं। नियमित देखभाल जारी रखें।', prevention: 'उचित पानी, उर्वरक और कीट नियंत्रण बनाए रखें।' }
      },
      'tomato_late_blight': {
        en: { name: diseaseName, treatment: 'Apply Mancozeb or Chlorothalonil fungicide every 7-10 days. Remove infected leaves immediately. Avoid overhead watering. Ensure good air circulation.', prevention: 'Use resistant varieties. Space plants 60-90cm apart. Apply preventive fungicide sprays. Avoid working with wet plants.' },
        ta: { name: diseaseName, treatment: 'மான்கோசெப் அல்லது குளோரோதலோனில் பூஞ்சைக் கொல்லியை 7-10 நாட்களுக்கு ஒருமுறை தெளிக்கவும். பாதிக்கப்பட்ட இலைகளை உடனடியாக அகற்றவும்.', prevention: 'எதிர்ப்பு திறன் கொண்ட வகைகளை பயன்படுத்தவும். தாவரங்களுக்கு இடையே 60-90 செ.மீ இடைவெளி விடவும்.' },
        hi: { name: diseaseName, treatment: 'मैनकोजेब या क्लोरोथैलोनिल कवकनाशी हर 7-10 दिनों में लगाएं। संक्रमित पत्तियों को तुरंत हटाएं।', prevention: 'प्रतिरोधी किस्मों का उपयोग करें। पौधों के बीच 60-90 सेमी की दूरी रखें।' }
      },
      'tomato_early_blight': {
        en: { name: diseaseName, treatment: 'Spray with copper-based fungicide or Mancozeb. Remove lower infected leaves. Mulch around plants to prevent soil splash.', prevention: 'Rotate crops every 2-3 years. Water at base of plants. Apply balanced fertilizer regularly.' },
        ta: { name: diseaseName, treatment: 'தாமிர அடிப்படையிலான பூஞ்சைக் கொல்லி அல்லது மான்கோசெப் தெளிக்கவும். கீழ் பாதிக்கப்பட்ட இலைகளை அகற்றவும்.', prevention: '2-3 ஆண்டுகளுக்கு ஒருமுறை பயிர் சுழற்சி செய்யவும். தாவரங்களின் அடிப்பகுதியில் நீர் பாய்ச்சவும்.' },
        hi: { name: diseaseName, treatment: 'तांबा आधारित कवकनाशी या मैनकोजेब का छिड़काव करें। निचली संक्रमित पत्तियों को हटाएं।', prevention: 'हर 2-3 साल में फसल चक्र अपनाएं। पौधों के आधार पर पानी दें।' }
      },
      'tomato_bacterial_spot': {
        en: { name: diseaseName, treatment: 'Apply copper-based bactericide. Remove severely infected plants. Disinfect tools between plants.', prevention: 'Use certified disease-free seeds. Avoid overhead irrigation. Maintain plant spacing for air flow.' },
        ta: { name: diseaseName, treatment: 'தாமிர அடிப்படையிலான பாக்டீரியா கொல்லி தெளிக்கவும். கடுமையாக பாதிக்கப்பட்ட தாவரங்களை அகற்றவும்.', prevention: 'சான்றிதழ் பெற்ற நோய் இல்லாத விதைகளை பயன்படுத்தவும். மேல் நீர்ப்பாசனத்தை தவிர்க்கவும்.' },
        hi: { name: diseaseName, treatment: 'तांबा आधारित जीवाणुनाशक लगाएं। गंभीर रूप से संक्रमित पौधों को हटाएं।', prevention: 'प्रमाणित रोग मुक्त बीजों का उपयोग करें। ऊपरी सिंचाई से बचें।' }
      },
      'tomato_leaf_mold': {
        en: { name: diseaseName, treatment: 'Apply chlorothalonil or copper fungicide. Improve greenhouse ventilation. Remove infected leaves.', prevention: 'Reduce humidity below 85%. Ensure good air circulation. Use resistant varieties.' },
        ta: { name: diseaseName, treatment: 'குளோரோதலோனில் அல்லது தாமிர பூஞ்சைக் கொல்லி தெளிக்கவும். பசுமை இல்ல காற்றோட்டத்தை மேம்படுத்தவும்.', prevention: 'ஈரப்பதத்தை 85% க்கு கீழ் குறைக்கவும். நல்ல காற்று சுழற்சியை உறுதி செய்யவும்.' },
        hi: { name: diseaseName, treatment: 'क्लोरोथैलोनिल या तांबा कवकनाशी लगाएं। ग्रीनहाउस वेंटिलेशन में सुधार करें।', prevention: 'नमी को 85% से नीचे रखें। अच्छा वायु संचार सुनिश्चित करें।' }
      },
      'tomato_mosaic_virus': {
        en: { name: diseaseName, treatment: 'No cure available. Remove and destroy infected plants immediately. Control aphids and whiteflies. Disinfect tools with 10% bleach solution.', prevention: 'Use virus-resistant varieties. Control insect vectors. Wash hands before handling plants. Avoid tobacco use near plants.' },
        ta: { name: diseaseName, treatment: 'சிகிச்சை இல்லை. பாதிக்கப்பட்ட தாவரங்களை உடனடியாக அகற்றி அழிக்கவும். அசுவினி மற்றும் வெள்ளை ஈக்களை கட்டுப்படுத்தவும்.', prevention: 'வைரஸ் எதிர்ப்பு வகைகளை பயன்படுத்தவும். பூச்சி கடத்திகளை கட்டுப்படுத்தவும்.' },
        hi: { name: diseaseName, treatment: 'कोई इलाज उपलब्ध नहीं। संक्रमित पौधों को तुरंत हटाएं और नष्ट करें। एफिड्स और व्हाइटफ्लाई को नियंत्रित करें।', prevention: 'वायरस प्रतिरोधी किस्मों का उपयोग करें। कीट वाहकों को नियंत्रित करें।' }
      },
      'tomato_yellow_leaf_curl': {
        en: { name: diseaseName, treatment: 'No direct cure. Remove infected plants. Control whiteflies with neem oil or imidacloprid. Use yellow sticky traps.', prevention: 'Plant resistant varieties. Use insect-proof nets. Apply systemic insecticides preventively. Remove weeds around field.' },
        ta: { name: diseaseName, treatment: 'நேரடி சிகிச்சை இல்லை. பாதிக்கப்பட்ட தாவரங்களை அகற்றவும். வேப்ப எண்ணெய் அல்லது இமிடாக்ளோபிரிட் மூலம் வெள்ளை ஈக்களை கட்டுப்படுத்தவும்.', prevention: 'எதிர்ப்பு வகைகளை நடவும். பூச்சி தடுப்பு வலைகளை பயன்படுத்தவும்.' },
        hi: { name: diseaseName, treatment: 'कोई सीधा इलाज नहीं। संक्रमित पौधों को हटाएं। नीम तेल या इमिडाक्लोप्रिड से व्हाइटफ्लाई नियंत्रित करें।', prevention: 'प्रतिरोधी किस्में लगाएं। कीट-रोधी जाल का उपयोग करें।' }
      },
      'potato_early_blight': {
        en: { name: diseaseName, treatment: 'Apply Mancozeb or Chlorothalonil every 7-14 days. Remove infected foliage. Hill up soil around plants.', prevention: 'Use certified seed potatoes. Rotate crops. Maintain adequate plant nutrition. Avoid overhead irrigation.' },
        ta: { name: diseaseName, treatment: 'மான்கோசெப் அல்லது குளோரோதலோனில் 7-14 நாட்களுக்கு ஒருமுறை தெளிக்கவும். பாதிக்கப்பட்ட இலைகளை அகற்றவும்.', prevention: 'சான்றிதழ் பெற்ற உருளைக்கிழங்கு விதைகளை பயன்படுத்தவும். பயிர் சுழற்சி செய்யவும்.' },
        hi: { name: diseaseName, treatment: 'मैनकोजेब या क्लोरोथैलोनिल हर 7-14 दिनों में लगाएं। संक्रमित पत्तियों को हटाएं।', prevention: 'प्रमाणित बीज आलू का उपयोग करें। फसल चक्र अपनाएं।' }
      },
      'potato_late_blight': {
        en: { name: diseaseName, treatment: 'Apply Metalaxyl or Mancozeb immediately. Spray every 5-7 days in wet conditions. Destroy infected plants. Harvest early if severe.', prevention: 'Use resistant varieties. Ensure good drainage. Apply preventive fungicides. Avoid planting near tomatoes.' },
        ta: { name: diseaseName, treatment: 'மெட்டலாக்சில் அல்லது மான்கோசெப் உடனடியாக தெளிக்கவும். ஈரமான சூழ்நிலையில் 5-7 நாட்களுக்கு ஒருமுறை தெளிக்கவும்.', prevention: 'எதிர்ப்பு வகைகளை பயன்படுத்தவும். நல்ல வடிகால் உறுதி செய்யவும்.' },
        hi: { name: diseaseName, treatment: 'मेटालैक्सिल या मैनकोजेब तुरंत लगाएं। गीली स्थिति में हर 5-7 दिनों में स्प्रे करें।', prevention: 'प्रतिरोधी किस्मों का उपयोग करें। अच्छी जल निकासी सुनिश्चित करें।' }
      },
      'pepper_bacterial_spot': {
        en: { name: diseaseName, treatment: 'Apply copper-based bactericide weekly. Remove infected plant parts. Improve air circulation between plants.', prevention: 'Use disease-free seeds. Avoid overhead watering. Disinfect tools. Rotate crops for 2-3 years.' },
        ta: { name: diseaseName, treatment: 'தாமிர அடிப்படையிலான பாக்டீரியா கொல்லியை வாரம் ஒருமுறை தெளிக்கவும். பாதிக்கப்பட்ட பகுதிகளை அகற்றவும்.', prevention: 'நோய் இல்லாத விதைகளை பயன்படுத்தவும். மேல் நீர்ப்பாசனத்தை தவிர்க்கவும்.' },
        hi: { name: diseaseName, treatment: 'तांबा आधारित जीवाणुनाशक साप्ताहिक लगाएं। संक्रमित भागों को हटाएं।', prevention: 'रोग मुक्त बीजों का उपयोग करें। ऊपरी सिंचाई से बचें।' }
      },
      'apple_scab': {
        en: { name: diseaseName, treatment: 'Apply Captan or Myclobutanil fungicide. Remove fallen leaves. Prune to improve air circulation.', prevention: 'Plant resistant varieties. Apply dormant oil spray. Rake and destroy fallen leaves in autumn.' },
        ta: { name: diseaseName, treatment: 'கேப்டன் அல்லது மைக்ளோபுட்டானில் பூஞ்சைக் கொல்லி தெளிக்கவும். விழுந்த இலைகளை அகற்றவும்.', prevention: 'எதிர்ப்பு வகைகளை நடவும். செயலற்ற எண்ணெய் தெளிப்பு செய்யவும்.' },
        hi: { name: diseaseName, treatment: 'कैप्टन या माइक्लोब्यूटानिल कवकनाशी लगाएं। गिरी हुई पत्तियों को हटाएं।', prevention: 'प्रतिरोधी किस्में लगाएं। निष्क्रिय तेल स्प्रे लगाएं।' }
      },
      'apple_black_rot': {
        en: { name: diseaseName, treatment: 'Prune out infected branches. Apply Captan or Thiophanate-methyl. Remove mummified fruits.', prevention: 'Maintain tree vigor. Prune for good air flow. Remove dead wood. Apply preventive fungicides.' },
        ta: { name: diseaseName, treatment: 'பாதிக்கப்பட்ட கிளைகளை வெட்டவும். கேப்டன் அல்லது தியோபனேட்-மெத்தில் தெளிக்கவும்.', prevention: 'மர வலிமையை பராமரிக்கவும். நல்ல காற்று ஓட்டத்திற்கு கிளைகளை வெட்டவும்.' },
        hi: { name: diseaseName, treatment: 'संक्रमित शाखाओं को काटें। कैप्टन या थियोफैनेट-मिथाइल लगाएं।', prevention: 'पेड़ की शक्ति बनाए रखें। अच्छे वायु प्रवाह के लिए छंटाई करें।' }
      },
      'apple_cedar_rust': {
        en: { name: diseaseName, treatment: 'Apply Myclobutanil or Propiconazole at bud break. Repeat every 7-10 days during wet weather.', prevention: 'Remove nearby cedar trees if possible. Plant resistant apple varieties. Apply preventive fungicides in spring.' },
        ta: { name: diseaseName, treatment: 'மொட்டு உடைக்கும் போது மைக்ளோபுட்டானில் அல்லது ப்ரோபிகோனசோல் தெளிக்கவும்.', prevention: 'முடிந்தால் அருகிலுள்ள சிடார் மரங்களை அகற்றவும். எதிர்ப்பு ஆப்பிள் வகைகளை நடவும்.' },
        hi: { name: diseaseName, treatment: 'कली टूटने पर माइक्लोब्यूटानिल या प्रोपिकोनाज़ोल लगाएं।', prevention: 'यदि संभव हो तो पास के देवदार के पेड़ों को हटाएं। प्रतिरोधी सेब की किस्में लगाएं।' }
      }
    };
    
    // Match disease type
    let diseaseType = 'spot'; // default
    const lowerDisease = diseaseName.toLowerCase();
    
    if (isHealthy) diseaseType = 'healthy';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('late') && lowerDisease.includes('blight')) diseaseType = 'tomato_late_blight';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('early') && lowerDisease.includes('blight')) diseaseType = 'tomato_early_blight';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('bacterial')) diseaseType = 'tomato_bacterial_spot';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('leaf') && lowerDisease.includes('mold')) diseaseType = 'tomato_leaf_mold';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('mosaic')) diseaseType = 'tomato_mosaic_virus';
    else if (lowerDisease.includes('tomato') && lowerDisease.includes('yellow') && lowerDisease.includes('curl')) diseaseType = 'tomato_yellow_leaf_curl';
    else if (lowerDisease.includes('potato') && lowerDisease.includes('early') && lowerDisease.includes('blight')) diseaseType = 'potato_early_blight';
    else if (lowerDisease.includes('potato') && lowerDisease.includes('late') && lowerDisease.includes('blight')) diseaseType = 'potato_late_blight';
    else if (lowerDisease.includes('pepper') && lowerDisease.includes('bacterial')) diseaseType = 'pepper_bacterial_spot';
    else if (lowerDisease.includes('apple') && lowerDisease.includes('scab')) diseaseType = 'apple_scab';
    else if (lowerDisease.includes('apple') && lowerDisease.includes('black') && lowerDisease.includes('rot')) diseaseType = 'apple_black_rot';
    else if (lowerDisease.includes('apple') && lowerDisease.includes('cedar') && lowerDisease.includes('rust')) diseaseType = 'apple_cedar_rust';
    else if (lowerDisease.includes('blight')) diseaseType = 'tomato_late_blight';
    else if (lowerDisease.includes('rust')) diseaseType = 'rust';
    else if (lowerDisease.includes('mold') || lowerDisease.includes('mildew')) diseaseType = 'mold';
    
    const info = treatments[diseaseType][lang] || treatments[diseaseType]['en'];
    
    return {
      disease: info.name,
      confidence: confidence,
      severity: isHealthy ? 'low' : severity,
      treatment: info.treatment,
      prevention: info.prevention
    };
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="disease-detection">
      <div className="detection-header">
        <h2>🔬 Crop Disease Detection</h2>
        <p>Upload a photo of your crop to detect diseases</p>
        
        <div className="language-selector">
          <button 
            className={language === 'en' ? 'active' : ''}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={language === 'ta' ? 'active' : ''}
            onClick={() => setLanguage('ta')}
          >
            தமிழ்
          </button>
          <button 
            className={language === 'hi' ? 'active' : ''}
            onClick={() => setLanguage('hi')}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="upload-section">
        {!imagePreview ? (
          <div className="upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              id="image-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload" className="upload-label">
              <div className="upload-icon">📷</div>
              <p>Click to upload crop image</p>
              <span>Supports JPG, PNG formats</span>
            </label>
          </div>
        ) : (
          <div className="image-preview">
            <img src={imagePreview} alt="Crop" />
            <div className="image-actions">
              <button onClick={analyzeImage} disabled={isAnalyzing}>
                {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Disease'}
              </button>
              <button onClick={resetAnalysis}>🗑️ Remove</button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="result-section">
          <div className={`result-card ${result.severity}`}>
            <h3>Analysis Result</h3>
            <div className="disease-info">
              <p><strong>Disease:</strong> {result.disease}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
              <p><strong>Severity:</strong> {result.severity}</p>
            </div>
            <div className="treatment-info">
              <h4>Recommended Treatment:</h4>
              <p>{result.treatment}</p>
            </div>
            {result.prevention && (
              <div className="prevention-info">
                <h4>Prevention Tips:</h4>
                <p>{result.prevention}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;