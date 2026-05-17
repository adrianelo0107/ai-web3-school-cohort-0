param(
  [string]$Date = (Get-Date -Format "yyyy-MM-dd")
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$target = Join-Path $repoRoot "daily/$Date.md"
$template = Join-Path $repoRoot "templates/daily-checkin.md"

if (Test-Path -LiteralPath $target) {
  Write-Host "Daily check-in already exists: $target"
  exit 0
}

$content = Get-Content -LiteralPath $template -Raw
$content = $content -replace "YYYY-MM-DD", $Date
Set-Content -LiteralPath $target -Value $content -Encoding UTF8
Write-Host "Created: $target"

