-- sign into postgresql
$ psql -U postgres

-- needed this for genres quering
ALTER system SET jit=off;
SELECT pg_reload_conf();

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
INSERT INTO app_user (username, email, password)
  VALUES ('first', 'first@email.com', 'regularpw');

-- delete table
DROP TABLE name_here;

-- delete row
delete from app_user where username = 'kravek';

delete from tmdb_movie where id = 2061;

-- check types
select column_name, data_type from information_schema.columns
where table_name = 'tmdb_movie';

-- rename column
ALTER TABLE table_name 
RENAME COLUMN column_name TO new_column_name;

-- add column
ALTER TABLE app_user 
ADD COLUMN username_display VARCHAR(24);

-- drop column
ALTER TABLE app_user 
DROP COLUMN username_display;

-- set column's value to another
UPDATE app_user
SET username_display=username
WHERE username_display IS NULL AND username IS NOT NULL;

-- change column type
ALTER TABLE tmdb_person 
ALTER COLUMN imdb_id TYPE TEXT;

-- change column nullable
ALTER TABLE tmdb_person ALTER COLUMN imdb_id DROP NOT NULL;

-- describe table
\d tablename

-- add index
CREATE INDEX tmdb_movie_cast_tmdb_movie_id_idx 
ON tmdb_movie_cast(tmdb_movie_id);

-- drop index
DROP INDEX user_id_idx;
DROP INDEX tmdb_movie_id_idx;

-- list all indices
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- list indices of a table
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'table_name';

-- runtime
EXPLAIN ANALYZE
-- query here