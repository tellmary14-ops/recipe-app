CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image` TEXT,
  `cook_time` VARCHAR(100),
  `servings` VARCHAR(100),
  `category` VARCHAR(100),
  `area` VARCHAR(100),
  `ingredients` TEXT,
  `instructions` TEXT,
  `youtube_url` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
