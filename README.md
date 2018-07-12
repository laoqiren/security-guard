# security-guard

Providing security guards for Node.js applications based on `Koa.js`.

## Install
```
npm i security-guard
```

## Running local example

```
yarn && yarn example
```

the example server will run at `localhost:3000`.

**exp.**

to preview `XSS attack`, go to `localhost:3000/xss?q=<xss>`, replace `xss` with your `script`.

## Use as a `middleware`
```js
const Guard = require('security-guard');
app.use(Guard(options));
```

* **options** \[Options\] options object.
```js
Options {
    helper: {
        surl?: SurlOtpions // see below for detail
    }
}
```

## `CSRF`

To preview the example of `CSRF` attack, go to `localhost:3000/csrf_source` first, server will set cookie to `/csrf_source`, then go to `localhost:3000/csrf_attack` to attack `/csrf_source`. You can set a host like `127.0.0.1 attack.luoxia.me`, then go to `attack.luoxia.me:3000/csrf_attack`, then test again.

### `.csrf()`

// todo

## Helper

some utils to help reducing `XSS` and other security risks.

### `helper.surl(sourceUrl, surlOptions)`

to transform given url to a more security url.

* **sourceUrl** \<string\> source url to transform.
* **surlOptions** \[SurlOptions\] options. This options will cover the `options.helper.surl` in `Guard(options)`.
```js
    SurlOtpions {
        protocolWhiteList?: string[]   // white list of protocols like ['http', 'https'], if the source url doesn't match any in the white list, surl() will return ''. default to be ['http', 'https', 'data', 'file']
    }
```

**exp.**
```js
const Guard = require('security-guard');
app.use(Guard());
//...
router.get('/surl', async ctx => {
    const href = ctx.request.href;
    console.log("source href：", href);   // http://localhost:3000/surl?q=%3Cscript%3Ealert(%27hello%27)%3C/script%3E

    const secureHref = ctx.helper.surl(href, {
        protocolWhiteList: ['http', 'https']
    });
    console.log("security url：", secureHref); // http://localhost:3000/surl?q=%26lt%3Bscript%26gt%3Balert%28%26%23x27%3Bhello%26%23x27%3B%29%26lt%3B%2Fscript%26gt%3B

    const pu = new URL(secureHref);
    const q = pu.searchParams.get('q');

    console.log(q); // &lt;script&gt;alert(&#x27;hello&#x27;)&lt;/script&gt;
    await ctx.render('surl', {
        query: q
    });
});
```

**Go to `localhost:3000/surl?q=<xss>` to preview it, replace `xss` with your `script`**

### `helper.shtml(sourceHtml [,option])`
transform the richtext to secure string, based on `js-xss`.

* **sourceHtml** \<string\> the richtext to transform.
* **options**   \<ShtmlOptions\> refer to [js-xss](https://github.com/leizongmin/js-xss)

**exp.**
```js
router.post('/shtml', async ctx => {
    const text = ctx.request.body.text;

    ctx.status = 200;
    const secureHTML = ctx.helper.shtml(text, {
        whiteList: {
            img: ['src']
        }
    });
    ctx.response.body = secureHTML;
});
```
go to `localhost:3000/shtml` to preview it.

// todo
