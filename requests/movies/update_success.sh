curl -X PUT http://localhost:3000/movies/ID_DO_FILME \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_VALIDO" \
-d '{
  "title": "Matrix Reloaded",
  "genre": "Action",
  "releaseYear": 2003,
  "rating": 7.2
}'