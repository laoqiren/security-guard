/*
 * @Author: laoqiren 
 * @Date: 2018-07-13 13:43:10 
 * @Last Modified by: laoqiren
 * @Last Modified time: 2018-07-13 16:32:48
 */

export default async function(ctx) {
    ctx.ensureSecret();

    const ignorePaths: string[] = ctx.csrfOptions.ignorePaths;
    const queryPath: string = ctx.request.path;

    if(['GET', 'HEAD', 'OPTIONS', 'TRACE'].indexOf(ctx.request.method) !== -1) {
        return;
    }

    if(ignorePaths.indexOf(queryPath) !== -1) {
        return;
    }
    
    const tokenPass = ctx.assertToken();
    if(!tokenPass) {
        ctx.throw(403, 'Invalid access token.');
    }
}