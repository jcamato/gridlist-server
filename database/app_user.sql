-- create app_user table, user is reservered
CREATE TABLE IF NOT EXISTS app_user (
  id                      UUID          DEFAULT uuid_generate_v4(), -- FIX: SERIAL NOT NULL UNIQUE?

  username                VARCHAR(255)  NOT NULL  UNIQUE, -- validate length, no spaces, special chars, symbol, order, etc.
  email                   VARCHAR(255)  NOT NULL  UNIQUE,
  password                VARCHAR(255)  NOT NULL,
  name_first              VARCHAR(255),
  name_last               VARCHAR(255),
  darkmode                BOOLEAN       NOT NULL  DEFAULT false,
  score_scale             SMALLINT      NOT NULL  DEFAULT 100,
  adult_hide              BOOLEAN       NOT NULL  DEFAULT true,
  -- following               INT[], -- friends, this will be its own table

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);