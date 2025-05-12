curl -X POST http://localhost:5000/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTViMjcyNzVmNjcwNDFlZGRjZTJkMCIsImlhdCI6MTc0NzAwOTQ4NCwiZXhwIjoxNzQ3MDEzMDg0fQ.b1zB8PjKijMN6VTjYXooyGS2ymfpqmgfI5g1dcPouzQ" \
-d '{
  "title": "Karate Kid",
  "genre": "Fight",
  "releaseYear": 1984,
  "rating": 9.1
}'