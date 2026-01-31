// src/lib/db.ts
// Simple JSON file storage for waitlist entries

import { promises as fs } from "fs";
import path from "path";
import type { WaitlistEntry } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read all waitlist entries
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  await ensureDataDir();

  try {
    const data = await fs.readFile(WAITLIST_FILE, "utf-8");
    return JSON.parse(data) as WaitlistEntry[];
  } catch {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

// Add a new waitlist entry
export async function addWaitlistEntry(
  entry: WaitlistEntry
): Promise<WaitlistEntry> {
  await ensureDataDir();

  const entries = await getWaitlistEntries();

  // Check if email already exists
  const existingIndex = entries.findIndex((e) => e.email === entry.email);
  if (existingIndex !== -1) {
    // Update existing entry
    entries[existingIndex] = { ...entries[existingIndex], ...entry };
  } else {
    // Add new entry
    entries.push(entry);
  }

  await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");

  return entry;
}

// Check if email exists in waitlist
export async function emailExists(email: string): Promise<boolean> {
  const entries = await getWaitlistEntries();
  return entries.some((e) => e.email === email);
}
