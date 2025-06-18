import axios from 'axios';

export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';

  async extractContent(wikipediaUrl: string): Promise<string> {
    try {
      // Extract page title from URL
      const urlParts = wikipediaUrl.split('/');
      const pageTitle = urlParts[urlParts.length - 1];

      // Get page content
      const response = await axios.get(
        `${this.baseUrl}/page/summary/${encodeURIComponent(pageTitle)}`
      );

      const summary = response.data.extract;
      
      // Get full content
      const contentResponse = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(pageTitle)}`
      );

      let fullContent = summary + '\n\n';
      
      if (contentResponse.data.sections) {
        contentResponse.data.sections.forEach((section: any) => {
          if (section.text) {
            fullContent += section.text + '\n\n';
          }
        });
      }

      return fullContent;
    } catch (error) {
      console.error('Wikipedia extraction error:', error);
      throw new Error('Failed to extract Wikipedia content');
    }
  }

  isValidWikipediaUrl(url: string): boolean {
    return url.includes('wikipedia.org/wiki/');
  }
}

export const wikipediaService = new WikipediaService();