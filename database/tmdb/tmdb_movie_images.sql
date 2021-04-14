CREATE TABLE tmdb_movie_images (
-- tmdb movie get images fields
id            INTEGER NOT NULL UNIQUE,
backdrops     JSON NOT NULL,
posters       JSON NOT NULL,
-- custom fields
created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);