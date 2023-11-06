--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `userViews` (
    `userId` INT UNSIGNED NOT NULL, 
    `viewUserId` INT UNSIGNED NOT NULL, 
    PRIMARY KEY (userId, viewUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (viewUserId) REFERENCES users(userId)
);