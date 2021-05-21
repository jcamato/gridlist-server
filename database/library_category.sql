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