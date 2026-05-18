# Daily Learning Reminders

This repository includes a local Windows reminder workflow for AI x Web3School learning.

## What It Does

- Reads WCB platform data with a local encrypted API key.
- Sends reminders to WeChat through the local CodexBridge Weixin account.
- Falls back to `config/learning-reminder.json` for schedule and local settings.
- Checks today's daily draft at `daily/YYYY-MM-DD.md`.
- Reports whether the draft exists, how many checklist items are done, whether the WCB task has been confirmed, and whether the check-in was marked submitted.

## Local Secrets

Store the WCB API key locally:

```powershell
.\scripts\save-wcb-api-key.ps1 -ApiKey "<your-wcb-api-key>"
```

The key is written to `.local/wcb-api-key.securestring`, which is ignored by Git.

## Default Schedule

| Task | Time | Purpose |
| --- | ---: | --- |
| `AIWeb3School-daily-plan` | 09:00 | Today's WCB course and task reminder via WeChat |
| `AIWeb3School-checkin-status` | 21:30 | WCB check-in status reminder via WeChat |

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

Fetch WCB data and print the message:

```powershell
.\scripts\wcb-learning-reminder.ps1 -Mode Plan -Date 2026-05-18
```

Send to WeChat:

```powershell
.\scripts\wcb-learning-reminder.ps1 -Mode Plan -Date 2026-05-18 -SendWeixin -CreateDaily
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

## WeChat Recipient

The script auto-detects the recipient when the local CodexBridge Weixin account has exactly one context-token scope.

If there are multiple chats, create `.local/weixin-recipient.json`:

```json
{
  "recipientScopeId": "your-weixin-scope-id"
}
```

`.local/` is ignored by Git.

## Boundary

The script can read WCB platform data through the local API key, but it does not submit check-ins automatically. Check-in submission remains manual.
