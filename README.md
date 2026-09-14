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

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/entries` | Get filtered entries from Hacker News |
| `GET` | `/usage` | Get recent usage logs |
| `GET` | `/api` | Swagger UI (interactive documentation) |

### `GET /entries`

Fetches the top 30 entries from Hacker News, applies the given filtering and
sorting rules, and returns the result.

**Query parameters:**

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `words` | integer ≥ 0 | `5` | Number of words to compare |
| `operator` | `gt`, `gte`, `lt`, `lte`, `eq` | `gt` | Comparison operator |
| `sortBy` | `points`, `comments`, `number` | `comments` | Field to sort by |
| `order` | `asc`, `desc` | `desc` | Sort direction |

**Example request:**

```bash
curl "http://localhost:3000/entries?words=5&operator=gt&sortBy=comments&order=desc"
```

### GET /usage

Returns the most recent usage logs from SQLite.

Query parameters:

Parameter	Default	Description
limit	100	Maximum number of records to return
Example request:

```bash
curl "http://localhost:3000/usage?limit=10"
```


## Filtering rules

The challenge defines two filtering strategies. Both operate on the same
30 entries fetched from Hacker News.

### Filter A — More than 5 words, sorted by comments

- Keep entries whose title has **more than 5 words**.
- Sort by **number of comments** (descending).

```bash
GET /entries?words=5&operator=gt&sortBy=comments&order=desc
```
### Filter B — 5 or fewer words, sorted by points
Keep entries whose title has 5 or fewer words.

Sort by points (descending).

```bash
GET /entries?words=5&operator=lte&sortBy=points&order=desc
```
## Architecture

The project follows a **feature-based** organization, aligned with NestJS
conventions.

## Design decisions

### 1. Feature-based modules (not layer-based)

Modules are organized by **feature**, not by technical layer.

**Why:**
- NestJS is built around modules, not layers. Each module encapsulates its own controller, service, DTOs, and tests.
- Feature-based organization improves **cohesion**: everything related to crawling lives in `crawler/`.
- It **scales** better: adding a new feature means adding a new folder, not touching five existing ones.
- It follows the **official NestJS convention** and industry practice (Angular, DDD, Clean Architecture).

**Trade-off:** a developer unfamiliar with the codebase must know that `*.controller.ts` files define HTTP routes. This is mitigated by the endpoint table below and by NestJS's own conventions.

---

### 2. `database/` — Infrastructure module

`database/` does not expose HTTP endpoints. It configures the persistence layer (TypeORM + SQLite) and provides repository implementations.

**Why:**
- **Separation of concerns:** `usage-logs/` should not know how the database is configured, only that a repository exists.
- **Testability:** features can be tested with a mocked repository.
- **Flexibility:** switching from SQLite to MongoDB means changing `database/` only.

**Pattern:** Repository Pattern + Dependency Inversion. `UsageLogsService` depends on the `UsageLogRepository` interface, not on TypeORM.

**Structure:**
````text
src/database/
├── entities/
│ └── usage-log.interface.ts # Domain contract (no ORM dependency)
├── repositories/
│ ├──── usage-log.repository.ts # Repository interface + injection token
│ └── sqlite/
│ ├──── usage-log.entity.ts # TypeORM entity (@Entity)
│ └──── sqlite-usage-log.repository.ts # SQLite implementation
│ └──── sqlite-usage-log.repository.spec.ts #(npm run test -- sqlite-usage-log.repository)
└── database.module.ts # Dynamic module with provider binding

````

**Decisions made in this module:**
- **SQLite over MongoDB:** zero configuration, portable, single file at `./data/hn-crawler.sqlite`. No server or container required.
- **Repository Pattern:** `UsageLogsService` depends on `UsageLogRepository` (interface), not on TypeORM. This allows swapping SQLite for MongoDB by implementing a new class and changing one provider in `DatabaseModule`.
- **Injection token (`USAGE_LOG_REPOSITORY`):** a `Symbol` used to inject the repository implementation, keeping the service decoupled from the concrete class.
- **`synchronize: true`:** TypeORM creates tables automatically from entities. Acceptable for a challenge; in production, migrations would be used.
- **Centralized config:** the SQLite path is read from `ConfigService` (`database.sqlitePath`), which comes from `.env` (`DB_PATH`). No hardcoded paths.
- **`data/.gitkeep`:** the `data/` folder is committed so the SQLite file has a place to live, but `*.sqlite` files are gitignored.

**How to switch to MongoDB:**
1. Create `MongoUsageLogRepository` implementing `UsageLogRepository`.
2. Add the Mongoose branch in `DatabaseModule`.
3. Set `DB_DRIVER=mongodb` in `.env`.
4. `UsageLogsService` remains untouched.
---

### 3. `cache/` — Cross-cutting concern

`cache/` configures Redis via `@nestjs/cache-manager` and exposes it globally.


**Why Redis at all:**
- The crawler hits an external site. Caching the result for 5 minutes avoids unnecessary requests and improves response time.
- The assignment mentions "track crawler behavior" — responsible crawling includes not hammering the source.


### How it works

1. `CrawlerService.getTopEntries()` checks Redis for the key `hn:top:30`.
2. On cache hit, returns the cached entries.
3. On cache miss, fetches from HN, parses, and stores the result in Redis.

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `CACHE_TTL` | `300` | Cache TTL in seconds |

### Running Redis

```bash
docker compose --profile local up -d
```
---

### 4. `crawler/` — Fetch and parse Hacker News

Encapsulates two distinct responsibilities

The `crawler/` module fetches and parses the top 30 entries from
[Hacker News](https://news.ycombinator.com/).

#### Responsibilities
```
| File                 | Responsibility 
|-------------------   |----------------
| `entry.parser.ts`    | Extract `number`, `title`, `points`, and `comments` from Hacker News HTML using Cheerio     

