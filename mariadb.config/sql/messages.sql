--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `messages` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `convId` INT UNSIGNED NOT NULL, 
    `authorId` INT UNSIGNED NOT NULL, 
    `userId` INT UNSIGNED NOT NULL,
    `text` TEXT(400),
    `createdAt` DATETIME(0) NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),  
    FOREIGN KEY (convId) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users(userId),
    FOREIGN KEY (userId) REFERENCES users(userId)
);