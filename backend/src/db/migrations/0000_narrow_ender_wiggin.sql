CREATE TABLE `favorites` (
	`id` INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` VARCHAR(255) NOT NULL,
	`recipe_id` INT NOT NULL,
	`title` TEXT NOT NULL,
	`image` TEXT,
	`cook_time` TEXT,
	`servings` TEXT,
	`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
