import os
import logging
import re
import unicodedata
import uuid
import asyncio
from fastapi import FastAPI, Form, Request
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from twilio.twiml.voice_response import VoiceResponse, Gather
import httpx
from deep_translator import GoogleTranslator
from gtts import gTTS
from cleanup import cleanup_old_audio_files
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Twilio Voice RAG Integration")

RAG_API_URL = os.getenv("RAG_API_URL", "https://voice4farmers-api.onrender.com/query")
BASE_URL = os.getenv("BASE_URL", "https://sadye-calescent-ja.ngrok-free.dev")

def clean_tamil_text(text):
    if not text:
        return text
    
    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    
    # Remove weird invisible characters
    text = re.sub(r'[\u200B-\u200D\uFEFF]', '', text)
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

async def generate_tamil_audio(text: str, call_sid: str) -> str:
    """Generate Tamil audio using gTTS and return filename"""
    try:
        # Translate English answer to Tamil (non-blocking)
        tamil_text = await asyncio.to_thread(
            GoogleTranslator(source='en', target='ta').translate, text
        )
        tamil_text = clean_tamil_text(tamil_text)[:200]  # Limit to 200 chars for faster TTS

        logger.info(f"Call {call_sid}: Translated to Tamil: {tamil_text}")

        # Unique filename
        filename = f"tamil_audio_{call_sid}_{uuid.uuid4().hex[:8]}.mp3"
        file_path = os.path.join("audio_files", filename)

        os.makedirs("audio_files", exist_ok=True)

        # Generate MP3 in background thread
        await asyncio.to_thread(
            lambda: gTTS(text=tamil_text, lang='ta').save(file_path)
        )

        logger.info(f"Call {call_sid}: gTTS audio generated: {file_path}")

        return filename

    except Exception as e:
        logger.error(f"Call {call_sid}: gTTS audio generation failed: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    os.makedirs("audio_files", exist_ok=True)
    cleanup_old_audio_files()

# Mount static files for audio serving
app.mount("/audio", StaticFiles(directory="audio_files"), name="audio")

@app.get("/")
async def root():
    return {"status": "Twilio Voice Integration Active", "version": "1.0"}

@app.post("/voice/incoming")
async def incoming_call(request: Request):
    """Handle incoming call - language selection menu"""
    logger.info("=== INCOMING CALL RECEIVED ===")
    
    response = VoiceResponse()
    gather = Gather(
        input="dtmf",
        action="/voice/language",
        method="POST",
        timeout="10"
    )
    gather.say(
        "Welcome to Voice4Farmers. Press 1 for Tamil, Press 2 for Hindi, Press 3 for English.",
        voice="Polly.Aditi",
        language="en-IN"
    )
    response.append(gather)
    response.say("We didn't receive any input. Goodbye.", voice="Polly.Aditi")
    
    return Response(
        content=str(response),
        media_type="application/xml; charset=utf-8"
    )

@app.post("/voice/language")
async def language_selection(
    Digits: str = Form(None),
    From: str = Form(...),
    CallSid: str = Form(...)
):
    """Handle language selection and start speech gathering"""
    logger.info(f"Call {CallSid}: Language selection: {Digits}")
    
    response = VoiceResponse()
    
    lang_map = {
        "1": {"code": "ta", "name": "Tamil", "speech_lang": "ta-IN"},
        "2": {"code": "hi", "name": "Hindi", "speech_lang": "hi-IN"},
        "3": {"code": "en", "name": "English", "speech_lang": "en-IN"}
    }
    
    # Handle multiple digits by taking first digit only
    if Digits and len(Digits) > 1:
        logger.info(f"Call {CallSid}: Multiple digits received '{Digits}', using first digit '{Digits[0]}'")
        Digits = Digits[0]
    
    if Digits not in lang_map:
        logger.warning(f"Call {CallSid}: Invalid digits received: '{Digits}'")
        # Don't redirect, just replay the menu
        gather = Gather(
            input="dtmf",
            action="/voice/language",
            method="POST",
            timeout="10"
        )
        gather.say(
            "Invalid selection. Welcome to Voice4Farmers. Press 1 for Tamil, Press 2 for Hindi, Press 3 for English.",
            voice="Polly.Aditi",
            language="en-IN"
        )
        response.append(gather)
        response.say("We didn't receive any input. Goodbye.", voice="Polly.Aditi")
        return Response(
            content=str(response),
            media_type="application/xml; charset=utf-8"
        )
    
    selected_lang = lang_map[Digits]
    logger.info(f"Call {CallSid}: Selected {selected_lang['name']}")
    
    gather = Gather(
        input="speech",
        action=f"/voice/process?lang={selected_lang['code']}",
        method="POST",
        language=selected_lang["speech_lang"],
        speech_timeout="auto",
        enhanced=True,
        hints="நெல், விவசாயம், உரம், பாசனம், பூச்சி கட்டுப்பாடு, rice, crops, farming, fertilizer, agriculture, cultivation, harvest, irrigation, pest control, tomato, wheat" if selected_lang["code"] == "ta" else "धान, खेती, उर्वरक, सिंचाई, कीट नियंत्रण, rice, crops, farming, fertilizer, agriculture, cultivation, harvest, irrigation, pest control, tomato, wheat" if selected_lang["code"] == "hi" else "rice crops, farming, fertilizer, agriculture, cultivation, harvest, irrigation, pest control, tomato, wheat"
    )
    
    if selected_lang["code"] == "ta":
        try:
            gather.say("Please ask in Tamil.", voice="Polly.Aditi", language="ta-IN")
        except Exception as e:
            logger.error(f"Tamil say failed: {e}")
            gather.say("Please ask your farming question in Tamil.", voice="Polly.Aditi", language="en-IN")
    elif selected_lang["code"] == "hi":
        gather.say("कृपया अपना कृषि प्रश्न हिंदी में पूछें।", voice="Polly.Aditi", language="hi-IN")
    else:
        gather.say("Please ask your farming question.", voice="Polly.Aditi", language="en-IN")
    
    response.append(gather)
    response.say("We didn't receive any input. Goodbye.", voice="Polly.Aditi")
    
    return Response(
        content=str(response),
        media_type="application/xml; charset=utf-8"
    )

@app.post("/voice/process")
async def process_speech(
    SpeechResult: str = Form(None),
    From: str = Form(...),
    CallSid: str = Form(...),
    request: Request = None
):
    """Process speech input and respond with RAG answer"""
    lang = request.query_params.get('lang', 'en')
    logger.info(f"Call {CallSid}: Processing speech in {lang}")
    logger.info(f"Call {CallSid}: Speech input: {SpeechResult}")
    
    response = VoiceResponse()
    
    if not SpeechResult:
        response.say("Sorry, I couldn't hear you. Please try again.", voice="Polly.Aditi")
        response.redirect("/voice/incoming")
        return Response(
            content=str(response),
            media_type="application/xml; charset=utf-8"
        )
    
    try:
        # Translate question to English if needed
        english_question = SpeechResult
        if lang != "en":
            try:
                translated_question = await asyncio.to_thread(
                    GoogleTranslator(source='auto', target='en').translate, SpeechResult
                )
                if translated_question and translated_question.strip():
                    english_question = translated_question
                    logger.info(f"Call {CallSid}: Translated to English: {english_question}")
            except Exception as e:
                logger.error(f"Call {CallSid}: Translation failed: {e}")
        
        # Query RAG API
        async with httpx.AsyncClient(timeout=20.0) as client:
            rag_response = await client.post(
                RAG_API_URL,
                json={
                    "question": english_question,
                    "session_id": From
                }
            )
            rag_response.raise_for_status()
            rag_data = rag_response.json()
        
        answer = rag_data.get("answer", "I couldn't find an answer to your question.")
        logger.info(f"Call {CallSid}: RAG response: {answer}")
        
        # Clean answer for voice
        clean_answer = answer.replace(":", ".").replace("1.", "First,").replace("2.", "Second,").replace("3.", "Third,")
        sentences = clean_answer.split(". ")
        clean_answer = ". ".join(sentences[:2])
        
        # Language-specific responses
        if lang == "ta":
            audio_filename = await generate_tamil_audio(clean_answer, CallSid)

            if audio_filename:
                audio_url = f"{BASE_URL}/audio/{audio_filename}"
                response.play(audio_url)
                logger.info(f"Call {CallSid}: Playing Tamil audio: {audio_url}")
            else:
                response.say("மன்னிக்கவும். சேவையில் சிக்கல் ஏற்பட்டுள்ளது.", 
                             voice="Polly.Aditi", 
                             language="ta-IN")
                
        elif lang == "hi":
            try:
                hindi_response = await asyncio.to_thread(
                    GoogleTranslator(source='en', target='hi').translate, clean_answer
                )
                
                if hindi_response and hindi_response.strip():
                    response.say(hindi_response, voice="Polly.Aditi", language="hi-IN")
                else:
                    response.say(clean_answer, voice="Polly.Aditi", language="en-IN")
                    
            except Exception as e:
                logger.error(f"Hindi translation failed: {e}")
                response.say(clean_answer, voice="Polly.Aditi", language="en-IN")
        else:
            # English response
            logger.info(f"FINAL TEXT SENT TO TWILIO: {repr(clean_answer)}")
            response.say(clean_answer, voice="Polly.Aditi", language="en-IN")
        
        # Ask for follow-up
        gather = Gather(
            input="speech",
            action=f"/voice/process?lang={lang}",
            method="POST",
            language="ta-IN" if lang == "ta" else "hi-IN" if lang == "hi" else "en-IN",
            speech_timeout="auto",
            enhanced=True
        )
        
        if lang == "ta":
            gather.say("வேறு ஏதேனும் கேள்வி உள்ளதா", voice="Polly.Aditi", language="ta-IN")
        elif lang == "hi":
            gather.say("क्या आपका कोई और सवाल है?", voice="Polly.Aditi", language="hi-IN")
        else:
            gather.say("Do you have any other question", voice="Polly.Aditi", language="en-IN")
            
        response.append(gather)
        
        response.say("Thank you. Please call again.", voice="Polly.Aditi", language="en-IN")
        
    except Exception as e:
        logger.error(f"Call {CallSid}: Error: {str(e)}")
        response.say("Sorry, something went wrong. Please try again.", voice="Polly.Aditi")
    
    return Response(
        content=str(response),
        media_type="application/xml; charset=utf-8"
    )

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "twilio-voice-rag"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))