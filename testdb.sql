-- Adminer 4.3.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `heading` text NOT NULL,
  `date` date NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO `article` (`id`, `title`, `heading`, `date`, `content`) VALUES
(1,	'article-one',	'Article One',	'2017-08-20',	'This is Article One'),
(2,	'article-two',	'Article Two',	'2017-08-31',	'This is Article Two');

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `article_id` (`article_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO `comment` (`id`, `article_id`, `user_id`, `comment`, `timestamp`) VALUES
(1,	1,	1,	'This is the comment from user with id 1',	'2017-09-02 07:04:28'),
(2,	1,	1,	'wow',	'2017-09-02 08:15:04');

DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `test` (`id`, `name`) VALUES
(2,	'hello'),
(3,	'boo');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`(10))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1,	'ronak',	'pbkdf2$10000$cfdb5422d525a365c5710667d9c8b9ba0ab087882bcc548d311dda7b91967b7a54ac43673a24f6e17557fc7f492ac68f3934efffeffda7d0f0f2c16bb2f50f402407d76baff43d1bb0bb814ba5a39979268354a4153237addde6961804e2b06471ecce4450f9b33d8fa61f80b90ff986d9e1d6fe5061b6132432f29a4132268b$72629a41b076e588fba8c71ca37fadc9acdc8e7321b9cb4ea55fd0bf9fe8ed72def92b4c7dff5242a0254945b945394ce4d6008e947bdc7593085cd1e2f6a375e3efe32510e0f982abcc57991cb705243a3a42086e6a9e56c7b063c72636793b7622587882a872b19bb15e8fc8a865a8e83264bf802d0e52f825f18cc46a2147f733c36bb1377a9fbcc2e19b521c0ec860fb0c70106f02b68627231d13b7f9012b7dc88f20ef5c040002dda09db5437c41f7f8451732bf8bbbf9bc70ccd38f330137a7504167508be36f056d766c0405724460f09c5653860ea38607f71b517f4e8c6f2d0df5596c6189da018452cda0a8638ab236ea124bb067b6cf3ea8d99b1c53027c8b3a4b20d17d773821743ddc2429b856c8a59570f5901129106c0169f14f382859d4af99f984998ebedbf7f6f81f7de0c49633ae60fed5e7ecf8ec21d2d6b0e20bfe5fae6cc58da88a96ee4151f62b7e2704b92bc41f887d8b496b48aa71880e81ac0aa9d880793bf4d1aaf421ecbf1e6baecfd012eecddb166c3968b7ea73dcf7c2fdc7f44ef747f085067190af58ed91990da77f27045d806e80bfe5f3fc41d3049acd7fabd5241ac3b3fb2ca311a6a903f2332f4cbe8a61ab360a4f44496184b158243e780b1c807a7b8e7e4117677950357727eccf75b82fed6b1e6602e837de6f7677c49bd78fb0b21815cddca7a66ca70df8464f3937ec0b44');

-- 2017-09-02 09:06:42
