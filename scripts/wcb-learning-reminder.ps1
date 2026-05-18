param(
  [ValidateSet("Auto", "Plan", "Checkin")]
  [string]$Mode = "Auto",

  [string]$Date = (Get-Date -Format "yyyy-MM-dd"),

  [switch]$SendWeixin,

  [switch]$CreateDaily
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$keyPath = Join-Path $repoRoot ".local/wcb-api-key.securestring"
$nodeScript = Join-Path $PSScriptRoot "wcb-learning-agent.mjs"
$node = (Get-Command node.exe -ErrorAction Stop).Source

if (-not (Test-Path -LiteralPath $keyPath)) {
  throw "Missing local WCB API key. Run scripts/save-wcb-api-key.ps1 first."
}

if (-not (Test-Path -LiteralPath $nodeScript)) {
  throw "Missing Node reminder script: $nodeScript"
}

$secureText = (Get-Content -LiteralPath $keyPath -Raw).Trim()
$secure = ConvertTo-SecureString $secureText
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $env:WCB_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
}
finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

try {
  $arguments = @(
    $nodeScript,
    "--repo-root", $repoRoot,
    "--mode", $Mode,
    "--date", $Date
  )
  if ($SendWeixin) {
    $arguments += "--send-weixin"
  }
  if ($CreateDaily) {
    $arguments += "--create-daily"
  }
  & $node @arguments
  if ($LASTEXITCODE -ne 0) {
    throw "wcb-learning-agent.mjs failed with exit code $LASTEXITCODE"
  }
}
finally {
  Remove-Item Env:\WCB_API_KEY -ErrorAction SilentlyContinue
}
