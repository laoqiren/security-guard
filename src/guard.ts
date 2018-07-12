import surl, { SurlOtpions } from './Helper/surl';
import shtml, { ShtmlOptions } from './Helper/shtml';

interface Options {
    helper: {
        surl?: SurlOtpions,
        shtml?: ShtmlOptions
    }
}

const defaultOptions: Options = {
    helper: {
    }
}
module.exports =  function (options: Options = defaultOptions) {
    return async function guard(ctx, next) {
        ctx.securityOptions = options;
        ctx.helper = {
            surl: surl.bind(ctx),
            shtml: shtml.bind(ctx)
        };
        await next();
    }
}