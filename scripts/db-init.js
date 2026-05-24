import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const DB_PATH = join(__dirname, '..', 'data', 'vibephim.db')

export function openDb() {
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('foreign_keys = ON')
  return db
}

export function initDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      slug            TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      origin_name     TEXT,
      type            TEXT,
      status          TEXT,
      thumb_url       TEXT,
      poster_url      TEXT,
      year            INTEGER,
      time            TEXT,
      quality         TEXT,
      lang            TEXT,
      content         TEXT,
      episode_current TEXT,
      episode_total   TEXT,
      view            INTEGER DEFAULT 0,
      actor           TEXT DEFAULT '[]',
      director        TEXT DEFAULT '[]',
      categories      TEXT DEFAULT '[]',
      countries       TEXT DEFAULT '[]',
      trailer_url     TEXT,
      modified_at     TEXT,
      created_at      TEXT,
      fetched_at      TEXT
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_slug   TEXT NOT NULL,
      server_name  TEXT,
      ep_name      TEXT,
      ep_slug      TEXT,
      link_embed   TEXT,
      link_m3u8    TEXT,
      FOREIGN KEY (movie_slug) REFERENCES movies(slug) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS crawl_pages (
      page       INTEGER PRIMARY KEY,
      status     TEXT DEFAULT 'done',
      crawled_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_movies_type       ON movies(type);
    CREATE INDEX IF NOT EXISTS idx_movies_year       ON movies(year);
    CREATE INDEX IF NOT EXISTS idx_movies_modified   ON movies(modified_at DESC);
    CREATE INDEX IF NOT EXISTS idx_episodes_slug     ON episodes(movie_slug);
  `)
}
