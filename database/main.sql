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