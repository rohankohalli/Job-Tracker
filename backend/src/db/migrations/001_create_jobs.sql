CREATE TABLE IF NOT EXISTS jobs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  company     VARCHAR(255)  NOT NULL,
  url         TEXT,
  description LONGTEXT,
  status      ENUM('saved', 'applied', 'rejected') NOT NULL DEFAULT 'saved',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