| `hn.client.ts`       | HTTP GET to HN (axios, 10s timeout, custom User-Agent) 
| `hn.parser.ts`       | Call  EntryParser 
| `hn-selectors.ts`    | Centralized CSS selectors 
| `crawler.service.ts` | Orchestrate client + parser 
```
#### Domain type

```typescript
export const HN_SELECTORS = {
  entry: 'tr.athing',
  rank: 'span.rank',
  title: 'span.titleline > a',
  subtext: 'td.subtext',
  points: 'span.score',
  comments: 'a[href^="item?id="]',
} as const;
```



### 5. `filters/` — Business logic

To make the search more robust and maintainable, I decided to define specific filters based on the requirements. This approach allows us to implement the two required filters while keeping the filtering logic reusable and extensible for future filtering criteria.


Applies the two filtering operations required by the assignment:
- More than 5 words → ordered by comments.
- Fewer than or equal to 5 words → ordered by points.

**Dependencies:** `filters/` consumes `CrawlerService` (to get entries) and `UsageLogsService` (to log usage).
#### Query parameters
```
| Parameter  | Values        | Default | Description |
|----------- |---------------|---------|-------------|
| `words`    | integer ≥ 0   | `5`     | Number of words to compare |
| `operator` | `gt`, `gte`, `lt`, `lte`, `eq` | `gt` | Comparison operator |
| `sortBy`   | `points`, `comments`, `number` | `comments` | Field to sort by |
| `order`    | `asc`, `desc` | `desc`  | Sort direction |
```
#### Examples

```bash
# More than 5 words, sorted by comments desc (challenge filter A)
curl "http://localhost:3000/entries?words=5&operator=gt&sortBy=comments&order=desc"

# Fewer or equal to 5 words, sorted by points desc (challenge filter B)
curl "http://localhost:3000/entries?words=5&operator=lte&sortBy=points&order=desc"

