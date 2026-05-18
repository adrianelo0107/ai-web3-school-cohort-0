param(
  [string]$ApiKey
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$localDir = Join-Path $repoRoot ".local"
$keyPath = Join-Path $localDir "wcb-api-key.securestring"

New-Item -ItemType Directory -Force -Path $localDir | Out-Null

if (-not $ApiKey) {
  $secure = Read-Host "WCB API key" -AsSecureString
}
else {
  $secure = ConvertTo-SecureString -String $ApiKey -AsPlainText -Force
}

$secure | ConvertFrom-SecureString | Set-Content -LiteralPath $keyPath -Encoding ASCII
Write-Output "Saved local encrypted WCB API key: $keyPath"

