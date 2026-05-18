#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DEFAULT_WCB_BASE_URL = 'https://web3career.build';
const DEFAULT_PROGRAM_SLUG = 'AI-Web3-School';
const DEFAULT_WEIXIN_BASE_URL = 'https://ilinkai.weixin.qq.com';
const ILINK_APP_CLIENT_VERSION = String((2 << 16) | (2 << 8) | 0);

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(args.repoRoot ?? path.join(import.meta.dirname, '..'));
const configPath = path.join(repoRoot, 'config', 'learning-reminder.json');
const config = readJsonIfExists(configPath) ?? {};
const mode = args.mode ?? 'Auto';
const date = args.date ?? formatDateInTimezone(new Date(), config.timezone ?? 'Asia/Shanghai');
const sendWeixin = Boolean(args.sendWeixin);
const createDaily = Boolean(args.createDaily);

const apiKey = process.env.WCB_API_KEY;
if (!apiKey) {
  throw new Error('Missing WCB_API_KEY in environment. Use scripts/wcb-learning-reminder.ps1 so the local encrypted key is loaded.');
}

if (createDaily) {
  ensureDailyDraft({ repoRoot, date });
}

const data = await collectWcbLearningData({
  baseUrl: config.wcb?.baseUrl ?? DEFAULT_WCB_BASE_URL,
  programSlug: config.wcb?.programSlug ?? DEFAULT_PROGRAM_SLUG,
  apiKey,
});

const localDaily = inspectLocalDaily({
  repoRoot,
  date,
  pathTemplate: config.checkin?.dailyPathTemplate ?? 'daily/{date}.md',
});

const message = buildReminderMessage({
  data,
  mode,
  date,
  localDaily,
  learningUrl: config.wcb?.learningUrl ?? `${DEFAULT_WCB_BASE_URL}/zh/programs/${DEFAULT_PROGRAM_SLUG}?tab=learning`,
  profileUrl: config.wcb?.profileUrl ?? `${DEFAULT_WCB_BASE_URL}/zh/profile`,
});

console.log(message);

if (sendWeixin) {
  const result = await sendWeixinMessage({
    content: message,
    repoRoot,
    stateDir: config.weixin?.stateDir ?? process.env.CODEXBRIDGE_STATE_DIR ?? path.join(os.homedir(), '.codexbridge'),
    accountId: config.weixin?.accountId ?? process.env.WEIXIN_ACCOUNT_ID ?? null,
    recipientScopeId: process.env.WEIXIN_SCOPE_ID ?? config.weixin?.recipientScopeId ?? null,
  });
  console.error(`weixin_sent=${result.sentCount}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--send-weixin') {
      parsed.sendWeixin = true;
    } else if (arg === '--create-daily') {
      parsed.createDaily = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      parsed[key] = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

async function collectWcbLearningData({ baseUrl, programSlug, apiKey }) {
  const trpc = createTrpcClient({ baseUrl, apiKey });
  const program = await trpc('program.getById', { idOrSlug: programSlug });
  const programId = program?.id;
  if (!programId) {
    throw new Error(`WCB program id not found for slug: ${programSlug}`);
  }

  const [status, tasks, points, announcements, track] = await Promise.all([
    trpc('icl.getMyProgramStatus', { programId }).catch((error) => ({ error: publicError(error) })),
    trpc('tasks.listForLearner', { programId }).catch((error) => ({ error: publicError(error) })),
    trpc('tasks.myTotalPoints', { programId }).catch((error) => ({ error: publicError(error) })),
    trpc('announcements.listForLearner', { programId }).catch((error) => ({ error: publicError(error) })),
    trpc('tracks.mySelection', { programId }).catch((error) => ({ error: publicError(error) })),
  ]);

  return {
    program,
    programId,
    status,
    tasks: Array.isArray(tasks) ? tasks : [],
    tasksError: tasks?.error ?? null,
    points,
    announcements: Array.isArray(announcements) ? announcements : [],
    announcementsError: announcements?.error ?? null,
    track,
  };
}

function createTrpcClient({ baseUrl, apiKey }) {
  return async function trpc(procedure, json) {
    const url = `${baseUrl.replace(/\/+$/u, '')}/api/trpc/${procedure}?batch=1`;
    const body = JSON.stringify({ 0: { json } });
    const responseText = await fetchTextWithRetry(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        'x-trpc-source': 'nextjs-react',
      },
      body,
      timeoutMs: 20_000,
    });
    const parsed = JSON.parse(responseText);
    const entry = Array.isArray(parsed) ? parsed[0] : parsed;
    if (entry?.error) {
      const message = entry.error?.json?.message ?? entry.error?.message ?? JSON.stringify(entry.error);
      throw new Error(`${procedure}: ${message}`);
    }
    return entry?.result?.data?.json;
  };
}

async function fetchTextWithRetry(url, options, retries = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 500)}`);
      }
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(800 * attempt);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

