CREATE TABLE tmdb_person (
-- tmdb person get details fields
id                        INTEGER NOT NULL UNIQUE,
birthday                  TEXT,
known_for_department      TEXT NOT NULL,
deathday                  TEXT,
name                      TEXT NOT NULL,
-- also_known_as,         left out since it is an array and don't need now
gender                    INTEGER NOT NULL,
biography                 TEXT,
popularity                DECIMAL NOT NULL,
place_of_birth            TEXT,
profile_path              TEXT,
adult                     BOOLEAN NOT NULL,
imdb_id                   TEXT, -- NOT NULL? this did seem to have null values after storing...
homepage                  TEXT,

-- custom fields
created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);