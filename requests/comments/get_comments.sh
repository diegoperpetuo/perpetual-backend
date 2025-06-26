#!/bin/bash

# Script para testar a busca de comentários
# Não requer autenticação

API_BASE_URL="http://localhost:5000"

echo "Testando busca de comentários..."

curl -X GET "${API_BASE_URL}/api/comments?tmdbId=550&mediaType=movie" \
  -H "Content-Type: application/json" \
  | jq '.'

echo -e "\n--- Fim do teste ---" 