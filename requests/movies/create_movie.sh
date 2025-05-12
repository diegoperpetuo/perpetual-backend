curl -X POST https://movies-crud-three.vercel.app/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTViMjcyNzVmNjcwNDFlZGRjZTJkMCIsImlhdCI6MTc0NzAxNDA2MCwiZXhwIjoxNzQ3MDE3NjYwfQ.mhJN7Urt2vggLCGHkARRtqxpZzHCT7KydNTHCU-R-sQ" \
-d '{
  "title": "Karate Kid",
  "genre": "Fight",
  "releaseYear": 1984,
  "rating": 9.1
}'