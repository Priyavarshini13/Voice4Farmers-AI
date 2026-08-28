import os
import time
import logging

logger = logging.getLogger(__name__)

def cleanup_old_audio_files(max_age_minutes=10):
    """Clean up audio files older than max_age_minutes"""
    audio_dir = "audio_files"
    if not os.path.exists(audio_dir):
        return
    
    current_time = time.time()
    max_age_seconds = max_age_minutes * 60
    
    for filename in os.listdir(audio_dir):
        if filename.endswith('.mp3'):
            file_path = os.path.join(audio_dir, filename)
            file_age = current_time - os.path.getctime(file_path)
            
            if file_age > max_age_seconds:
                try:
                    os.remove(file_path)
                    logger.info(f"Cleaned up old audio file: {filename}")
                except Exception as e:
                    logger.error(f"Failed to cleanup {filename}: {e}")