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

## Main Tasks

- [x] Set up database
- [x] Create user table
- [x] Create library table
- [x] Create user / library routes
- [x] Connect auth to client
- [ ] Redis for caching and to custom fetch multiple IDs for Library. letterboxd seems to cache entire TMDb library every 30 hours??
- [ ] Cron for scheduled tasks, like above?
- [ ] Work on query generator for filters

- [ ] Restructure API calls for movies, wait until cache figured out
- [ ] Restructure API calls for video games, wait until cache figured out

## Notes

PostgreSQL movie shell, can attach my own fields such as gridlist score, reviews, etc.
Use TMDB to fill some cache of the main information, append to response

Then have middleware and queries for sorting and accessing the data here.
