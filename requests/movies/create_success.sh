curl -X POST http://localhost:6000/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_VALIDO" \
-d '{
  "title": "Matrix",
  "genre": "Sci-Fi",
  "releaseYear": 1999,
  "rating": 9.0
}'
