import surl, { SurlOtpions } from './Helper/surl';

interface Options {
    helper: {
        surl?: SurlOtpions
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
            surl: surl.bind(ctx)
        };
        await next();
    }
}