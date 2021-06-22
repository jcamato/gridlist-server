CREATE TABLE tmdb_movie (
-- tmdb movie get details fields
adult                     BOOLEAN NOT NULL,
backdrop_path             TEXT,
belongs_to_collection     JSON, -- separate table?
budget                    BIGINT NOT NULL,
genres                    JSON NOT NULL, -- separate table?
homepage                  TEXT,
id                        INTEGER NOT NULL UNIQUE,
imdb_id                   TEXT,
original_language         TEXT NOT NULL,
original_title            TEXT NOT NULL,
overview                  TEXT,
popularity                DECIMAL NOT NULL,
poster_path               TEXT,
production_companies      JSON NOT NULL, -- separate table?
production_countries      JSON NOT NULL, -- separate table?
release_date              TEXT NOT NULL, -- FIX: format: date?
revenue                   BIGINT NOT NULL,
runtime                   INTEGER,
spoken_languages          JSON NOT NULL,  -- separate table?
status                    TEXT NOT NULL, -- allowed values: Rumored, Planned, In Production, Post Production, Released, Cancelled
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

-- changed genres to jsonb for quering
ALTER TABLE tmdb_movie
ALTER COLUMN genres
TYPE jsonb 
USING genres::jsonb;