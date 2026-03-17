export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: "active" | "expiring" | "revoked" | "rate-limited";
  environment: "production" | "staging" | "development";
  spendToday: number;
  spendLimit: number;
  spendHistory: number[]; // last 14 days
  models: string[];
  requestsToday: number;
  tokensToday: { input: number; output: number; cached: number };
  expiresAt: string | null;
  rotationSchedule: string | null;
  ipAllowlist: string[];
  secretsSync: { provider: string; status: "synced" | "pending" | "error" }[];
};

export const keys: ApiKey[] = [
  {
    id: "key_1",
    name: "production-api",
    prefix: "sk-ant-api03-8kX9...v2Lm",
    created: "2026-01-15",
    lastUsed: "2 min ago",
    status: "active",
    environment: "production",
    spendToday: 47.82,
    spendLimit: 500,
    spendHistory: [42, 38, 55, 61, 44, 39, 52, 48, 57, 63, 41, 50, 45, 48],
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
  },
  {
    id: "key_2",
    name: "claude-code-dev",
    prefix: "sk-ant-api03-Qp7R...nF3k",
    created: "2026-02-20",
    lastUsed: "15 min ago",
    status: "active",
    environment: "development",
    spendToday: 12.45,
    spendLimit: 100,
    spendHistory: [8, 15, 22, 11, 9, 18, 14, 16, 10, 13, 20, 7, 11, 12],
    models: ["claude-opus-4-6", "claude-sonnet-4-5"],
    requestsToday: 156,
    tokensToday: { input: 340_000, output: 210_000, cached: 180_000 },
    expiresAt: "2026-05-20",
    rotationSchedule: "30 days",
    ipAllowlist: [],
    secretsSync: [{ provider: "1Password", status: "synced" }],
  },
  {
    id: "key_3",
    name: "leftway-prod",
    prefix: "sk-ant-api03-mN2v...xK8j",
    created: "2026-03-01",
    lastUsed: "1 hr ago",
    status: "active",
    environment: "production",
    spendToday: 28.17,
    spendLimit: 200,
    spendHistory: [20, 25, 31, 18, 27, 24, 29, 33, 22, 26, 30, 28, 25, 28],
    models: ["claude-sonnet-4-5", "claude-haiku-4-5"],
    requestsToday: 1203,
    tokensToday: { input: 780_000, output: 520_000, cached: 410_000 },
    expiresAt: null,
    rotationSchedule: "60 days",
    ipAllowlist: ["34.102.0.0/16", "35.190.0.0/16"],
    secretsSync: [
      { provider: "1Password", status: "synced" },
      { provider: "Doppler", status: "synced" },
    ],
  },
  {
    id: "key_4",
    name: "hackathon-demo",
    prefix: "sk-ant-api03-7Yz3...bQ1w",
    created: "2026-03-10",
    lastUsed: "3 days ago",
    status: "expiring",
    environment: "development",
    spendToday: 0,
    spendLimit: 25,
    spendHistory: [5, 12, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    models: ["claude-haiku-4-5"],
    requestsToday: 0,
    tokensToday: { input: 0, output: 0, cached: 0 },
    expiresAt: "2026-03-20",
    rotationSchedule: null,
    ipAllowlist: [],
    secretsSync: [],
  },
  {
    id: "key_5",
    name: "being-agent",
    prefix: "sk-ant-api03-Lp4Q...hR9m",
    created: "2026-03-08",
    lastUsed: "8 min ago",
    status: "active",
    environment: "production",
    spendToday: 9.63,
    spendLimit: 10,
    spendHistory: [10, 10, 9, 10, 8, 10, 10, 9, 10, 10, 10, 9, 10, 10],
    models: ["claude-sonnet-4-5"],
    requestsToday: 87,
    tokensToday: { input: 210_000, output: 140_000, cached: 95_000 },
    expiresAt: null,
    rotationSchedule: "30 days",
    ipAllowlist: ["95.216.0.0/16"],
    secretsSync: [{ provider: "1Password", status: "synced" }],
  },
  {
    id: "key_6",
    name: "internal-testing",
    prefix: "sk-ant-api03-Wx5T...pL2n",
    created: "2025-12-01",
    lastUsed: "2 weeks ago",
    status: "revoked",
    environment: "development",
    spendToday: 0,
    spendLimit: 50,
    spendHistory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    models: [],
    requestsToday: 0,
    tokensToday: { input: 0, output: 0, cached: 0 },
    expiresAt: "2026-02-28",
    rotationSchedule: null,
    ipAllowlist: [],
    secretsSync: [],
  },
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
  const opus = Math.floor(Math.random() * 40 + 15);
  const sonnet = Math.floor(Math.random() * 30 + 20);
  const haiku = Math.floor(Math.random() * 15 + 5);
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
  model: string;
  tokens: number;
  cost: number;
  latency: number;
  user?: string;
};

export const auditLog: AuditEntry[] = [
  { timestamp: "2026-03-17 14:32:05", key: "production-api", model: "opus-4-6", tokens: 8420, cost: 0.42, latency: 2340, user: "Daniel" },
  { timestamp: "2026-03-17 14:31:52", key: "leftway-prod", model: "sonnet-4-5", tokens: 3200, cost: 0.10, latency: 890, user: "Marina" },
  { timestamp: "2026-03-17 14:31:48", key: "being-agent", model: "sonnet-4-5", tokens: 5100, cost: 0.15, latency: 1120 },
  { timestamp: "2026-03-17 14:31:30", key: "production-api", model: "haiku-4-5", tokens: 1800, cost: 0.02, latency: 340, user: "Daniel" },
  { timestamp: "2026-03-17 14:31:15", key: "claude-code-dev", model: "opus-4-6", tokens: 12400, cost: 0.62, latency: 3200, user: "Daniel" },
  { timestamp: "2026-03-17 14:30:58", key: "leftway-prod", model: "haiku-4-5", tokens: 2100, cost: 0.02, latency: 280, user: "Marina" },
  { timestamp: "2026-03-17 14:30:41", key: "production-api", model: "sonnet-4-5", tokens: 6800, cost: 0.20, latency: 1450 },
  { timestamp: "2026-03-17 14:30:22", key: "being-agent", model: "sonnet-4-5", tokens: 4300, cost: 0.13, latency: 980 },
];
