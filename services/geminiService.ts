import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, pcmToWav, decodeAudioData } from "../utils/audioUtils";
import { VoiceStyle, GeneratedAudio } from "../types";

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCharacterSpeech = async (
  text: string,
  style: VoiceStyle
): Promise<GeneratedAudio> => {
  // Construct the prompt to guide the style
  const fullPrompt = `${style.promptPrefix} ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: style.geminiVoiceName },
        },
      },
    },
  });

  const candidate = response.candidates?.[0];
  const audioPart = candidate?.content?.parts?.find(p => p.inlineData);

  if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
    throw new Error("No audio data generated.");
  }

  // Decode Base64 to Raw Bytes
  const rawBytes = decodeBase64(audioPart.inlineData.data);
  
  // We need an AudioContext to decode the raw PCM into a Float32 buffer for WAV conversion
  // We create a temporary context just for decoding math.
  const offlineCtx = new OfflineAudioContext(1, 1, 24000); 
  // Note: OfflineAudioContext isn't strictly needed for just math, but we use the helper logic structure.
  // Actually, we can just use the raw bytes directly if we assume they are Int16 PCM.
  // The API returns Int16 PCM at 24kHz.
  
  // Convert Int16 bytes to Float32 for WAV creation logic (which expects Float32 usually in web audio)
  // Or we can just modify pcmToWav to take Int16. 
  // Let's stick to the pipeline: Raw Bytes -> Float32 Array -> WAV Blob.
  
  const audioBuffer = await decodeAudioData(rawBytes, offlineCtx as unknown as AudioContext, 24000, 1);
  const pcmData = audioBuffer.getChannelData(0);
  
  const wavBlob = pcmToWav(pcmData, 24000);
  const audioUrl = URL.createObjectURL(wavBlob);

  return {
    id: crypto.randomUUID(),
    text: text,
    styleName: style.name,
    timestamp: Date.now(),
    audioUrl: audioUrl,
    duration: audioBuffer.duration
  };
};
