export type TeamMember = {
  name: string;
  email: string;
  role: "owner" | "admin" | "developer" | "viewer";
  avatar: string; // initials
  color: string;
};

export const team: TeamMember[] = [
  { name: "Daniel James", email: "daniel@being.limited", role: "owner", avatar: "DJ", color: "#6A9BCC" },
  { name: "Marina Chen", email: "marina@being.limited", role: "admin", avatar: "MC", color: "#D87756" },
  { name: "Ayo Ogundimu", email: "ayo@being.limited", role: "developer", avatar: "AO", color: "#6DBD45" },
  { name: "Priya Sharma", email: "priya@being.limited", role: "developer", avatar: "PS", color: "#B57FD0" },
  { name: "Caleb Morin", email: "caleb@being.limited", role: "viewer", avatar: "CM", color: "#D9A520" },
];

export type Environment = {
  id: string;
  name: string;
  label: string;
  approvalLevel: "none" | "team-lead" | "vp-eng" | "cto";
  approvalName: string;
  color: string;
};

export const environments: Environment[] = [
  { id: "env_prod", name: "production", label: "Production", approvalLevel: "cto", approvalName: "CTO (Sarah Kim)", color: "hsl(97,59%,46%)" },
  { id: "env_staging", name: "staging", label: "Staging", approvalLevel: "team-lead", approvalName: "Team Lead", color: "hsl(40,71%,50%)" },
  { id: "env_dev", name: "development", label: "Development", approvalLevel: "none", approvalName: "Auto-approved", color: "hsl(210,66%,67%)" },
];

export type KeySource = {
  type: "imported" | "manual";
  provider?: string; // e.g. "Stripe API", "OpenAI", "1Password"
  providerIcon?: string; // emoji or icon identifier
};

export type AccessRequest = {
  id: string;
  keyName: string;
  keyDescription: string;
  project: string;
  environment: "production" | "staging" | "development";
  requestedBy: string; // agent or context name
  reason: string;
  timestamp: string;
  suggestedProject: string;
  suggestedEnvironment: string;
  status: "pending" | "approved" | "denied";
};

export type ConnectedService = {
  name: string;
  icon: string;
  status: "enabled" | "pending" | "disabled";
  keysManaged: number;
  lastAccessed: string | null;
};

export type AgentActivityEntry = {
  timestamp: string;
  action: string;
  agent: string;
  service?: string;
  detail: string;
};

export type ApiKey = {
  id: string;
  name: string;
  description: string;
  project: string;
  prefix: string;
  created: string;
  lastUsed: string;
  lastUsedBy: string;
  status: "active" | "expiring" | "revoked" | "rate-limited";
  environment: "production" | "staging" | "development";
  accessesToday: number;
  accessLimit: number;
  accessHistory: number[]; // last 14 days
  models: string[];
  requestsToday: number;
  tokensToday: { input: number; output: number; cached: number };
  expiresAt: string | null;
  rotationSchedule: string | null;
  ipAllowlist: string[];
  secretsSync: { provider: string; status: "synced" | "pending" | "error" }[];
  recentUsers: string[];
  source: KeySource;
};

