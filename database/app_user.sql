-- create app_user table, user is reservered
CREATE TABLE IF NOT EXISTS app_user (
  user_id                 UUID                    DEFAULT uuid_generate_v4(),

  user_name               VARCHAR(255)  NOT NULL  UNIQUE, -- validate no spaces, special chars, symbol, order, etc.
  email                   VARCHAR(255)  NOT NULL  UNIQUE,
  password                VARCHAR(255)  NOT NULL,
  name_first              VARCHAR(255),
  name_last               VARCHAR(255),
  darkmode                BOOLEAN       NOT NULL  DEFAULT false,
  score_scale             SMALLINT      NOT NULL  DEFAULT 100,
  adult_hide              BOOLEAN       NOT NULL  DEFAULT true,
  following               INT[], -- friends?

  created_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP, 
  updated_at              TIMESTAMPTZ   NOT NULL  DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id)
);