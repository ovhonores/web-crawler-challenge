import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HnClient {
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl =
      this.config.get<string>('crawl.baseUrl') ||
      'https://news.ycombinator.com/';
    this.http = axios.create({
      headers: {
        'User-Agent': 'web-crawler-challenge/1.0',
      },
    });
  }

  async fetchHomepage(): Promise<string> {
    try {
      const response = await this.http.get<string>(this.baseUrl);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        throw new Error(
          `Failed to fetch Hacker News${status ? ` (${status})` : ''}: ${error.message}`,
        );
      }
      console.error('Unexpected error while fetching Hacker News:', error);
      throw error;
    }
  }
}
