-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-06-17 08:33:59
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `school`
--

-- --------------------------------------------------------

--
-- 資料表結構 `collection`
--

CREATE TABLE `collection` (
  `id` int(11) NOT NULL,
  `d_id` int(11) DEFAULT NULL,
  `d_name` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `Dynamo` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `data`
--

CREATE TABLE `data` (
  `dynamo_id` int(5) NOT NULL,
  `DynamoData` varchar(30) DEFAULT NULL,
  `address` varchar(30) NOT NULL,
  `type` varchar(10) NOT NULL,
  `image` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `data`
--

INSERT INTO `data` (`dynamo_id`, `DynamoData`, `address`, `type`, `image`) VALUES
(12345, '500w', '台北市中正區重慶南路一段122號', '風力發電', '123.jpg'),
(12346, '300w', '台北市中正區北平東路30號', '火力發電', '133.jpg');

-- --------------------------------------------------------

--
-- 資料表結構 `dyna`
--

CREATE TABLE `dyna` (
  `d_id` int(11) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `Dynamo` int(11) DEFAULT NULL,
  `d_name` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `dyna`
--

INSERT INTO `dyna` (`d_id`, `address`, `type`, `Dynamo`, `d_name`) VALUES
(1, '臺中市清水區高美濕地', '風力發電', 104, '臺中港風力發電站'),
(2, '桃園市觀音區大潭里濱海路', '太陽能發電', 20, '台電大潭太陽光電站'),
(3, '台南市善化區', '太陽能', 1, '中租能源 太陽能電廠'),
(4, '彰化縣外海', '離岸風力', 900, '彰化離岸風力發電場'),
(5, '屏東縣鹽埔鄉', '生質能發電', 25, '台糖屏東生質能電廠'),
(6, '新北市貢寮區', '太陽能發電', 1, '台電龍門太陽能電廠');

-- --------------------------------------------------------

--
-- 資料表結構 `interactive`
--

CREATE TABLE `interactive` (
  `ino` int(11) NOT NULL,
  `user_id` int(10) NOT NULL,
  `dynamo_id` int(5) NOT NULL,
  `evaluate` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `interactive`
--

INSERT INTO `interactive` (`ino`, `user_id`, `dynamo_id`, `evaluate`) VALUES
(1, 987654321, 12345, '有夠爛'),
(2, 1234567890, 12346, '非常好');

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

CREATE TABLE `member` (
  `user_id` int(10) NOT NULL,
  `account` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL CHECK (`password` regexp '[A-Z]')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `member`
--

INSERT INTO `member` (`user_id`, `account`, `password`) VALUES
(987654321, 's4321', 'Bb00000'),
(1234567890, 's1234', 'Aa12345');

-- --------------------------------------------------------

--
-- 資料表結構 `messageboard`
--

CREATE TABLE `messageboard` (
  `comment_id` bigint(20) NOT NULL,
  `content` varchar(300) DEFAULT NULL,
  `timestamp` datetime NOT NULL,
  `user_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `messageboard`
--

INSERT INTO `messageboard` (`comment_id`, `content`, `timestamp`, `user_id`) VALUES
(101, '好吃', '2025-06-04 00:00:00', 987654321),
(102, '不好吃', '2025-06-03 00:00:00', 1234567890);

-- --------------------------------------------------------

--
-- 資料表結構 `messages`
--

CREATE TABLE `messages` (
  `m_no` int(11) NOT NULL,
  `m_name` varchar(50) DEFAULT NULL,
  `m_content` varchar(200) DEFAULT NULL,
  `m_date` datetime DEFAULT NULL,
  `u_no` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `messages`
--

INSERT INTO `messages` (`m_no`, `m_name`, `m_content`, `m_date`, `u_no`) VALUES
(2, '111', '123', '2025-06-02 16:21:46', NULL),
(3, '222', '345', '2025-06-02 17:09:09', NULL),
(4, '123', '123', '2025-06-02 17:09:13', NULL),
(5, '12', '333', '2025-06-02 17:09:35', NULL),
(6, '123', '123', '2025-06-16 15:33:16', NULL),
(7, '123', '123', '2025-06-16 16:24:20', NULL),
(8, 'ˊˊˊ', 'ˊˊˊ', '2025-06-17 14:09:32', NULL),
(9, '1', '1', '2025-06-17 14:10:22', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `u_no` int(11) NOT NULL,
  `u_account` varchar(30) NOT NULL,
  `u_password` varchar(100) NOT NULL,
  `u_name` varchar(30) NOT NULL,
  `u_address` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`u_no`, `u_account`, `u_password`, `u_name`, `u_address`) VALUES
(3, '456', '$2y$10$k/4wRWBf464a/OyUWVLWquC4PEhdNxA6I3iivkPZrssuO0yrliYFu', 'ㄏㄏ', '銀河系'),
(4, '123', '$2y$10$7gcMyZE0F13W3h9ngNApjeINTDF7NE6p/kGdYhWHonkKmB3hjcn/u', 'ㄎㄎ', '星系團'),
(6, '789', '$2y$10$JP8/d6qC2OIiSd1wkXRA1OV87ukRQmZq1HRE4FzAk5KfSjTgZybEe', 'ㄒㄒ', '57號宇宙');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`dynamo_id`);

--
-- 資料表索引 `dyna`
--
ALTER TABLE `dyna`
  ADD PRIMARY KEY (`d_id`);

--
-- 資料表索引 `interactive`
--
ALTER TABLE `interactive`
  ADD PRIMARY KEY (`ino`),
  ADD KEY `FK_interactive_user_id` (`user_id`),
  ADD KEY `FK_interactive_dynamo_id` (`dynamo_id`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`user_id`);

--
-- 資料表索引 `messageboard`
--
ALTER TABLE `messageboard`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `FK_MessageBoard_user_id` (`user_id`);

--
-- 資料表索引 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`m_no`),
  ADD KEY `FK_messages_users` (`u_no`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`u_no`),
  ADD UNIQUE KEY `u_account` (`u_account`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `collection`
--
ALTER TABLE `collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `dyna`
--
ALTER TABLE `dyna`
  MODIFY `d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messages`
--
ALTER TABLE `messages`
  MODIFY `m_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `u_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `interactive`
--
ALTER TABLE `interactive`
  ADD CONSTRAINT `FK_interactive_dynamo_id` FOREIGN KEY (`dynamo_id`) REFERENCES `data` (`dynamo_id`),
  ADD CONSTRAINT `FK_interactive_user_id` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`);

--
-- 資料表的限制式 `messageboard`
--
ALTER TABLE `messageboard`
  ADD CONSTRAINT `FK_MessageBoard_user_id` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`);

--
-- 資料表的限制式 `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_messages_users` FOREIGN KEY (`u_no`) REFERENCES `users` (`u_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
