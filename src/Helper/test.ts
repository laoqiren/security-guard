import { surl } from './helper';

import { URL, URLSearchParams } from 'url';

const u = surl("http://你好你好?name=<script>alert('hello')</script>", {
    protocolWhiteList: ['http','https','data']
});


const hu: URL = new URL(u);
console.log("结果:", hu.searchParams.get('name'))