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
  ctx.body = {
    userInfo,
    postCount,
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log(" 🚀 bff server is running at 3000");
});
