## Previous Steps

```bash
git init
npm init
npm install bcryptjs cors dotenv express jsonwebtoken pg
# nodemon - MDN
npm install --save-dev nodemon
npm install node-fetch igdb-api-node
# body-parser?
# npm install cron ? for scheduled tasks like caching the APIs or backups
# redis
```

## List

- [x] Set up database
- [x] Create user table
- [x] Create library table
- [x] Create user / library routes
- [x] Connect auth to client
- [ ] Redis for caching and to custom fetch multiple IDs for Library
- [ ] Cron for scheduled tasks
- [ ] Set up API calls for movies (still need to work on query string)
- [x] Set up API calls for video games (still need to work on query string)
