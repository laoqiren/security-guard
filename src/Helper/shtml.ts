/*
 * @Author: laoqiren 
 * @Date: 2018-07-12 13:55:45 
 * @Last Modified by: laoqiren
 * @Last Modified time: 2018-07-12 14:51:02
 */
import * as xss from 'xss';

export interface ShtmlOptions {
    whiteList?: object
}

export default function(sourceHtml: string, options?: ShtmlOptions): string {
    let options_: ShtmlOptions = options || (this.securityOptions && this.securityOptions.helper.shtml) || {};
    
    const result: string = xss(sourceHtml, options);
    return result;
}