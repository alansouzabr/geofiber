#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-https://api.geofibers.com.br}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@provedorgamma.com}"
ADMIN_PASS="${ADMIN_PASS:-Admin@12345}"
COMPANY_ID="${COMPANY_ID:-}"

if [[ -z "${COMPANY_ID}" ]]; then
  echo "ERRO: defina COMPANY_ID antes (export COMPANY_ID=...)"
  exit 1
fi

# precisa do psqlg já definido no shell (como você fez)
command -v psqlg >/dev/null 2>&1 || {
  echo "ERRO: função psqlg não encontrada. Defina psqlg antes de rodar."
  exit 1
}

echo "==> Login ADMIN..."
TOKEN="$(curl -sS -X POST "$API_BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')"
AUTH="Authorization: Bearer $TOKEN"
[[ -n "$TOKEN" ]] || { echo "ERRO: token vazio"; exit 1; }

echo "==> /auth/me (ADMIN)"
curl -sS "$API_BASE/auth/me" -H "$AUTH" | python3 -m json.tool >/dev/null

echo "==> Criar USER..."
USER_EMAIL="user.puro.$(date +%s)@geofibers.local"
USER_PASS="User@12345"

curl -sS -X POST "$API_BASE/users" \
  -H "$AUTH" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$USER_EMAIL\",\"name\":\"User Puro\",\"password\":\"$USER_PASS\",\"isActive\":true}" \
  | python3 -m json.tool >/dev/null

echo "==> Login USER..."
USER_TOKEN="$(curl -sS -X POST "$API_BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASS\"}" \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')"
[[ -n "$USER_TOKEN" ]] || { echo "ERRO: user token vazio"; exit 1; }

echo "==> Seed TECH permissions (idempotente)..."
psqlg -c "
insert into \"Permission\" (id, key, description, \"companyId\", \"createdAt\")
values
 (gen_random_uuid()::text, 'TECH:PROFILE:LIST',  'Listar técnicos', '$COMPANY_ID', now()),
 (gen_random_uuid()::text, 'TECH:PROFILE:READ',  'Ver técnico',     '$COMPANY_ID', now()),
 (gen_random_uuid()::text, 'TECH:PROFILE:WRITE', 'Editar técnico',  '$COMPANY_ID', now())
on conflict (\"companyId\", key) do nothing;" >/dev/null

echo "==> Link TECH perms to ADMIN role (idempotente)..."
psqlg -c "
insert into \"RolePermission\" (id, \"roleId\", \"permissionId\")
select gen_random_uuid()::text, '20fe3c3a-e537-4e6f-90b3-e18cba79823e', p.id
from \"Permission\" p
where p.\"companyId\"='$COMPANY_ID'
  and p.key in ('TECH:PROFILE:LIST','TECH:PROFILE:READ','TECH:PROFILE:WRITE')
  and not exists (
    select 1 from \"RolePermission\" rp
    where rp.\"roleId\"='20fe3c3a-e537-4e6f-90b3-e18cba79823e'
      and rp.\"permissionId\"=p.id
  );" >/dev/null

echo "==> Vincular role USER ao usuário..."
USER_ID="$(psqlg -tA -c "select id from \"User\" where email='$USER_EMAIL';")"
psqlg -c "
insert into \"UserRole\" (id, \"userId\", \"roleId\")
select gen_random_uuid()::text, '$USER_ID', 'acd21626-65da-4fbc-b85a-da0ac7072161'
where not exists (
  select 1 from \"UserRole\"
  where \"userId\"='$USER_ID' and \"roleId\"='acd21626-65da-4fbc-b85a-da0ac7072161'
);" >/dev/null

echo "==> RBAC test: ADMIN must be 200..."
code_admin="$(curl -sS -o /dev/null -w "%{http_code}" "$API_BASE/technicians" -H "$AUTH")"
[[ "$code_admin" == "200" ]] || { echo "FALHA: ADMIN /technicians esperado 200, veio $code_admin"; exit 1; }

echo "==> RBAC test: USER must be 403..."
code_user="$(curl -sS -o /dev/null -w "%{http_code}" "$API_BASE/technicians" -H "Authorization: Bearer $USER_TOKEN")"
[[ "$code_user" == "403" ]] || { echo "FALHA: USER /technicians esperado 403, veio $code_user"; exit 1; }

echo
echo "OK ✅ Smoke RBAC passou"
echo "ADMIN: $ADMIN_EMAIL"
echo "USER : $USER_EMAIL  (senha: $USER_PASS)"
