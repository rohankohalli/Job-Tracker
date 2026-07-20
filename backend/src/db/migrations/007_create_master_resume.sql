CREATE TABLE IF NOT EXISTS master_resume (
    id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNSIGNED not null,
    name STRING not null,
    content TEXT('long') not null,
    is_default BOOLEAN default false,
)
    