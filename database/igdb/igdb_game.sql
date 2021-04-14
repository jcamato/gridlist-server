CREATE TABLE igdb_game (
-- igdb game with certain fields expanded
id                        INTEGER NOT NULL UNIQUE,
age_ratings               JSON,
aggregated_rating         DECIMAL,
aggregated_rating_count   BIGINT,
alternative_names         JSON,
artworks                  JSON,
bundles                   BIGINT[], 
category                  INTEGER,
collection                JSON,
cover                     JSON,
created_at_igdb           BIGINT, --TIMESTAMPTZ?
expansions                BIGINT[], 
external_games            JSON,
first_release_date        BIGINT, --TIMESTAMPTZ?
follows                   BIGINT,
franchises                JSON,
game_engines              JSON, 
game_modes                JSON, 
genres                    JSON,
hypes                     BIGINT,
involved_companies        JSON, 
keywords                  JSON, 
name                      TEXT,
platforms                 JSON, 
player_perspectives       JSON,
rating                    DECIMAL,
rating_count              BIGINT,
release_dates             JSON, 
screenshots               JSON,
similar_games             BIGINT[], 
slug                      TEXT,
summary                   TEXT,
tags                      BIGINT[], 
themes                    JSON, 
total_rating              DECIMAL,
total_rating_count        BIGINT,
updated_at_igdb           BIGINT, --TIMESTAMPTZ? -- use this field as part of schedule to check if updated in the API
url                       TEXT,
videos                    JSON, 
websites                  JSON,
checksum                  UUID,
-- custom fields
created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 
updated_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, 

PRIMARY KEY (id)
);