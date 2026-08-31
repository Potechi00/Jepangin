/**
 * Audio helper for Japanese pronunciation & UI feedback
 * Pure Web Speech API with no Web Audio synthesis or procedural audio processing
 */

/**
 * Speak Japanese text using Web Speech API
 */
export function speakJapanese(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = rate; // Slightly slower for clear beginner listening
      utterance.pitch = 1.0;

      // Try to find a Japanese voice
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Lightweight silent UI sound placeholder - no Web Audio oscillators or synthetic sound processing
 */
export function playSound(_type: 'correct' | 'wrong' | 'click' | 'complete' | 'level_up'): void {
  // Pure no-op to ensure zero audio artifacts, zero oscillators, and zero Web Audio processing
}

