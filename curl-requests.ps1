Write-Host "Health check:`n"
Invoke-RestMethod -Uri http://localhost:4000/health -Method Get | ConvertTo-Json -Depth 5

Write-Host "`nCreate a new paste:`n"
Invoke-RestMethod -Uri http://localhost:4000/api/pastes -Method Post -ContentType 'application/json' -Body (@{
    content = 'Hello from PowerShell REST test'
    expiration = 'never'
    visibility = 'public'
} | ConvertTo-Json) | ConvertTo-Json -Depth 5

Write-Host "`nReplace PASTE_ID with actual ID to fetch a paste:`n"
Write-Host "Invoke-RestMethod -Uri http://localhost:4000/api/pastes/PASTE_ID -Method Get | ConvertTo-Json -Depth 5"