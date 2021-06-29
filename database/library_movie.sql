-- create library movie table
CREATE TABLE IF NOT EXISTS library_movie (
  id                      UUID          DEFAULT uuid_generate_v4(),

  app_user_id             UUID, 
  -- movie_id                INTEGER       NOT NULL,
  tmdb_movie_id           INTEGER       NOT NULL,
  library_category_id     SMALLINT      NOT NULL,
  score                   SMALLINT,
  watch_date              DATE, -- TEXT
  watch_count             SMALLINT      DEFAULT 0,
  -- rewatch_dates           DATE[],
  private                 BOOLEAN       NOT NULL  DEFAULT false, -- 'secret', or 'visibility'?
  -- notes                   TEXT,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (app_user_id)             REFERENCES app_user(id),
  -- FOREIGN KEY (movie_id)                REFERENCES movie(movie_id), gridlist movie table
  FOREIGN KEY (tmdb_movie_id)           REFERENCES tmdb_movie(id),
  FOREIGN KEY (library_category_id)     REFERENCES library_category(id)
);

-- create index for tmdb_movie_id
CREATE INDEX app_user_id_idx 
ON library_movie(app_user_id);