#!/bin/bash

API_URL="http://localhost:5000/api"
TOKEN="COLE_SEU_TOKEN_AQUI"

echo "📃 Listando filmes do usuário..."
curl -X GET $API_URL/user/movies \
  -H "Authorization: Bearer $TOKEN"
echo
