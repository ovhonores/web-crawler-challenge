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
      timeout: 10_000,
      headers: {
        'User-Agent': 'hn-crawler-challenge/1.0',
      },
    });
  }

  async fetchHomepage(): Promise<string> {
    const response = await this.http.get<string>(this.baseUrl);
    return response.data;
  }
}