function buildReminderMessage({ data, mode, date, localDaily, learningUrl, profileUrl }) {
  const program = data.program ?? {};
  const status = isPlainObject(data.status) ? data.status : {};
  const latestAnnouncement = pickLatestAnnouncement(data.announcements);
  const weekNumber = calculateWeekNumber(program.startDate, date);
  const todayCheckin = Array.isArray(status.recentCheckins)
    ? status.recentCheckins.find((item) => item?.date === date)
    : null;
  const checkinText = formatCheckinStatus(todayCheckin?.status);
  const tasks = normalizeTasks(data.tasks);
  const fallbackTasks = buildFallbackTasks({ latestAnnouncement });
  const displayTasks = tasks.length > 0 ? tasks : fallbackTasks;
  const title = mode === 'Checkin'
    ? `AI x Web3School 打卡状态提醒 - ${date}`
    : `AI x Web3School 今日学习提醒 - ${date}`;

  const lines = [
    title,
    '',
    `课程: ${program.title ?? 'AI x Web3 School'} · Week ${weekNumber}`,
    `学习面板: ${learningUrl}`,
  ];

  if (latestAnnouncement?.title) {
    lines.push(`最新公告: ${latestAnnouncement.title}`);
  }

  lines.push('', '今日任务:');
  displayTasks.slice(0, 6).forEach((task, index) => {
    lines.push(`${index + 1}. ${task}`);
  });

  lines.push('', '打卡状态:');
  lines.push(`- 今日平台打卡: ${checkinText}`);
  lines.push(`- 总打卡: ${numberOrZero(status.totalCheckins)} 次`);
  lines.push(`- 学分: ${numberOrZero(status.credits ?? data.points?.points)}`);
  lines.push(`- 本地草稿: ${localDaily.exists ? `已创建 (${localDaily.done}/${localDaily.total})` : '未创建'}`);

  if (status.checkinRange?.start && status.checkinRange?.end) {
    lines.push(`- 打卡周期: ${status.checkinRange.start} ~ ${status.checkinRange.end}`);
  }
  if (status.lastSyncedAt) {
    lines.push(`- 最近同步: ${formatDateTime(status.lastSyncedAt)}`);
  }
  if (status.lastError) {
    lines.push(`- 同步提示: 平台/ICL 最近一次同步返回错误，请稍后在 WCB 手动刷新`);
  }

  lines.push('', '链接:');
  if (status.checkinUrl) {
    lines.push(`- 打卡: ${status.checkinUrl}`);
  }
  if (status.notesUrl) {
    lines.push(`- 笔记: ${status.notesUrl}`);
  }
  lines.push(`- WCB Profile: ${profileUrl}`);

  if (mode === 'Checkin' && todayCheckin?.status !== 'present') {
    lines.push('', '提醒: 今天还没有显示为已打卡。完成任务不等于打卡成功，请检查笔记内容并手动完成打卡。');
  }

  if (data.tasksError) {
    lines.push('', `任务读取提示: ${data.tasksError}`);
  }

  return lines.join('\n');
}

