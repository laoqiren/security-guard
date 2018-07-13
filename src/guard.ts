import surl, { SurlOtpions } from './Helper/surl';
import shtml, { ShtmlOptions } from './Helper/shtml';

import CSRF, { CSRFOptions } from './csrf';
import CSRFMiddleware from './middlewares/csrf';

interface Options {
    helper: {
        surl?: SurlOtpions,
        shtml?: ShtmlOptions
    },
    csrf: CSRFOptions
}

const defaultOptions: Options = {
    helper: {},
    csrf: {}
}
module.exports =  function (options: Options = defaultOptions) {
    return async function guard(ctx, next) {
        ctx.securityOptions = options;
        ctx.helper = {
            surl: surl.bind(ctx),
            shtml: shtml.bind(ctx)
        };
        Object.defineProperties(ctx, Object.getOwnPropertyDescriptors(CSRF));
        
        await CSRFMiddleware(ctx);
        await next();
    }
}