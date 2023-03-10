const {
  client: { RpcClient }, // 可以使用它创建RPC服务
  registry: { ZookeeperRegistry }, // 可以通过它来创建注册中心
} = require("sofa-rpc-node");
const logger = console;
// 创建一个注册中心，用于注册微服务
const registry = new ZookeeperRegistry({
  // 记录日志用哪个工具
  logger,
  // zookeeper的地址
  address: "127.0.0.1:2181",
});
(async function () {
  // 创建RPC客户端
  const client = new RpcClient({
    logger,
    registry,
  });
  // 创建一个RPC服务器的消费者
  const consumer = client.createConsumer({
    interfaceName: "com.chemputer.user",
  });
  // 等待服务就绪
  await consumer.ready();
  const result = await consumer.invoke("getUserInfo", [1]);
  console.log(result, "result....");
  process.exit(0);
})();
