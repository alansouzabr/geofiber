#!/bin/bash

echo "=== SIMULANDO LOGIN NO NAVEGADOR ==="

# 1. Fazer login e pegar token
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provedorgamma.com","password":"Admin@12345"}')

TOKEN=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Token obtido: ${TOKEN:0:50}..."

# 2. Simular o que o JavaScript do navegador faria
echo ""
echo "=== O QUE O NAVEGADOR DEVERIA FAZER ==="
echo "1. Receber token: ${TOKEN:0:50}..."
echo "2. Salvar no localStorage: localStorage.setItem('accessToken', token)"
echo "3. Redirecionar para: /dashboard"

# 3. Testar dashboard com o token (simulando o que o navegador faria)
echo ""
echo "=== TESTANDO DASHBOARD COM TOKEN ==="
curl -s -b cookies.txt http://localhost:3001/dashboard | grep -q "Dashboard funcionando"
if [ $? -eq 0 ]; then
    echo "✅ Dashboard está acessível com o cookie!"
else
    echo "❌ Dashboard não está acessível"
fi

# 4. Verificar se o cookie HTTP-only está sendo criado
echo ""
echo "=== VERIFICANDO COOKIE ==="
curl -s -I -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provedorgamma.com","password":"Admin@12345"}' | grep -i "set-cookie"
