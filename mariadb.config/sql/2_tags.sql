--DROP TABLE IF EXISTS `tags`
CREATE TABLE `tags` (
    `tagId` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `tag` CHAR(30) NOT NULL DEFAULT '',
    PRIMARY KEY (tagId, tag)
);
INSERT INTO tags (tag) VALUES ("travel"), ("photography"), ("food"), ("sports"), ("books"), ("art"), ("movies"), ("fashion"), ("technology"), 
("nature"), ("animals"), ("fitness"), ("science"), ("video games"), ("social"), ("cuisine"), ("do it yourself"), ("astrology"), ("spirituality"), 
("adventurous"), ("intellectual"), ("music"), ("career"), ("romantic");