--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `userBlocks` (
    `userId` INT UNSIGNED NOT NULL, 
    `blockUserId` INT UNSIGNED NOT NULL, 
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (userId, blockUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (blockUserId) REFERENCES users(userId)
);