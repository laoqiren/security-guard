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

router.get('/shtml', async ctx => {
    await ctx.render('shtml');
});

router.post('/shtml', async ctx => {
    const text = ctx.request.body.text;
    console.log(text);

    ctx.status = 200;
    const secureHTML = ctx.helper.shtml(text, {
        whiteList: {
            img: ['src']
        }
    });
    console.log("经过shtml转义后的html:", secureHTML);
    ctx.response.body = secureHTML;
});

// CSRF
router.get('/csrf_source', async ctx => {
    console.log('request from', ctx.request.originalUrl);
    const name = ctx.cookies.get('name');
    console.log('cookie name:', name);
    if(!name) {
        console.log('new cookies');
        ctx.cookies.set('name', 'luoxia', {
            maxAge: 1000 * 3600,
            path: '/csrf_source'
        });
    }
    
    await ctx.render('csrf/csrf_source');
});
router.post('/csrf_source', async ctx => {
    const name = ctx.cookies.get('name');
    const book = ctx.request.body.book;

    console.log('post cookie name:', name);
    console.log('post book:', book);
    ctx.status = 200;
    ctx.response.body = "success";
});

router.get('/csrf_attack', async ctx => {
    await ctx.render('csrf/csrf_attack');
});

app.use(router.routes());

app.listen(port,() => {
    console.log("server has been listened at port ", port);
});