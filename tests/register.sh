#!/bin/bash

API_URL="http://localhost:5000/api"
EMAIL="teste@exemplo.com"
PASSWORD="123456"

echo "🟡 Registrando usuário..."
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}"
echo
