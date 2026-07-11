#!/bin/bash
set -e

# Get Admin Token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@liquidbroker.com","password":"Password123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Got Admin Token"

echo "=== GET /api/admin/stats ==="
curl -s http://localhost:3001/api/admin/stats -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo "=== GET /api/admin/users ==="
curl -s http://localhost:3001/api/admin/users -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

