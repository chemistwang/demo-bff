# RPC BFF Demo

## 技术选型

- Koa
- Redis
- MySQL
- Zookeeper
- RabbitMQ

## 环境安装并启动

- macOS `11.6.4`
- 本地 `localhost` 运行

```bash
# 安装
brew install mysql
brew install zookeeper
brew install rabbitmq
# 启动 mysql
brew services start mysql
# 启动 zookeeper
zkServer start
# 启动 rabbitmq
brew services start rabbitmq
```

## 创建数据库和模拟数据

1. 创建表

```sql
-- t_user 表
CREATE TABLE IF NOT EXISTS `t_user`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `username` VARCHAR(20) NOT NULL,
   `avatar` VARCHAR(100) NOT NULL,
   `password` VARCHAR(100) NOT NULL,
   `phone` VARCHAR(30) NOT NULL,
   PRIMARY KEY ( `id` )
)

-- t_post 表
CREATE TABLE IF NOT EXISTS `t_post`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `user_id` INT,
   `title` VARCHAR(100) NOT NULL,
   PRIMARY KEY ( `id` )
)
```

2. 创建模拟数据

```sql
INSERT INTO t_user (id, username, avatar, password, phone) VALUES (1, 'lucus', 'avatar1.png', '111111', '13100000001');
INSERT INTO t_user (id, username, avatar, password, phone) VALUES (2, 'mars', 'avatar2.png', '222222', '13100000002');

INSERT INTO t_post  (id, user_id, title) VALUES (1, 1, '文章1');
INSERT INTO t_post (id, user_id, title) VALUES (2, 1, '文章2');
INSERT INTO t_post (id, user_id, title) VALUES (3, 1, '文章3');
```

## 分别启动服务

1. 启动 `user` 微服务

```bash
cd user && npm i && npm run dev
```

2. 启动 `post` 微服务

```bash
cd post && npm i && npm run dev
```

3. 启动 `write-logger` 微服务

```bash
cd write-logger && npm i && npm run dev
```

4. 启动 `bff`

```bash
cd bff && npm i && npm run dev
```

5. 浏览器访问

```
http://localhost:3000/?userId=1
```
