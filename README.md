# AI x Web3School Cohort 0 Learning Repository

这是我的 AI x Web3School 公开学习仓库，用来沉淀 Handbook 笔记、每日打卡、产品研究、Hackathon 原型和 Handbook feedback。

This is my public AI x Web3School learning repository for handbook notes, daily check-ins, product research, hackathon prototypes, and handbook feedback.

## Learner Profile

| Item | Value |
| --- | --- |
| AI background | 有基础 / Intermediate |
| Web3 background | 有基础 / Intermediate |
| Programming | 会基础脚本 / Basic scripting |
| Goals | Hackathon + 产品研究 / Hackathon + product research |
| Daily time budget | 2 hours |
| Working language | 双语 / Chinese + English |

## Source Links

- GitHub repository: https://github.com/adrianelo0107/ai-web3-school-cohort-0
- Learning Agent prompt: https://aiweb3.school/learning-agent.zh.txt
- Handbook: https://aiweb3.school/zh/handbook/
- WCB Learning entry: https://web3career.build/zh/programs/AI-Web3-School

## Operating Rules

- This repository is public by default.
- Do not commit secrets, API keys, private wallet keys, seed phrases, private account data, or unpublished team information.
- Daily check-ins are drafted locally first, then manually reviewed before submitting to WCB or social channels.
- Handbook feedback should cite a specific page or section, describe the learning friction, and propose a concrete improvement.
- Hackathon work should keep research, assumptions, prototype notes, and submission materials separated.

## Repository Map

| Path | Purpose |
| --- | --- |
| `profile.md` | Personal learning profile and constraints |
| `learning-plan.md` | 8-week adaptive plan based on Handbook layers |
| `daily/` | Daily check-in drafts |
| `tasks/` | Weekly and daily action lists |
| `experiments/` | Build logs and small prototypes |
| `handbook-feedback/` | Feedback workflow and drafts |
| `hackathon/` | Hackathon idea backlog, product framing, demo notes |
| `submissions/` | Manual submission checklist and copied final drafts |
| `templates/` | Reusable templates |
| `scripts/` | Local helper scripts |
| `config/learning-reminder.json` | Daily reminder schedule and course/task source |
| `docs/reminders.md` | Windows scheduled reminder setup |

## Current Next Actions

1. Confirm today's exact WCB lesson or task after logging into WCB Learning.
2. Update `daily/2026-05-17.md` with the actual lesson link and completion evidence.
3. Pick one hackathon/product research problem for the first 7-day sprint.
4. Capture at least one Handbook feedback item after the first focused reading session.

## Daily Reminders

This repo includes a Windows Task Scheduler reminder workflow that reads WCB platform data and sends WeChat reminders:

```powershell
.\scripts\install-learning-reminder-task.ps1
```

Default reminders:

- 09:00: today's WCB course and task plan
- 21:30: WCB check-in status

See `docs/reminders.md` for testing, editing, and uninstalling.
