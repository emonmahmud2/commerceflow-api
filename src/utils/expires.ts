/** Parses values like `15m`, `7d`, `24h` into milliseconds. */
export function parseExpiresToMs(input: string): number {
  const m = /^(\d+)([smhd])$/i.exec(String(input).trim());
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  const table: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return n * (table[u] ?? 86_400_000);
}