export const keys: ApiKey[] = [
  {
    id: "key_1",
    name: "production-api",
    description: "Main production key for emoji.today API and Claude integrations",
    project: "emoji.today",
    prefix: "sk-ant-api03-8kX9...v2Lm",
    created: "2026-01-15",
    lastUsed: "2 min ago",
    lastUsedBy: "Claude (via Daniel)",
    status: "active",
    environment: "production",
    accessesToday: 2847,
    accessLimit: 10000,
    accessHistory: [2420, 1980, 3150, 2810, 2440, 1990, 2720, 2480, 3070, 3230, 2110, 2650, 2350, 2847],
    models: ["claude-opus-4-6", "claude-sonnet-4-5", "claude-haiku-4-5"],
    requestsToday: 2847,
    tokensToday: { input: 1_240_000, output: 890_000, cached: 620_000 },
    expiresAt: null,
    rotationSchedule: "90 days",
    ipAllowlist: ["52.14.0.0/16"],
    secretsSync: [
      { provider: "1Password", status: "synced" },
      { provider: "AWS Secrets Manager", status: "synced" },
    ],
    recentUsers: ["Daniel James", "Marina Chen", "Ayo Ogundimu"],
    source: { type: "manual" },
  },
  {
    id: "key_2",
    name: "dev-key",
    description: "Local development and testing for Being agent",
    project: "being.limited",
    prefix: "sk-ant-api03-Qp7R...nF3k",
    created: "2026-02-20",
    lastUsed: "15 min ago",
    lastUsedBy: "Claude (via Priya)",
    status: "active",
    environment: "development",
    accessesToday: 156,
    accessLimit: 5000,
    accessHistory: [80, 150, 220, 110, 90, 180, 140, 160, 100, 130, 200, 70, 110, 156],
    models: ["claude-opus-4-6", "claude-sonnet-4-5"],
    requestsToday: 156,
    tokensToday: { input: 340_000, output: 210_000, cached: 180_000 },
    expiresAt: "2026-05-20",
    rotationSchedule: "30 days",
    ipAllowlist: [],
    secretsSync: [{ provider: "1Password", status: "synced" }],
    recentUsers: ["Priya Sharma", "Daniel James"],
    source: { type: "imported", provider: "1Password", providerIcon: "🔐" },
  },
  {
    id: "key_3",
    name: "staging-api",
    description: "Staging environment for pre-release testing",
    project: "dillydally.today",
    prefix: "sk-ant-api03-mN2v...xK8j",
    created: "2026-03-01",
    lastUsed: "1 hr ago",
    lastUsedBy: "Claude (via Marina)",
    status: "active",
    environment: "staging",
    accessesToday: 1203,
    accessLimit: 5000,
    accessHistory: [820, 1050, 1310, 780, 1170, 1040, 1290, 1430, 920, 1060, 1300, 1180, 1050, 1203],
    models: ["claude-sonnet-4-5", "claude-haiku-4-5"],
    requestsToday: 1203,
    tokensToday: { input: 780_000, output: 520_000, cached: 410_000 },
    expiresAt: null,
    rotationSchedule: "60 days",
    ipAllowlist: ["34.102.0.0/16", "35.190.0.0/16"],
    secretsSync: [
      { provider: "1Password", status: "synced" },
    ],
    recentUsers: ["Marina Chen", "Ayo Ogundimu"],
    source: { type: "imported", provider: "Vercel" },
  },
  {
    id: "key_4",
    name: "hackathon-demo",
    description: "Temporary key for Unsaid hackathon demo",
    project: "unsaid.to",
    prefix: "sk-ant-api03-7Yz3...bQ1w",
    created: "2026-03-10",
    lastUsed: "3 days ago",
    lastUsedBy: "Caleb Morin",
    status: "expiring",
    environment: "development",
    accessesToday: 0,
    accessLimit: 1000,
    accessHistory: [50, 120, 80, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    models: ["claude-haiku-4-5"],
    requestsToday: 0,
    tokensToday: { input: 0, output: 0, cached: 0 },
    expiresAt: "2026-03-20",
    rotationSchedule: null,
    ipAllowlist: [],
    secretsSync: [],
    recentUsers: ["Caleb Morin"],
    source: { type: "manual" },
  },
  {
    id: "key_5",
    name: "agent-prod",
    description: "Production key for Being autonomous agent",
    project: "being.limited",
    prefix: "sk-ant-api03-Lp4Q...hR9m",
    created: "2026-03-08",
    lastUsed: "8 min ago",
    lastUsedBy: "Claude (autonomous)",
    status: "active",
    environment: "production",
    accessesToday: 87,
    accessLimit: 200,
    accessHistory: [95, 102, 88, 97, 78, 101, 99, 91, 103, 98, 100, 89, 96, 87],
    models: ["claude-sonnet-4-5"],
    requestsToday: 87,
    tokensToday: { input: 210_000, output: 140_000, cached: 95_000 },
    expiresAt: null,
    rotationSchedule: "30 days",
    ipAllowlist: ["95.216.0.0/16"],
    secretsSync: [{ provider: "1Password", status: "synced" }],
    recentUsers: ["Daniel James"],
    source: { type: "imported", provider: "Stripe" },
  },
  {
    id: "key_6",
    name: "internal-testing",
    description: "Legacy testing key — imported from AWS, now revoked",
    project: "emoji.today",
    prefix: "sk-ant-api03-Wx5T...pL2n",
    created: "2025-12-01",
    lastUsed: "2 weeks ago",
    lastUsedBy: "Ayo Ogundimu",
    status: "revoked",
    environment: "development",
    accessesToday: 0,
    accessLimit: 2000,
    accessHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    models: [],
    requestsToday: 0,
    tokensToday: { input: 0, output: 0, cached: 0 },
    expiresAt: "2026-02-28",
    rotationSchedule: null,
    ipAllowlist: [],
    secretsSync: [],
    recentUsers: [],
    source: { type: "imported", provider: "AWS Secrets Manager", providerIcon: "☁️" },
  },
];

export const pendingRequests: AccessRequest[] = [
  {
    id: "req_1",
    keyName: "Datadog API Key",
    keyDescription: "Claude needs read access to query monitoring dashboards and pull error logs for debugging the being.limited production outage.",
    project: "being.limited",
    environment: "staging",
    requestedBy: "Claude Code",
    reason: "Debugging production error spike — need to check Datadog error logs",
    timestamp: "2 min ago",
    suggestedProject: "being.limited",
    suggestedEnvironment: "staging",
    status: "pending",
  },
  {
    id: "req_2",
    keyName: "Resend API Key",
    keyDescription: "Claude needs send access to set up transactional email for the Unsaid onboarding flow.",
    project: "unsaid.to",
    environment: "development",
    requestedBy: "Claude Code",
    reason: "Setting up email verification flow for new user signup",
    timestamp: "18 min ago",
    suggestedProject: "unsaid.to",
    suggestedEnvironment: "development",
    status: "pending",
  },
];

export const connectedServices: ConnectedService[] = [
  { name: "Stripe", icon: "💳", status: "enabled", keysManaged: 2, lastAccessed: "8 min ago" },
  { name: "Vercel", icon: "▲", status: "enabled", keysManaged: 1, lastAccessed: "1 hr ago" },
  { name: "OpenAI", icon: "🤖", status: "enabled", keysManaged: 0, lastAccessed: null },
  { name: "Datadog", icon: "📊", status: "enabled", keysManaged: 0, lastAccessed: null },
  { name: "Supabase", icon: "⚡", status: "pending", keysManaged: 0, lastAccessed: null },
  { name: "Resend", icon: "📧", status: "pending", keysManaged: 0, lastAccessed: null },
];

export const agentActivity: AgentActivityEntry[] = [
  { timestamp: "2026-03-18 14:32:05", action: "Access requested", agent: "Claude Code", service: "Datadog", detail: "Requested read access to Datadog staging key for being.limited" },
  { timestamp: "2026-03-18 14:14:22", action: "Access requested", agent: "Claude Code", service: "Resend", detail: "Requested send access to Resend dev key for unsaid.to" },
  { timestamp: "2026-03-18 14:02:11", action: "Access approved", agent: "Claude Code", service: "Stripe", detail: "Daniel James approved access to Stripe production key" },
  { timestamp: "2026-03-18 13:58:00", action: "Access requested", agent: "Claude Code", service: "Stripe", detail: "Requested read access to Stripe production key for being.limited" },
  { timestamp: "2026-03-18 11:30:00", action: "Access auto-approved", agent: "Claude Code", service: "Vercel", detail: "Development key auto-approved per environment policy" },
  { timestamp: "2026-03-18 09:15:44", action: "Access escalated", agent: "Claude Code", service: "Stripe", detail: "Production access escalated to CTO (Sarah Kim)" },
  { timestamp: "2026-03-17 19:42:11", action: "Access approved", agent: "Claude Code", service: "Vercel", detail: "Marina Chen approved staging access for dillydally.today" },
  { timestamp: "2026-03-17 16:30:00", action: "Key imported", agent: "Daniel James", service: "1Password", detail: "Imported 2 keys from 1Password vault" },
];

export type UsageDataPoint = {
  date: string;
  opus: number;
  sonnet: number;
  haiku: number;
  total: number;
};

export const usageData: UsageDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 17);
  d.setDate(d.getDate() - (29 - i));
  const opus = Math.floor(Math.random() * 800 + 200);
  const sonnet = Math.floor(Math.random() * 1200 + 400);
  const haiku = Math.floor(Math.random() * 600 + 100);
  return {
    date: d.toISOString().split("T")[0],
    opus,
    sonnet,
    haiku,
    total: opus + sonnet + haiku,
  };
});

