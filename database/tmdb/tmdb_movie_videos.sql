CREATE TABLE tmdb_movie_videos (
-- tmdb movie get videos fields
id            INTEGER NOT NULL UNIQUE,
results       JSON NOT NULL,
-- custom fields
created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);