import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { createSeedDatabase } from "./seed";
import type { Database } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const LOCK_PATH = path.join(DATA_DIR, "db.lock");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  await ensureDataDir();
  const started = Date.now();
  while (true) {
    try {
      const handle = await fs.open(LOCK_PATH, "wx");
      await handle.close();
      break;
    } catch {
      if (Date.now() - started > 8000) {
        try {
          await fs.unlink(LOCK_PATH);
        } catch {
          /* ignore */
        }
      }
      await new Promise((r) => setTimeout(r, 40));
    }
  }
  try {
    return await fn();
  } finally {
    try {
      await fs.unlink(LOCK_PATH);
    } catch {
      /* ignore */
    }
  }
}

async function readRaw(): Promise<Database> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    const hash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "opus-admin-2026",
      10,
    );
    const seed = createSeedDatabase(hash);
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export async function readDb(): Promise<Database> {
  return withLock(async () => readRaw());
}

export async function updateDb(
  mutator: (db: Database) => void | Promise<void>,
): Promise<Database> {
  return withLock(async () => {
    const db = await readRaw();
    await mutator(db);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  });
}

export function formatPrice(cents: number | null): string {
  if (cents === null) return "Sob consulta";
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "A confirmar";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}
