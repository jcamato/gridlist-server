-- create library movie table
CREATE TABLE IF NOT EXISTS library_movie (
  library_movie_id        UUID                    DEFAULT uuid_generate_v4(),

  user_id                 UUID,
  -- movie_id                INTEGER       NOT NULL,
  tmdb_movie_id           INTEGER       NOT NULL,
  library_category_id     SMALLINT      NOT NULL,
  score                   SMALLINT,
  watch_date              DATE,
  watch_count             SMALLINT,
  -- rewatch_dates           DATE[],
  private                 BOOLEAN       NOT NULL  DEFAULT false, -- 'secret', or 'visibility'?
  -- notes                   TEXT,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (library_movie_id),
  FOREIGN KEY (user_id)                 REFERENCES app_user(user_id),
  -- FOREIGN KEY (movie_id)                REFERENCES movie(movie_id),
  FOREIGN KEY (tmdb_movie_id)           REFERENCES tmdb_movie(id),
  FOREIGN KEY (library_category_id)     REFERENCES library_category(library_category_id)
);