-- sign into postgresql
$ psql -U postgres

-- list databases
# \l

-- create database
CREATE DATABASE gridlist;

-- set extention
create extension if not exists "uuid-ossp";

-- connect to database
# \c gridlist

-- expanded display
# \x on

-- show relations
# \dt

-- quit
# \q

-- delete database
DROP DATABASE name_here;

-- insert data
INSERT INTO app_user (user_name, email, password)
  VALUES ('first', 'first@email.com', 'regularpw');

-- delete table
DROP TABLE name_here;

-- delete row
delete from app_user where user_name = 'jacob';
  
-- create item movie, gridlist entry to store gridlist score, reviews, etc.
-- CREATE TABLE movie (
--   movie_id                SERIAL,

--   tmdb_id                 INTEGER       NOT NULL,     -- to link for TMDB specific data
--   score                   SMALLINT,
--   popularity              SMALLINT,

--   created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
--   updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

--   PRIMARY KEY (movie_id),
-- );