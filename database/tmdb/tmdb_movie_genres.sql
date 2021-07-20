-- tmdb_movie_genres
CREATE TABLE tmdb_movie_genres (
-- id      UUID                    DEFAULT uuid_generate_v4(),
id                        TEXT NOT NULL UNIQUE, -- "tmdb_movie_id-tmdb_movie_genre_id"

tmdb_movie_id             INTEGER NOT NULL,
tmdb_movie_genre_id       INTEGER NOT NULL,

-- custom fields
created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id),
FOREIGN KEY (tmdb_movie_id)           REFERENCES tmdb_movie(id),
FOREIGN KEY (tmdb_movie_genre_id)     REFERENCES tmdb_movie_genre(id)
);

-- create index for tmdb_movie_id
CREATE INDEX
ON tmdb_movie_genres(tmdb_movie_id);

-- CREATE INDEX tmdb_movie_genres_tmdb_movie_id_idx 
-- ON tmdb_movie_genres(tmdb_movie_id);