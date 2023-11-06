--DROP TABLE IF EXISTS `userLikes`
CREATE TABLE `userLikes` (
    `userId` INT UNSIGNED NOT NULL, 
    `likeUserId` INT UNSIGNED NOT NULL, 
    PRIMARY KEY (userId, likeUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (likeUserId) REFERENCES users(userId)
);