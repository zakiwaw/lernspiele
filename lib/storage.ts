import { ProgressState, defaultProgressState } from "./types";

export interface ProgressStore {
  get(): Promise<ProgressState | null>;
  set(state: ProgressState): Promise<void>;
  isPersistent(): boolean;
}

/**
 * In-Memory-Speicher: funktioniert nur innerhalb einer laufenden Server-Instanz.
 * Auf Vercel Serverless ist das NICHT dauerhaft. Für dauerhaften Cloud-Speicher
 * muss Vercel Postgres verbunden werden (POSTGRES_URL).
 */
class MemoryStore implements ProgressStore {
  private state: ProgressState | null = null;
  async get() { return this.state; }
  async set(state: ProgressState) { this.state = state; }
  isPersistent() { return false; }
}

class PostgresStore implements ProgressStore {
  private initPromise: Promise<void> | null = null;

  private async ensureTable() {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        const { sql } = await import("@vercel/postgres");
        await sql`
          CREATE TABLE IF NOT EXISTS lernspiele_progress (
            id TEXT PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
      })();
    }
    return this.initPromise;
  }

  async get(): Promise<ProgressState | null> {
    await this.ensureTable();
    const { sql } = await import("@vercel/postgres");
    const result = await sql`SELECT data FROM lernspiele_progress WHERE id = 'main' LIMIT 1`;
    if (result.rows.length === 0) return null;
    return result.rows[0].data as ProgressState;
  }

  async set(state: ProgressState): Promise<void> {
    await this.ensureTable();
    const { sql } = await import("@vercel/postgres");
    const data = JSON.stringify(state);
    await sql`
      INSERT INTO lernspiele_progress (id, data, updated_at)
      VALUES ('main', ${data}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET data = ${data}::jsonb, updated_at = NOW()
    `;
  }

  isPersistent() { return true; }
}

let store: ProgressStore | null = null;

export function getStore(): ProgressStore {
  if (store) return store;
  if (process.env.POSTGRES_URL) {
    store = new PostgresStore();
  } else {
    store = new MemoryStore();
  }
  return store;
}

export function hasPersistentStorage(): boolean {
  return !!process.env.POSTGRES_URL;
}