export type AuditEntry = {
  timestamp: string;
  key: string;
  project: string;
  model: string;
  tokens: number;
  latency: number;
  user: string;
  action: string;
};

export const auditLog: AuditEntry[] = [
  { timestamp: "2026-03-17 14:32:05", key: "production-api", project: "emoji.today", model: "opus-4-6", tokens: 8420, latency: 2340, user: "Daniel James", action: "Code generation" },
  { timestamp: "2026-03-17 14:31:52", key: "staging-api", project: "dillydally.today", model: "sonnet-4-5", tokens: 3200, latency: 890, user: "Marina Chen", action: "Review PR #142" },
  { timestamp: "2026-03-17 14:31:48", key: "agent-prod", project: "being.limited", model: "sonnet-4-5", tokens: 5100, latency: 1120, user: "Claude (autonomous)", action: "Agent task" },
  { timestamp: "2026-03-17 14:31:30", key: "production-api", project: "emoji.today", model: "haiku-4-5", tokens: 1800, latency: 340, user: "Daniel James", action: "Quick edit" },
  { timestamp: "2026-03-17 14:31:15", key: "dev-key", project: "being.limited", model: "opus-4-6", tokens: 12400, latency: 3200, user: "Priya Sharma", action: "Feature build" },
  { timestamp: "2026-03-17 14:30:58", key: "staging-api", project: "dillydally.today", model: "haiku-4-5", tokens: 2100, latency: 280, user: "Ayo Ogundimu", action: "Test generation" },
  { timestamp: "2026-03-17 14:30:41", key: "production-api", project: "emoji.today", model: "sonnet-4-5", tokens: 6800, latency: 1450, user: "Marina Chen", action: "Refactor module" },
  { timestamp: "2026-03-17 14:30:22", key: "agent-prod", project: "being.limited", model: "sonnet-4-5", tokens: 4300, latency: 980, user: "Claude (autonomous)", action: "Monitor check" },
];
