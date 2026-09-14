import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';

describe('HN Crawler (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /entries', () => {
    it('should return entries filtered by words > 5, sorted by comments', async () => {
      const res = await request(app.getHttpServer() as App)
        .get('/entries?words=5&operator=gt&sortBy=comments&order=desc')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 400 for invalid operator', async () => {
      await request(app.getHttpServer() as App)
        .get('/entries?operator=invalid')
        .expect(400);
    });

    it('should return 400 for invalid words', async () => {
      await request(app.getHttpServer() as App)
        .get('/entries?words=abc')
        .expect(400);
    });
  });

  describe('GET /usage', () => {
    it('should return an array of usage logs', async () => {
      const res = await request(app.getHttpServer() as App)
        .get('/usage')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
