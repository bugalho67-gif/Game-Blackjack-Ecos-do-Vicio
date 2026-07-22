CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(64) PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS save_games (
  slot_id VARCHAR(64) NOT NULL,
  player_id VARCHAR(64) NOT NULL,
  payload_json JSON NOT NULL,
  save_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (slot_id, player_id),
  CONSTRAINT fk_save_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_save_games_player_timestamp ON save_games(player_id, save_timestamp);
