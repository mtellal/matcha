--DROP TABLE IF EXISTS `userTags`;
CREATE TABLE `userTags` (
  `userId` INT UNSIGNED NOT NULL,
  `tagId` INT UNSIGNED NOT NULL,
  PRIMARY KEY(userId, tagId), 
  FOREIGN KEY (userId) REFERENCES users(userId),
  FOREIGN KEY (tagId) REFERENCES tags(tagId)
);