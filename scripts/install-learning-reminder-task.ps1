param(
  [string]$TaskPrefix = "AIWeb3School",
  [switch]$WhatIfOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $repoRoot "config/learning-reminder.json"
$reminderScript = Join-Path $PSScriptRoot "wcb-learning-reminder.ps1"

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Missing config file: $configPath"
}

if (-not (Test-Path -LiteralPath $reminderScript)) {
  throw "Missing reminder script: $reminderScript"
}

$config = Get-Content -LiteralPath $configPath -Encoding UTF8 -Raw | ConvertFrom-Json
$powershell = (Get-Command powershell.exe -ErrorAction Stop).Source
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew

foreach ($reminder in @($config.reminders)) {
  if (-not $reminder.enabled) { continue }

  $taskName = "$TaskPrefix-$($reminder.name)"
  $at = [datetime]::Today.Add([TimeSpan]::Parse($reminder.time))
  $argument = "-NoProfile -ExecutionPolicy Bypass -File `"$reminderScript`" -Mode $($reminder.mode) -SendWeixin -CreateDaily"
  $action = New-ScheduledTaskAction -Execute $powershell -Argument $argument -WorkingDirectory $repoRoot
  $trigger = New-ScheduledTaskTrigger -Daily -At $at
  $description = "Daily AI x Web3School learning reminder ($($reminder.mode)) at $($reminder.time)."

  if ($WhatIfOnly) {
    Write-Output "Would register task: $taskName at $($reminder.time), mode=$($reminder.mode)"
    continue
  }

  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description $description -Force | Out-Null
  Write-Output "Registered task: $taskName at $($reminder.time), mode=$($reminder.mode)"
}
