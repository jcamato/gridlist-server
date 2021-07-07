-- create app_user table, user is reservered
CREATE TABLE IF NOT EXISTS app_user (
  id                      UUID          DEFAULT uuid_generate_v4(), -- FIX: SERIAL NOT NULL UNIQUE?

  username                VARCHAR(24)  NOT NULL  UNIQUE, -- FIX: validate length, no spaces, special chars, symbol, order, etc. (cannot be certain words (null, undefined, malicious, etc.) no spaces, certain special characters like _, min length 2, max length 24)
  email                   VARCHAR(255)  NOT NULL  UNIQUE, -- FIX: currently checking for case insensitive uniqueness in server, not through DB definitions
  password                VARCHAR(255)  NOT NULL, -- FIX: validate length, types of characters, no spaces, etc. (min length 8...)
  name_first              VARCHAR(64),
  name_last               VARCHAR(64),
  darkmode                BOOLEAN       NOT NULL  DEFAULT false,
  score_scale             SMALLINT      NOT NULL  DEFAULT 100,
  adult_hide              BOOLEAN       NOT NULL  DEFAULT true,
  -- following               INT[], -- friends, this will be its own table

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);