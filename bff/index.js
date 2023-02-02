const Koa = require("koa");
const router = require("koa-router")();
const logger = require("koa-logger");
const rpcMiddleware = require("./middleware/rpc");
const app = new Koa();

app.use(logger());
app.use(
  rpcMiddleware({
    // 配置 rpc 中间件的参数，表示要调用的 rpc 接口名称
    interfaceNames: ["com.chemputer.user", "com.chemputer.post"],
  })
);

router.get("/", async (ctx) => {
  const userId = ctx.query.userId;
  const {
    rpcConsumers: { user, post },
  } = ctx;
  const [userInfo, postCount] = await Promise.all([
    user.invoke("getUserInfo", [userId]),
    post.invoke("getPostCount", [userId]),
  ]);
  // 数据的裁剪，把不需要的信息和字符裁剪掉，不返回给客户端
  delete userInfo.password;
  // 数据脱敏
  userInfo.phone = userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  // 数据适配
  userInfo.avatar = "http://www.chemputer.top/" + userInfo.avatar;
  ctx.body = {
    userInfo,
    postCount,
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log(" 🚀 bff server is running at 3000");
});
