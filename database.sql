--sign into postgresql
$ psql -U postgres
--list databases
# \l
--expanded display
# \x on
--show relations
# \dt

--create database
CREATE DATABASE gridlist;

--delete database
DROP DATABASE name_here;

--connect to database
# \c gridlist
--quit
# \q

--set extention
create extension if not exists "uuid-ossp";

--create app_user table, user is reservered
CREATE TABLE app_user (
  user_id                 UUID                    DEFAULT uuid_generate_v4(),

  user_name               VARCHAR(255)  NOT NULL  UNIQUE,
  email                   VARCHAR(255)  NOT NULL  UNIQUE,
  password                VARCHAR(255)  NOT NULL,
  name_first              VARCHAR(255),
  name_last               VARCHAR(255),
  darkmode                BOOLEAN       NOT NULL  DEFAULT false,
  score_scale             SMALLINT      NOT NULL  DEFAULT 100,
  adult_hide              BOOLEAN       NOT NULL  DEFAULT true,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id)
);

--insert fake users
INSERT INTO app_user (user_name, email, password)
  VALUES ('first', 'first@email.com', 'regularpw');

--create library movie table
CREATE TABLE library_movie (
  library_movie_id        UUID                    DEFAULT uuid_generate_v4(),

  user_id                 UUID,
  tmdb_id                 INTEGER       NOT NULL,
  library_category_id     SMALLINT      NOT NULL,
  score                   SMALLINT,
  watch_date              DATE,
  rewatch_dates           DATE[],
  private                 BOOLEAN       NOT NULL  DEFAULT false,
  notes                   TEXT,

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (library_movie_id),
  FOREIGN KEY (user_id)                 REFERENCES app_user(user_id),
  FOREIGN KEY (library_category_id)     REFERENCES library_category(library_category_id)
);

--create library category table
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
    (1, 'All',            1),
    (2, 'Want to Watch',  2),
    (3, 'Watching',       3),
    (4, 'Watched',        4),
    (5, 'Want to Play',   5),
    (6, 'Playing',        6),
    (7, 'Played',         7),
    (98, 'On Hold',        98),
    (99, 'Unfinished',     99);
  
--create item movie, gridlist entry to store gridlist score, reviews, etc.
-- CREATE TABLE item_movie (
--   item_movie_id           SERIAL,

--   tmdb_id                 INTEGER       NOT NULL,     -- for fetching TMDB specific data
--   score                   SMALLINT,
--   popularity              SMALLINT,

--   created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
--   updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

--   PRIMARY KEY (item_movie_id),
-- );

--delete table
DROP TABLE name_here;

--delete a user
delete from app_user where user_name = 'jacob';

--create todo table
CREATE TABLE todos(
  todo_id SERIAL,
  user_id UUID,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (todo_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--fake todos data
insert into todos (user_id, description) values ('6e80b3d4-2f85-47ee-9bfa-f1684b8aebd1', 'clean room');