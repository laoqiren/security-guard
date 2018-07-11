const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const { URL } = require('url');
const Guard = require('./lib/guard');

const port = 3000;

const app = new Koa();
const router = new Router();

app.use(bodyparser());
app.use(Guard({
    helper: {
        surl: {
            protocolWhiteList: ['http','https'] 
        }
    }
}));

app.use(views(path.join(__dirname,'views'), {
    extension: 'ejs'
}));

router.get('/xss', async ctx => {
    const userName = "<script>alert('luoxia')</script>";
    console.log(ctx.request.query);
    await ctx.render('xss', {
        userName,
        query: ctx.request.query.q
    });
});

router.get('/surl', async ctx => {
    const href = ctx.request.href;
    console.log("原始href：", href);

    const secureHref = ctx.helper.surl(href);
    console.log("surl处理后：", secureHref);

    const pu = new URL(secureHref);
    const q = pu.searchParams.get('q');

    console.log(q)
    await ctx.render('surl', {
        query: q
    });
});

app.use(router.routes());

app.listen(port,() => {
    console.log("server has been listened at port ", port);
});