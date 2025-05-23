#!/bin/bash

API_URL="http://localhost:5000/api"
TOKEN="COLE_SEU_TOKEN_AQUI"
TMDB_ID=550

echo "🎬 Adicionando filme $TMDB_ID..."
curl -X POST $API_URL/user/movies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tmdbId\": $TMDB_ID, \"rating\": 4.5, \"favorite\": true}"
echo
