# Daily Learning Reminders

This repository includes a local Windows reminder workflow for AI x Web3School learning.

## What It Does

- Reads today's course and tasks from `config/learning-reminder.json`.
- Checks today's daily draft at `daily/YYYY-MM-DD.md`.
- Reports whether the draft exists, how many checklist items are done, whether the WCB task has been confirmed, and whether the check-in was marked submitted.
- Shows a Windows popup when installed through Task Scheduler.

## Default Schedule

| Task | Time | Purpose |
| --- | ---: | --- |
| `AIWeb3School-daily-plan` | 09:00 | Today's course and task reminder |
| `AIWeb3School-checkin-status` | 21:30 | Check-in status reminder |

## Install

Run from PowerShell:

```powershell
cd C:\Users\15397\ai-web3-school-cohort-0
.\scripts\install-learning-reminder-task.ps1
```

Preview without installing:

```powershell
.\scripts\install-learning-reminder-task.ps1 -WhatIfOnly
```

## Test Manually

```powershell
.\scripts\daily-learning-reminder.ps1 -Mode Plan -Date 2026-05-17
.\scripts\daily-learning-reminder.ps1 -Mode Checkin -Date 2026-05-17
```

Show a popup:

```powershell
.\scripts\daily-learning-reminder.ps1 -Mode Plan -Notify -CreateDaily
```

## Change Time or Content

Edit `config/learning-reminder.json`.

- `reminders`: reminder time and mode.
- `plan`: date-specific course and tasks.
- `fallbackTasks`: default task list when a date does not have a specific plan.

After changing reminder times, reinstall the scheduled tasks:

```powershell
.\scripts\install-learning-reminder-task.ps1
```

## Uninstall

```powershell
.\scripts\uninstall-learning-reminder-task.ps1
```

## Boundary

WCB Learning login-only course details are not fetched automatically. Add those details manually to `config/learning-reminder.json` after confirming them in the browser.
