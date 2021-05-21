-- create gridlist movie table
CREATE TABLE IF NOT EXISTS movie (
  movie_id                INTEGER       NOT NULL, -- this will correspond to Gridlist's entry for this movie

  tmdb_movie_id           INTEGER       NOT NULL,
  score                   SMALLINT,
  
  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (movie_id),
  FOREIGN KEY (tmdb_movie_id)           REFERENCES tmdb_movie(id)
);