function pickLatestAnnouncement(announcements) {
  if (!Array.isArray(announcements) || announcements.length === 0) {
    return null;
  }
  return [...announcements].sort((a, b) => {
    const pinnedDelta = Number(Boolean(b?.isPinned)) - Number(Boolean(a?.isPinned));
    if (pinnedDelta !== 0) return pinnedDelta;
    return new Date(b?.publishedAt ?? b?.createdAt ?? 0) - new Date(a?.publishedAt ?? a?.createdAt ?? 0);
  })[0];
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return [];
  }
  return tasks.map((task) => {
    const title = task?.title ?? task?.name ?? task?.label ?? task?.taskTitle ?? '未命名任务';
    const status = task?.status ? ` [${task.status}]` : '';
    const due = task?.dueAt ? `，截止 ${formatDateTime(task.dueAt)}` : '';
    return `${title}${status}${due}`;
  });
}

function buildFallbackTasks({ latestAnnouncement }) {
  const tasks = [
    '登录 WCB 学习面板查看 Week 1 课程安排、任务与推荐资源',
    '完成今日学习记录和残酷共学打卡',
    '注意：完成任务不等于打卡成功，需要单独检查打卡状态',
    '预留 1-2 小时推进 Handbook、产品研究或 Hackathon 方向',
  ];
  if (latestAnnouncement?.content?.includes('Co-learning')) {
    tasks.push('准备周一/三/五 Co-learning 或答疑问题');
  }
  return tasks;
}

function inspectLocalDaily({ repoRoot, date, pathTemplate }) {
  const relativePath = pathTemplate.replaceAll('{date}', date);
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) {
    return { exists: false, total: 0, done: 0, relativePath };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/^\s*-\s\[( |x|X)\]\s.+$/gm)];
  return {
    exists: true,
    total: matches.length,
    done: matches.filter((match) => match[1].toLowerCase() === 'x').length,
    relativePath,
  };
}

function ensureDailyDraft({ repoRoot, date }) {
  const target = path.join(repoRoot, 'daily', `${date}.md`);
  if (fs.existsSync(target)) {
    return;
  }
  const template = fs.readFileSync(path.join(repoRoot, 'templates', 'daily-checkin.md'), 'utf8');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, template.replaceAll('YYYY-MM-DD', date), 'utf8');
}

async function sendWeixinMessage({ content, repoRoot, stateDir, accountId, recipientScopeId }) {
  const accountsDir = path.join(stateDir, 'weixin', 'accounts');
  const account = loadWeixinAccount(accountsDir, accountId);
  const context = loadWeixinRecipientContext({ accountsDir, accountId: account.id, recipientScopeId, repoRoot });
  const chunks = splitMessage(content, 1800);
  for (const chunk of chunks) {
    await sendWeixinTextChunk({
      baseUrl: account.baseUrl,
      token: account.token,
      toUserId: context.recipientScopeId,
      contextToken: context.contextToken,
      text: chunk,
    });
    await sleep(1200);
  }
  return { sentCount: chunks.length, recipientScopeId: context.recipientScopeId };
}

function loadWeixinAccount(accountsDir, accountId) {
  if (!fs.existsSync(accountsDir)) {
    throw new Error(`Weixin accounts dir not found: ${accountsDir}`);
  }
  const files = fs.readdirSync(accountsDir)
    .filter((name) => name.endsWith('.json') && !name.endsWith('.context-tokens.json') && !name.endsWith('.sync.json'));
  const selected = accountId
    ? files.find((name) => name === `${accountId}.json` || name.startsWith(`${accountId}.`))
    : files[0];
  if (!selected) {
    throw new Error('No Weixin account file found. Run CodexBridge weixin login first.');
  }
  if (!accountId && files.length > 1) {
    throw new Error('Multiple Weixin accounts found. Set config.weixin.accountId or WEIXIN_ACCOUNT_ID.');
  }
  const filePath = path.join(accountsDir, selected);
  const saved = readJsonIfExists(filePath);
  const token = saved?.token;
  if (!token) {
    throw new Error(`Weixin token missing in account file: ${selected}`);
  }
  const id = selected.replace(/\.json$/u, '');
  return {
    id,
    token,
    baseUrl: saved?.base_url ?? DEFAULT_WEIXIN_BASE_URL,
  };
}

