// src/extractedText.js
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client to use the v1 endpoint for GA models
export const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1'
});

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function extractTextFromBlob(blob) {
  const base64 = await blobToBase64(blob);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        parts: [
          {
            inlineData: { // <-- camelCase!
              mimeType: blob.type, // <-- camelCase!
              data: base64
            }
          },
          {
            text: 'Extract all handwritten text from this image, preserving line breaks.'
          }
        ]
      }
    ]
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(response);
}
