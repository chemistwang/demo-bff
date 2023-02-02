const {
  client: { RpcClient }, // 可以使用它创建RPC服务器
  registry: { ZookeeperRegistry }, // 可以通过它来创建注册中心
} = require("sofa-rpc-node");

const logger = console;

const rpcMiddleware = (options = {}) => {
  return async function (ctx, next) {
    // 创建 zookeeperRegistry 类的实例，用于管理服务发现和注册
    const registry = new ZookeeperRegistry({
      // 记录日志用哪个工具
      logger,
      // zookeeper 的地址
      address: "127.0.0.1:2181",
    });
    // 创建 RpcClient 类的实例，用于发送 rpc 请求
    const client = new RpcClient({
      logger,
      registry,
    });
    const interfaceNames = options.interfaceNames || [];
    const rpcConsumers = {};
    for (let i = 0; i < interfaceNames.length; i++) {
      const interfaceName = interfaceNames[i];
      // 使用 RpcClient 的 createConsumer 方法创建 rpc 消费者
      const consumer = client.createConsumer({ interfaceName });
      // 等待 rpc 消费者准备完毕
      await consumer.ready();
      rpcConsumers[interfaceName.split(".").pop()] = consumer;
    }
    ctx.rpcConsumers = rpcConsumers;
    await next();
  };
};

module.exports = rpcMiddleware;
