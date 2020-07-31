-- create library movie table
CREATE TABLE IF NOT EXISTS library_movie (
  library_movie_id        UUID                    DEFAULT uuid_generate_v4(),

  user_id                 UUID,
  movie_id                INTEGER       NOT NULL, -- this will correspond to Gridlist's single entry for this movie from TMDb
  tmdb_movie_id           INTEGER       NOT NULL, -- this might not be needed if TMDb data is put into movie table
  library_category_id     SMALLINT      NOT NULL,
  score                   SMALLINT,
  watch_date              DATE,
  -- watch_count             SMALLINT,
  -- rewatch_dates           DATE[],
  private                 BOOLEAN       NOT NULL  DEFAULT false,
  notes                   TEXT,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (library_movie_id),
  FOREIGN KEY (user_id)                 REFERENCES app_user(user_id),
  FOREIGN KEY (library_category_id)     REFERENCES library_category(library_category_id)
);

-- create library category table
CREATE TABLE library_category (
  library_category_id     SMALLINT      NOT NULL,
  
  name                    TEXT          NOT NULL,
  list_order              SMALLINT      NOT NULL,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 

  PRIMARY KEY (library_category_id)
);

INSERT INTO library_category (library_category_id, name, list_order)
  VALUES
    (1, 'Want to Watch',  1),
    (2, 'Watching',       2),
    (3, 'Watched',        3),
    (4, 'Want to Play',   4),
    (5, 'Playing',        5),
    (6, 'Played',         6),
    (98, 'On Hold',        98),
    (99, 'Unfinished',     99);