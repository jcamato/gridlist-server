CREATE TABLE tmdb_movie_keywords (
-- tmdb movie get keywords fields
id            INTEGER NOT NULL UNIQUE,
keywords      JSON NOT NULL,
-- custom fields
created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);