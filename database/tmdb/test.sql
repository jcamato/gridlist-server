-- WORKS!!
SELECT id, title, genres, popularity
FROM tmdb_movie
CROSS JOIN lateral jsonb_array_elements(genres) id(ele)
WHERE (ele->>'id')::jsonb @> '16'
ORDER BY popularity DESC
LIMIT 10;

-- Testing, WORKS!!
SELECT id, title, genres, vote_average, vote_count
FROM tmdb_movie

CROSS JOIN lateral jsonb_array_elements(genres) id(ele)
WHERE (ele->>'id')::jsonb @> '16'

AND vote_count > 100
ORDER BY vote_average DESC, vote_count DESC
LIMIT 10;


SELECT id, title, genres
FROM tmdb_movie_jsonb
WHERE genres-> @> '{"id": 14, "name": "Fantasy"}'
;
