curl -X POST http://localhost:3000/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_VALIDO" \
-d '{"title": "Sem aspas de fechamento}'  # JSON malformado