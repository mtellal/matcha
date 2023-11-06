--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `notifications` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `userId1` INT UNSIGNED NOT NULL, 
    `userId2` INT UNSIGNED NOT NULL, 
    `action` CHAR(10) NOT NULL, 
    `createdAt` DATETIME(0) NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE KEY (userId1, userId2, action), 
    FOREIGN KEY (userId1) REFERENCES users(userId),
    FOREIGN KEY (userId2) REFERENCES users(userId)
);