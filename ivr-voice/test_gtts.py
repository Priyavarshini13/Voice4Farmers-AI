import os
from gtts import gTTS
from deep_translator import GoogleTranslator

def test_gtts():
    print("Testing gTTS Tamil TTS...")
    
    try:
        # Test text
        english_text = "Rice farming requires proper irrigation."
        print(f"English text: {english_text}")
        
        # Translate to Tamil
        tamil_text = GoogleTranslator(source='en', target='ta').translate(english_text)
        print("Tamil translation successful")
        
        # Generate audio
        print("Generating Tamil audio with gTTS...")
        tts = gTTS(text=tamil_text, lang='ta')
        
        # Save test file
        os.makedirs("test_audio", exist_ok=True)
        test_file = "test_audio/gtts_tamil_test.mp3"
        tts.save(test_file)
        
        print(f"Audio generated successfully: {test_file}")
        print(f"File size: {os.path.getsize(test_file)} bytes")
        
        return True
        
    except Exception as e:
        print(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_gtts()
    if success:
        print("\ngTTS integration is working!")
        print("Ready to start the server.")
    else:
        print("\ngTTS integration failed!")