# All entries, sorted by points ascending
curl "http://localhost:3000/entries?words=0&operator=gte&sortBy=points&order=asc"
```
####  Word counting rule
The challenge requires counting only spaced words and excluding symbols:

"This is - a self-explained example" → 5 words

Implementation in word-counter.ts:

```typescript
export const wordCount = (title: string): number =>
  title
    .split(/\s+/) // Split by one or more whitespace characters
    .filter((token) => /[a-zA-Z0-9]/.test(token)) // Matches any letter (uppercase or lowercase) or digit
    .length;

```
### 6. `usage-logs/` — Persist API usage

Persists every API interaction: timestamp, applied filter, and additional metadata.

**Why:**
- The assignment explicitly requires storing usage data.
- It is a **cross-cutting concern**: `filters/` logs usage, and future features might too.
- It follows the Repository Pattern: `UsageLogsService` depends on `UsageLogRepository`, not on TypeORM directly.

**Fields stored:**
- `timestamp` (required by the assignment)
- `filter` (required by the assignment)
- `entriesReturned`, `executionMs`, `userAgent`, `ip` (extra fields to track crawler behavior)
##### Usage logging
Every request logs the applied filter as a serialized string:
words=5&operator=gt&sortBy=comments&order=desc

Inspect logs with GET /usage.

---

### 8. `config/` — Utility, not a module

`config/` contains `configuration.ts`, a plain function that exports environment-based configuration.

**Why:**
- Configuration is **not a feature**; it is a utility consumed by `ConfigModule.forRoot()`.
- It does not need a controller, service, or module of its own.

---

## Module Summary

| Module | Type | Responsibility | Exposes HTTP? |
|--------|------|----------------|---------------|
| `crawler` | Feature | Fetch and parse HN | Yes (optional) |
| `filters` | Feature | Apply filters and sorting | Yes |
| `usage-logs` | Feature | Persist usage data | Yes |
| `database` | Infrastructure | Configure persistence | No |
| `cache` | Infrastructure | Configure Redis | No |
| `config` | Utility | Centralize env config | No |
| `common` | Utility | Shared pure functions (e.g. `withTimeout`) | No |
---

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


## Testing

The project uses **Jest** for both unit and end-to-end tests.

### Run tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Unit tests with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```





## Performance considerations

The crawler retrieves only the first 30 Hacker News entries, so filtering
and sorting are performed in memory.

Redis is used as a short-lived cache for the scraped entries, with a limited
TTL to avoid scraping Hacker News on every request and reduce unnecessary
external requests.

Usage data is persisted separately from the scraped entries using SQLite.

This includes information such as the request timestamp, applied filter,
number of entries returned, and request duration.

### Dependency Security

Transitive dependencies pulled in by the NestJS scaffold contained known vulnerabilities
reported by `npm audit` (moderate to high severity).

**Decision:** Instead of running `npm audit fix --force` (which would force breaking major-version
upgrades), `overrides` were added to `package.json` to pin patched versions within the same
major range:

```json
"overrides": {
  "path-to-regexp": "^8.0.0",
  "uuid": "^11.1.1",
  "multer": "^2.3.0"
}
```

## API Documentation (Swagger)

The API is documented with **Swagger (OpenAPI)** and available at:
http://localhost:3000/api

### What you can do

- Browse all endpoints with their parameters and response schemas.
- Test any endpoint directly from the browser using the **"Try it out"** button.
- See examples for each query parameter.

### Endpoints documented

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/entries` | Get filtered entries from Hacker News |
| `GET` | `/usage` | Get recent usage logs |

### Query parameters for `GET /entries`

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `words` | integer ≥ 0 | `5` | Number of words to compare |
| `operator` | `gt`, `gte`, `lt`, `lte`, `eq` | `gt` | Comparison operator |
| `sortBy` | `points`, `comments`, `number` | `comments` | Field to sort by |
| `order` | `asc`, `desc` | `desc` | Sort direction |

### Example

Open `http://localhost:3000/api`, click on `GET /entries`, press **"Try it out"**,
and use:

```json
{
  "words": 5,
  "operator": "gt",
  "sortBy": "comments",
  "order": "desc"
}
```
## Author

Terry Honores

## License

This project is licensed under the MIT License.
