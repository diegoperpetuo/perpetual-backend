#!/bin/bash

# Script para testar a criação de comentários
# Requer um token de autenticação válido

TOKEN="seu_token_aqui"
API_BASE_URL="http://localhost:5000"

echo "Testando criação de comentário..."

curl -X POST "${API_BASE_URL}/api/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "tmdbId": 550,
    "mediaType": "movie",
    "text": "Este é um comentário de teste sobre o filme Fight Club!"
  }' \
  | jq '.'

echo -e "\n--- Fim do teste ---" 

sleep 100000000