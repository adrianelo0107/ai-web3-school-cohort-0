param(
  [ValidateSet("Auto", "Plan", "Checkin")]
  [string]$Mode = "Auto",

  [string]$Date = (Get-Date -Format "yyyy-MM-dd"),

  [switch]$Notify,

  [switch]$CreateDaily
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $repoRoot "config/learning-reminder.json"

function Get-RelativePathValue {
  param([string]$PathTemplate, [string]$DateValue)
  return ($PathTemplate -replace "\{date\}", $DateValue)
}

function Convert-TaskText {
  param([string]$Text, [string]$DateValue)
  return ($Text -replace "\{date\}", $DateValue)
}

function Get-CheckboxStatus {
  param([string]$DailyPath)

  if (-not (Test-Path -LiteralPath $DailyPath)) {
    return [pscustomobject]@{
      Exists = $false
      Total = 0
      Done = 0
      Lines = @()
    }
  }

  $lines = Get-Content -LiteralPath $DailyPath -Encoding UTF8
  $checkboxes = @()
  foreach ($line in $lines) {
    if ($line -match "^\s*-\s\[( |x|X)\]\s(.+)$") {
      $checkboxes += [pscustomobject]@{
        Done = ($Matches[1] -match "x|X")
        Text = $Matches[2].Trim()
      }
    }
  }

  return [pscustomobject]@{
    Exists = $true
    Total = $checkboxes.Count
    Done = @($checkboxes | Where-Object { $_.Done }).Count
    Lines = $checkboxes
  }
}

function Show-ReminderPopup {
  param(
    [string]$Title,
    [string]$Message,
    [int]$TimeoutSeconds = 90
  )

  try {
    $shell = New-Object -ComObject WScript.Shell
    $null = $shell.Popup($Message, $TimeoutSeconds, $Title, 64)
    return
  }
  catch {
    # Fall back to msg.exe when COM popups are unavailable.
  }

  $msg = Get-Command msg.exe -ErrorAction SilentlyContinue
  if ($msg) {
    & msg.exe $env:USERNAME $Message | Out-Null
  }
}

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Missing config file: $configPath"
}

$config = Get-Content -LiteralPath $configPath -Encoding UTF8 -Raw | ConvertFrom-Json

if ($Mode -eq "Auto") {
  $Mode = if ((Get-Date).Hour -lt 18) { "Plan" } else { "Checkin" }
}

$dailyRelativePath = Get-RelativePathValue -PathTemplate $config.checkin.dailyPathTemplate -DateValue $Date
$dailyPath = Join-Path $repoRoot $dailyRelativePath

if ($CreateDaily -and -not (Test-Path -LiteralPath $dailyPath)) {
  $newDailyScript = Join-Path $PSScriptRoot "new-daily-checkin.ps1"
  if (Test-Path -LiteralPath $newDailyScript) {
    & $newDailyScript -Date $Date | Out-Null
  }
}

$todayPlan = @($config.plan) | Where-Object { $_.date -eq $Date } | Select-Object -First 1
$courseTitle = $config.defaultCourse.title
$courseUrl = $config.defaultCourse.url
$handbookTitle = $config.defaultCourse.handbookTitle
$handbookUrl = $config.defaultCourse.handbookUrl
$tasks = @($config.fallbackTasks | ForEach-Object { Convert-TaskText -Text $_ -DateValue $Date })

if ($todayPlan) {
  if ($todayPlan.course) { $courseTitle = $todayPlan.course }
  if ($todayPlan.courseUrl) { $courseUrl = $todayPlan.courseUrl }
  if ($todayPlan.handbookSection) { $handbookTitle = $todayPlan.handbookSection }
  if ($todayPlan.handbookUrl) { $handbookUrl = $todayPlan.handbookUrl }
  if ($todayPlan.tasks) {
    $tasks = @($todayPlan.tasks | ForEach-Object { Convert-TaskText -Text $_ -DateValue $Date })
  }
}

$checkboxStatus = Get-CheckboxStatus -DailyPath $dailyPath
$dailyContent = if ($checkboxStatus.Exists) { Get-Content -LiteralPath $dailyPath -Encoding UTF8 -Raw } else { "" }
$courseConfirmed = $dailyContent.Contains($config.checkin.courseConfirmedPattern)
$submitted = $dailyContent.Contains($config.checkin.submittedPattern)

if ($checkboxStatus.Exists) {
  $courseText = if ($courseConfirmed) { "confirmed" } else { "not confirmed" }
  $submittedText = if ($submitted) { "submitted" } else { "not submitted" }
  $statusLine = "daily draft: exists; checklist: $($checkboxStatus.Done)/$($checkboxStatus.Total); WCB task: $courseText; check-in: $submittedText"
}
else {
  $statusLine = "daily draft: missing; check-in: not submitted"
}

$title = if ($Mode -eq "Plan") {
  "AI x Web3School Daily Learning Reminder - $Date"
}
else {
  "AI x Web3School Check-in Status Reminder - $Date"
}

$lines = @()
$lines += $title
$lines += ""
$lines += "Course: $courseTitle"
$lines += "Course URL: $courseUrl"
$lines += "Handbook: $handbookTitle"
$lines += "Handbook URL: $handbookUrl"
$lines += ""
$lines += "Tasks:"
for ($i = 0; $i -lt $tasks.Count; $i++) {
  $lines += ("{0}. {1}" -f ($i + 1), $tasks[$i])
}
$lines += ""
$lines += "Check-in status: $statusLine"
$lines += "Daily file: $dailyRelativePath"

if ($Mode -eq "Checkin" -and -not $submitted) {
  $lines += ""
  $lines += "Reminder: today's check-in is not marked as submitted. Review privacy and submit manually to the required WCB channel."
}

$message = $lines -join [Environment]::NewLine
Write-Output $message

if ($Notify) {
  Show-ReminderPopup -Title $title -Message $message
}
