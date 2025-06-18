import axios from 'axios';
import { API_CONFIG } from '../config/api';

export class AssemblyService {
  private apiKey = API_CONFIG.ASSEMBLY_AI_API_KEY;
  private baseUrl = API_CONFIG.ASSEMBLY_AI_BASE_URL;

  async uploadAudio(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'authorization': this.apiKey,
          'content-type': 'multipart/form-data',
        },
      });

      return response.data.upload_url;
    } catch (error) {
      console.error('Assembly AI Upload Error:', error);
      throw new Error('Failed to upload audio');
    }
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      // Start transcription
      const transcriptResponse = await axios.post(
        `${this.baseUrl}/transcript`,
        {
          audio_url: audioUrl,
          speaker_labels: true,
        },
        {
          headers: {
            'authorization': this.apiKey,
            'content-type': 'application/json',
          },
        }
      );

      const transcriptId = transcriptResponse.data.id;

      // Poll for completion
      return this.pollTranscription(transcriptId);
    } catch (error) {
      console.error('Assembly AI Transcription Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  private async pollTranscription(transcriptId: string): Promise<string> {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(`${this.baseUrl}/transcript/${transcriptId}`, {
          headers: {
            'authorization': this.apiKey,
          },
        });

        const { status, text } = response.data;

        if (status === 'completed') {
          return text;
        } else if (status === 'error') {
          throw new Error('Transcription failed');
        }

        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        console.error('Polling error:', error);
        throw new Error('Failed to get transcription status');
      }
    }

    throw new Error('Transcription timeout');
  }
}

export const assemblyService = new AssemblyService();