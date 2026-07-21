PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS enemies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  bar_label TEXT NOT NULL,
  bar_color TEXT NOT NULL,
  total_hands INTEGER NOT NULL,
  bio TEXT NOT NULL,
  music_cue TEXT NOT NULL,
  portrait_asset TEXT NOT NULL,
  arena_level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dialogs (
  id TEXT PRIMARY KEY,
  enemy_id TEXT NOT NULL REFERENCES enemies(id) ON DELETE CASCADE,
  trigger_hand INTEGER NOT NULL,
  text TEXT NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dialog_choices (
  id TEXT PRIMARY KEY,
  dialog_id TEXT NOT NULL REFERENCES dialogs(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  route_type TEXT NOT NULL CHECK(route_type IN ('g','b','s')),
  effect_gold INTEGER NOT NULL DEFAULT 0,
  effect_psy INTEGER NOT NULL DEFAULT 0,
  effect_spec INTEGER NOT NULL DEFAULT 0,
  effect_item_id TEXT,
  effect_memory_id TEXT,
  outcome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  rarity TEXT NOT NULL,
  color TEXT NOT NULL,
  mesh_asset TEXT NOT NULL,
  sfx_cue TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  icon TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  unlock_route TEXT
);

CREATE TABLE IF NOT EXISTS map_events (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  once_per_campaign INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS map_event_choices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL REFERENCES map_events(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  effect_gold INTEGER NOT NULL DEFAULT 0,
  effect_psy INTEGER NOT NULL DEFAULT 0,
  effect_spec INTEGER NOT NULL DEFAULT 0,
  effect_route TEXT,
  effect_item_id TEXT,
  effect_memory_id TEXT
);

CREATE TABLE IF NOT EXISTS level_placements (
  id TEXT PRIMARY KEY,
  level_name TEXT NOT NULL,
  actor_blueprint TEXT NOT NULL,
  gameplay_tag TEXT NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  z REAL NOT NULL,
  pitch REAL NOT NULL DEFAULT 0,
  yaw REAL NOT NULL DEFAULT 0,
  roll REAL NOT NULL DEFAULT 0,
  scale REAL NOT NULL DEFAULT 1,
  enemy_id TEXT REFERENCES enemies(id),
  item_id TEXT REFERENCES items(id),
  event_id TEXT REFERENCES map_events(id)
);

CREATE TABLE IF NOT EXISTS save_games (
  slot_id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  save_timestamp TEXT NOT NULL
);
