import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let isGeminiQuotaExceeded = false;
let lastQuotaCheckTime = 0;
const QUOTA_COOLDOWN = 1000 * 60 * 60; // Wait 1 hour before trying Gemini again after a 429

export async function speakJapanese(text: string) {
  // If we know quota is exceeded, skip directly to fallback
  if (isGeminiQuotaExceeded && Date.now() - lastQuotaCheckTime < QUOTA_COOLDOWN) {
    webSpeechFallback(text);
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Pronounce clearly in Japanese: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Clean, natural voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      // Reset quota status on success
      isGeminiQuotaExceeded = false;
      
      const audioBlob = base64ToBlob(base64Audio, 'audio/pcm');
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
      }
      
      const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error: any) {
    // Check for 429 Resource Exhausted
    if (error?.message?.includes('429') || error?.status === 429 || error?.toString().includes('RESOURCE_EXHAUSTED')) {
      if (!isGeminiQuotaExceeded) {
        console.warn("Gemini TTS quota exceeded. Switching to Browser Web Speech for this session.");
      }
      isGeminiQuotaExceeded = true;
      lastQuotaCheckTime = Date.now();
    } else {
      console.error("Gemini TTS failed:", error);
    }
    
    webSpeechFallback(text);
  }
}

function base64ToBlob(base64: string, type: string) {
  const bin = atob(base64);
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return new Blob([arr], { type });
}

function webSpeechFallback(text: string) {
  if (!('speechSynthesis' in window)) return;

  // Clear any pending speech
  window.speechSynthesis.cancel();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja')) || voices.find(v => v.lang.includes('JP'));
    
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  // Chrome/Safari often have issues with voices not being ready
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
      window.speechSynthesis.onvoiceschanged = null; // Prevent double trigger
    };
  } else {
    speak();
  }
}

export function speakRomaji(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Romaji is read phonetically in English usually for English speakers
    window.speechSynthesis.speak(utterance);
  }
}
