# Substitua pelo seu usuário e senha válidos
EMAIL="amanda@email.com"
PASSWORD="1234567"

# URL da API
URL="http://localhost:5000/auth/login"

# Faz login e extrai o token do JSON de resposta
TOKEN=$(curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}" | jq -r .token)

# Verifica se o token foi extraído corretamente
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Erro: token não obtido. Verifique o login."
fi

# Exporta o token para uso em outros scripts
export TOKEN
echo "Token JWT exportado com sucesso:"
echo $TOKEN