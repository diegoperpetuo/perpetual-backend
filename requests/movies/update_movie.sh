MOVIE_ID="68214a828237fe16e618ffa0"

curl -X PUT http://localhost:5000/movies/$MOVIE_ID \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTViMjcyNzVmNjcwNDFlZGRjZTJkMCIsImlhdCI6MTc0NzAwOTQ4NCwiZXhwIjoxNzQ3MDEzMDg0fQ.b1zB8PjKijMN6VTjYXooyGS2ymfpqmgfI5g1dcPouzQ" \
-d '{
  "title": "Matrix Reloaded",
  "genre": "Action",
  "releaseYear": 2003,
  "rating": 7.0
}'
