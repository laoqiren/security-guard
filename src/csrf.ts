/*
 * @Author: laoqiren 
 * @Date: 2018-07-13 11:18:04 
 * @Last Modified by: laoqiren
 * @Last Modified time: 2018-07-13 19:18:15
 */

import * as Token from 'csrf';
const tokenGen = new Token();

export interface CSRFOptions {
    useSession?: boolean,          // if useSession set to true, the secret will keep in session instead of cookie
    ignoreJSON?: boolean,          // skip check JSON requests if ignoreJSON set to true
    cookieName?: string,    // csrf token's cookie name
    sessionName?: string,   // csrf token's session name
    headerName?: string, // request csrf token's name in header
    bodyName?: string,          // request csrf token's name in body
    queryName?: string,
    ignorePaths?: string[]
}

const defaultOptions: CSRFOptions = {
    useSession: false,
    ignoreJSON: false,
    cookieName: '_csrf',
    sessionName: '_csrf',
    headerName: 'access_token',
    bodyName: 'access_token',
    queryName: 'access_token',
    ignorePaths: []
}

const CSRF_SECRET: unique symbol = Symbol('CSRF_SECRET');
const _CSRF_SECRET: unique symbol = Symbol('_CSRF_SECRET');
const NEW_CSRF_SECRET: unique symbol = Symbol('NEW__CSRF_SECRET');
const INPUT_TOKEN: unique symbol = Symbol('INPUT_TOKEN');

export default {
    get csrfOptions(): CSRFOptions {
        return Object.assign({}, defaultOptions, this.securityOptions.csrf);
    },
    get csrf(): string {
        const secret = this[NEW_CSRF_SECRET] || this[CSRF_SECRET];
        return secret ? tokenGen.create(secret) : '';
    },
    get [CSRF_SECRET](): string {
        if(this[_CSRF_SECRET]) {
            return this[_CSRF_SECRET];
        }
        const options: CSRFOptions = this.csrfOptions;
        const { useSession, sessionName, cookieName } = options;

        if(useSession) {
            this[_CSRF_SECRET] = this.session[sessionName] || '';
        } else {
            this[_CSRF_SECRET] = this.cookies.get(cookieName) || '';
        }
        return this[_CSRF_SECRET];
    },
    get [INPUT_TOKEN](): string {
        const options: CSRFOptions = this.csrfOptions;
        const { headerName, queryName, bodyName } = options;
        
        const token: string = this.query[queryName] || this.request.body[bodyName] || this.request.header[headerName];
        return token;
    },
    ensureSecret(rotate: boolean = false): boolean {
        console.log("secret:", this[CSRF_SECRET]);
        if(this[CSRF_SECRET] && !rotate) {
            return true;
        }
        console.log('query:', this.request.query)
        const options: CSRFOptions = this.csrfOptions;
        const { useSession, sessionName, cookieName } = options;
        const secret: string = tokenGen.secretSync();
        
        this[NEW_CSRF_SECRET] = secret;

        if(useSession) {
            this.session[sessionName] = secret;
        } else {
            this.cookies.set(cookieName, secret, {
                signed: false,
                httpOnly: false,
                overwrite: true,
                maxAge: 1000 * 3600
            });
        }
        return true;
    },
    rotateCsrfSecret(): boolean {
        if(!this[NEW_CSRF_SECRET] && this[CSRF_SECRET]) {
            return this.ensureSecret(true);
        }
        return false;
    },
    assertToken(): boolean {
        if(!this[CSRF_SECRET]) {
            return false;
        }
        const inputToken: string = this[INPUT_TOKEN];
        const secret: string = this[CSRF_SECRET];

        // AJAX requests get csrf token from cookie, in this situation token will equal to secret 
        if(inputToken !== secret &&  !tokenGen.verify(secret, inputToken)) {
            return false;
        }
        console.log("通过token验证:", inputToken);
        return true;
    }
}