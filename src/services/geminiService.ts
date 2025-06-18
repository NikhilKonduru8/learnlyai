import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey = API_CONFIG.GEMINI_API_KEY;
  private baseUrl = API_CONFIG.GEMINI_BASE_URL;

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data: GeminiResponse = response.data;
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate content');
    }
  }

  async summarizeContent(content: string): Promise<string> {
    const prompt = `Please provide a comprehensive summary of the following content. Focus on the main points, key concepts, and important details:\n\n${content}`;
    return this.generateContent(prompt);
  }

  async generateQuestions(content: string, count: number = 5): Promise<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>> {
    const prompt = `Based on the following content, generate ${count} multiple choice questions. Each question should have 4 options with one correct answer. Format your response as JSON with this structure:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0
      }
    ]
    
    Content: ${content}`;

    try {
      const response = await this.generateContent(prompt);
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating questions:', error);
      // Return fallback questions
      return [{
        question: "What is the main topic of this content?",
        options: ["Topic A", "Topic B", "Topic C", "Topic D"],
        correctAnswer: 0
      }];
    }
  }

  async generateFlashcards(content: string): Promise<Array<{
    front: string;
    back: string;
  }>> {
    const prompt = `Based on the following content, generate flashcards for studying. Create key concept cards with questions on the front and answers on the back. Format as JSON:
    [
      {
        "front": "Question or concept",
        "back": "Answer or explanation"
      }
    ]
    
    Content: ${content}`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return [{
        front: "Key Concept",
        back: "Explanation of the concept"
      }];
    }
  }

  async chatWithContent(content: string, question: string): Promise<string> {
    const prompt = `Based on the following content, please answer this question: "${question}"
    
    Content: ${content}
    
    Please provide a helpful and accurate answer based on the content provided.`;
    
    return this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();