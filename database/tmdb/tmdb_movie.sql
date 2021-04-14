CREATE TABLE tmdb_movie (
-- tmdb movie get details fields
adult                     BOOLEAN NOT NULL,
backdrop_path             TEXT,
belongs_to_collection     JSON, -- how to handle this object?
budget                    BIGINT NOT NULL,
genres                    JSON NOT NULL, -- this could just be array of genre INTEGERs?
homepage                  TEXT,
id                        INTEGER NOT NULL UNIQUE,
imdb_id                   TEXT,
original_language         TEXT NOT NULL,
original_title            TEXT NOT NULL,
overview                  TEXT,
popularity                DECIMAL NOT NULL,
poster_path               TEXT,
production_companies      JSON NOT NULL, -- how to handle this object?
production_countries      JSON NOT NULL, -- how to handle this object?
release_date              TEXT NOT NULL,
revenue                   BIGINT NOT NULL,
runtime                   INTEGER,
spoken_languages          JSON NOT NULL, -- how to handle this object?
status                    TEXT NOT NULL,
tagline                   TEXT,
title                     TEXT NOT NULL,
video                     BOOLEAN NOT NULL,
vote_average              DECIMAL NOT NULL,
vote_count                BIGINT NOT NULL,
-- custom fields
created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);