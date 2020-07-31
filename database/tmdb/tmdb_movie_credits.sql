CREATE TABLE tmdb_movie_credits (
-- tmdb fields
id            INTEGER NOT NULL UNIQUE,
cast_list     JSON NOT NULL, -- cast is reserved
crew          JSON NOT NULL,
-- custom fields
created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);