function loadWeixinRecipientContext({ accountsDir, accountId, recipientScopeId, repoRoot }) {
  const localRecipient = readJsonIfExists(path.join(repoRoot, '.local', 'weixin-recipient.json'));
  const desiredScopeId = recipientScopeId ?? localRecipient?.recipientScopeId ?? null;
  const filePath = path.join(accountsDir, `${accountId}.context-tokens.json`);
  const contextTokens = readJsonIfExists(filePath) ?? {};
  const scopeIds = Object.keys(contextTokens);
  const resolvedScopeId = desiredScopeId ?? (scopeIds.length === 1 ? scopeIds[0] : null);
  if (!resolvedScopeId) {
    throw new Error('No Weixin recipient configured. Send one message to the bot or set .local/weixin-recipient.json.');
  }
  const contextToken = contextTokens[resolvedScopeId] ?? null;
  return {
    recipientScopeId: resolvedScopeId,
    contextToken: typeof contextToken === 'string' ? contextToken : null,
  };
}

async function sendWeixinTextChunk({ baseUrl, token, toUserId, contextToken, text }) {
  const body = JSON.stringify({
    msg: {
      from_user_id: '',
      to_user_id: toUserId,
      client_id: `ai-web3school-${crypto.randomUUID()}`,
      message_type: 2,
      message_state: 2,
      item_list: [{
        type: 1,
        text_item: { text },
      }],
      ...(contextToken ? { context_token: contextToken } : {}),
    },
    base_info: {
      channel_version: '2.2.0',
    },
  });
  const raw = await fetchTextWithRetry(`${baseUrl.replace(/\/+$/u, '')}/ilink/bot/sendmessage`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      authorizationtype: 'ilink_bot_token',
      'content-type': 'application/json',
      'ilink-app-clientversion': ILINK_APP_CLIENT_VERSION,
      'ilink-app-id': 'bot',
      'x-wechat-uin': Buffer.from(String(Math.floor(Math.random() * 0xffffffff)), 'utf8').toString('base64'),
    },
    body,
    timeoutMs: 20_000,
  }, 4);
  const result = JSON.parse(raw || '{}');
  if (Number(result?.ret ?? 0) !== 0) {
    throw new Error(`Weixin send failed: ret=${result?.ret ?? 'unknown'}`);
  }
}

function splitMessage(content, maxLength) {
  const lines = String(content ?? '').split('\n');
  const chunks = [];
  let current = '';
  for (const line of lines) {
    const next = current ? `${current}\n${line}` : line;
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = line;
    } else {
      current = next;
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

function calculateWeekNumber(startDate, date) {
  if (!startDate) {
    return 1;
  }
  const start = new Date(String(startDate).slice(0, 10));
  const current = new Date(date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(current.getTime()) || current < start) {
    return 1;
  }
  return Math.floor((current.getTime() - start.getTime()) / 604800000) + 1;
}

function formatCheckinStatus(status) {
  switch (status) {
    case 'present': return '已打卡';
    case 'absent': return '未打卡';
    case 'leave': return '请假';
    case 'pending': return '待同步';
    case undefined:
    case null:
    case '': return '未返回';
    default: return String(status);
  }
}

function formatDateTime(value) {
  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return String(value);
  }
  return dateValue.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
  });
}

function formatDateInTimezone(dateValue, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(dateValue);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function numberOrZero(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function publicError(error) {
  return error instanceof Error ? error.message.replace(/Bearer\s+[A-Za-z0-9._-]+/gu, 'Bearer <redacted>') : String(error);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

