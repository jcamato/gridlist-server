-- create library movie table
CREATE TABLE IF NOT EXISTS library_movie (
  id                      UUID          DEFAULT uuid_generate_v4(),

  user_id                 UUID, 
  -- movie_id                INTEGER       NOT NULL, -- gridlist movie id

  tmdb_movie_id           INTEGER       NOT NULL,
  library_category_id     SMALLINT      NOT NULL,
  score                   SMALLINT,
  watch_date              DATE, -- TEXT
  watch_count             SMALLINT      NOT NULL  DEFAULT 0,
  -- watch_dates           DATE[],
  private                 BOOLEAN       NOT NULL  DEFAULT false, -- 'secret', or 'visibility'?
  notes                   TEXT,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id)                 REFERENCES app_user(id),
  -- FOREIGN KEY (movie_id)                REFERENCES movie(movie_id), gridlist movie table
  FOREIGN KEY (tmdb_movie_id)           REFERENCES tmdb_movie(id),
  FOREIGN KEY (library_category_id)     REFERENCES library_category(id)
);

-- create index for tmdb_movie_id
CREATE INDEX user_id_idx 
ON library_movie(user_id);