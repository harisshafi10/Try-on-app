
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToGenerativePart } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateVirtualTryOn = async (userImage: File, outfitImage: File): Promise<string> => {
  if (!userImage || !outfitImage) {
    throw new Error('User image and outfit image must be provided.');
  }

  const model = 'gemini-2.5-flash-image-preview';

  const userImagePart = await fileToGenerativePart(userImage);
  const outfitImagePart = await fileToGenerativePart(outfitImage);

  const prompt = `
    This is a virtual try-on task. The first image is the person. The second image is the outfit.
    Please replace the clothes on the person in the first image with the outfit from the second image.
    It is crucial to keep the person's face, hair, and the original background completely untouched.
    The new outfit should realistically fit the person's pose and body shape, including natural-looking shadows and lighting to match the original photo's environment.
    The final result must be a photorealistic image of only the person wearing the new outfit.
  `;

  const contents = {
    parts: [
      { text: prompt },
      userImagePart,
      outfitImagePart,
    ],
  };
  
  const config = {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
  };

  try {
    const response = await ai.models.generateContent({ model, contents, config });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          return `data:${mimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    
    throw new Error("No image found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image. The model may have refused the request. Please try different images.");
  }
};
