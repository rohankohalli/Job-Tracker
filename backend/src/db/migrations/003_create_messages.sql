CREATE TABLE IF NOT EXISTS messages (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id       INT UNSIGNED NOT NULL,
  type         ENUM('cold_dm', 'email') NOT NULL,
  draft        LONGTEXT NOT NULL,
  approved     BOOLEAN DEFAULT FALSE,
  approved_at  TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
