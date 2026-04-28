CREATE TABLE IF NOT EXISTS jd_analyses (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id              INT UNSIGNED NOT NULL UNIQUE,
  required_skills     JSON,
  nice_to_have        JSON,
  experience_years    VARCHAR(50),
  role_type           VARCHAR(100),
  key_responsibilities JSON,
  red_flags           JSON,
  raw_response        LONGTEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
