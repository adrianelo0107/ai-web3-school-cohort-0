param(
  [string]$TaskPrefix = "AIWeb3School"
)

$tasks = Get-ScheduledTask -TaskName "$TaskPrefix-*" -ErrorAction SilentlyContinue

if (-not $tasks) {
  Write-Output "No matching scheduled tasks found for prefix: $TaskPrefix"
  exit 0
}

foreach ($task in $tasks) {
  Unregister-ScheduledTask -TaskName $task.TaskName -Confirm:$false
  Write-Output "Removed task: $($task.TaskName)"
}
