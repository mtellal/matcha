--DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` CHAR(50) NOT NULL DEFAULT "",
  `email` CHAR(100) NOT NULL DEFAULT "",
  `password` CHAR(100) NOT NULL DEFAULT "",
  `firstName` CHAR(50) NOT NULL DEFAULT "",
  `lastName` CHAR(50) NOT NULL DEFAULT "",
  `age` DATE DEFAULT NULL,
  `city` CHAR(50) NOT NULL DEFAULT "",
  `department` CHAR(50) NOT NULL DEFAULT "",
  `region` CHAR(50) NOT NULL DEFAULT "",
  `gender` ENUM("male", "female", "not specified") NOT NULL DEFAULT "not specified",
  `sexualPreferences` ENUM("male", "female", "not specified") NOT NULL DEFAULT "not specified",
  `biography` TEXT(400) DEFAULT "",
  `likes` INT UNSIGNED NOT NULL DEFAULT 0,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `matches` INT UNSIGNED NOT NULL DEFAULT 0,
  `fameRating` FLOAT UNSIGNED NOT NULL DEFAULT 2.5,
  `status` BIT DEFAULT 0,
  `confirmAccount` BIT DEFAULT 0,
  `confirmToken` CHAR(200) NOT NULL DEFAULT "",
  `notifications` INT UNSIGNED NOT NULL DEFAULT 0,
  `nbPhotos` INT UNSIGNED NOT NULL DEFAULT 0,
  `lastConnection` DATETIME(0) NOT NULL DEFAULT NOW(),
  PRIMARY KEY(userId)
);

