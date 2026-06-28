#!/bin/bash
#bash curl-requests.sh



# Health check
curl http://localhost:4000/health

echo "\n"

# Create a new paste
curl -X POST http://localhost:4000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from curl","expiration":"never","visibility":"public"}'

echo "\n"

# Replace PASTE_ID with the actual ID returned from create
# curl http://localhost:4000/api/pastes/PASTE_ID
