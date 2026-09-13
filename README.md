<p align="center"> <h1>Web crawler challenge </h1></p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
A web crawler built with NestJS and TypeScript that uses web scraping techniques to extract the first 30 entries from Hacker News.

The application provides filtering and sorting operations and stores usage data using SQLite.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API



## Filtering rules



## Architecture

## Design decisions

### NestJS and TypeScript

NestJS was selected because it provides a structured architecture for
building scalable backend applications while TypeScript provides strong
typing and maintainability.

### Axios and Cheerio

Axios is used to retrieve the Hacker News HTML, while Cheerio is used to
parse the server-rendered HTML. Browser automation tools are unnecessary
because Hacker News does not require JavaScript execution to retrieve the
requested data.

### In-memory filtering and sorting

Only the first 30 entries are processed, so filtering and sorting are
performed in memory instead of introducing unnecessary database queries.

### Redis caching

Redis is used as a short-lived shared cache for the scraped entries. This
reduces unnecessary requests to Hacker News and improves response time for
repeated requests.

### SQLite for usage tracking

SQLite is used to persist usage data because the challenge only requires
lightweight persistence and does not require an external database service.

### Repository abstraction

Usage persistence is accessed through a repository interface. This keeps
the business logic independent from the persistence implementation and
allows the storage mechanism to be replaced in the future without changing
the application logic.



## Performance considerations

The crawler retrieves only the first 30 Hacker News entries, so filtering
and sorting are performed in memory.

Redis is used as a short-lived cache for the scraped entries, with a limited
TTL to avoid scraping Hacker News on every request and reduce unnecessary
external requests.

Usage data is persisted separately from the scraped entries using SQLite.

This includes information such as the request timestamp, applied filter,
number of entries returned, and request duration.

## Author

Terry Honores

## License

This project is licensed under the MIT License.
