#!/bin/bash

# Script para testar a exclusão de comentários
# Requer um token de autenticação válido e ID do comentário

TOKEN="seu_token_aqui"
COMMENT_ID="id_do_comentario_aqui"
API_BASE_URL="http://localhost:5000"

echo "Testando exclusão de comentário..."

curl -X DELETE "${API_BASE_URL}/api/comments/${COMMENT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'

echo -e "\n--- Fim do teste ---" 