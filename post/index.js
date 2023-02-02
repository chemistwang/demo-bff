const {
  server: { RpcServer }, // 可以使用它创建RPC服务器
  registry: { ZookeeperRegistry }, // 可以通过它来创建注册中心
} = require("sofa-rpc-node");
const mysql = require("mysql2/promise");
const logger = console;

// 创建一个注册中心，用于注册微服务
const registry = new ZookeeperRegistry({
  // 记录日志用哪个工具
  logger,
  // zookeeper地址
  address: "127.0.0.1:2181",
});

// 创建RPC服务器的实例
// 客户端连接RPC服务器的可以通过zookeeper，也可以直接直连rpcServer
const server = new RpcServer({
  logger,
  registry,
  port: 10001,
});

(async function () {
  //连接mysql数据库
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bff",
  });
  // 添加服务接口
  server.addService(
    // 格式约定为域名反转+领域模型的名称
    { interfaceName: "com.chemputer.post" }, // 格式约定为域名反转+领域模型的名称
    {
      async getPostCount(userId) {
        const sql = `SELECT count(*) as postCount from t_post WHERE user_id=${userId}`;
        const [rows] = await connection.execute(sql);
        return rows[0].postCount;
      },
    }
  );
  // 启动RPC服务
  await server.start();
  // 把启动好的RPC服务注册到zookeeper上
  await server.publish();
  console.log("文章微服务已经启动");
})();
