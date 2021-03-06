-- tmdb_movie_cast
CREATE TABLE tmdb_movie_cast (
id                        UUID                 DEFAULT uuid_generate_v4(),

tmdb_movie_id             INTEGER NOT NULL,
tmdb_person_id            INTEGER NOT NULL,

adult                     BOOLEAN NOT NULL,
gender                    INTEGER,
known_for_department      TEXT NOT NULL,
name                      TEXT NOT NULL,
original_name             TEXT NOT NULL,
popularity                DECIMAL NOT NULL,
profile_path              TEXT,
cast_id                   INTEGER NOT NULL,
character                 TEXT NOT NULL,
credit_id                 TEXT NOT NULL,
cast_order                INTEGER NOT NULL, -- order is reserved

-- custom fields
created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id),
FOREIGN KEY (tmdb_movie_id)  REFERENCES tmdb_movie(id),
FOREIGN KEY (tmdb_person_id) REFERENCES tmdb_person(id)
);

-- create index for tmdb_movie_id
CREATE INDEX  
ON tmdb_movie_cast(tmdb_movie_id);

-- -- create index for tmdb_person_id
CREATE INDEX 
ON tmdb_movie_cast(tmdb_person_id);