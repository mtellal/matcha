--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `conversations` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `userId` INT UNSIGNED NOT NULL, 
    `memberId` INT UNSIGNED NOT NULL,
    PRIMARY KEY (id), 
    UNIQUE KEY (userId, memberId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (memberId) REFERENCES users(userId)
);