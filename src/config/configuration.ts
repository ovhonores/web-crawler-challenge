export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  database: {
    driver: process.env.DB_DRIVER || 'sqlite',
    sqlitePath: process.env.DB_PATH || 'data/hn-crawler.sqlite',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hn-crawler',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
    ttl: parseInt(process.env.CACHE_TTL || '300', 10) || 300,
  },
  crawl: {
    baseUrl: process.env.URLS_TO_CRAWL || 'https://news.ycombinator.com/',
    maxEntries: 30,
  },
});
