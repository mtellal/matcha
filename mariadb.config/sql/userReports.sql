--DROP TABLE IF EXISTS `userReports`
CREATE TABLE `userReports` (
    `userId` INT UNSIGNED NOT NULL, 
    `reportUserId` INT UNSIGNED NOT NULL, 
    PRIMARY KEY (userId, reportUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (reportUserId) REFERENCES users(userId)
);