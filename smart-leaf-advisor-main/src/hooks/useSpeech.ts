import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language, t } = useLanguage();

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error(t(
        'Text-to-speech is not supported in your browser',
        'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಪಠ್ಯ-ಟು-ಸ್ಪೀಚ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ'
      ));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = language === 'en' ? 'en-US' : 'kn-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error(t(
        'Failed to play audio',
        'ಆಡಿಯೋ ಪ್ಲೇ ವಿಫಲವಾಗಿದೆ'
      ));
    };

    window.speechSynthesis.speak(utterance);
  }, [language, t]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stopSpeaking, isSpeaking };
};
