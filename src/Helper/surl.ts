/*
 * @Author: laoqiren 
 * @Date: 2018-07-10 19:41:50 
 * @Last Modified by: laoqiren
 * @Last Modified time: 2018-07-10 20:59:56
 */

import { URL, URLSearchParams } from 'url';

interface Otpions {
  protocolWhiteList?: string[]
}

const defaultProtocolWhiteList: string[] = ['http','https','file','data'];
const escapeMap: object = {
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&#x27;',
};

export default function(sourceUrl: string, options: Otpions = {}): string {
  let _url: URL;
  const protocols: Set<string> = new Set();
  const { protocolWhiteList= defaultProtocolWhiteList} = options;

  try {
    _url = new URL(sourceUrl);
  } catch(e) {
    return '';
  }
  
  protocolWhiteList.forEach((protocol: string) => {
    protocols.add(protocol + ':');
  });

  const { protocol, searchParams } = _url;

  if(!protocols.has(protocol)) {
    return '';
  }

  searchParams.forEach(((val: string, name: string) => {
    val = val.replace(/["'<>]/g, ch => {
      return escapeMap[ch];
    });

    searchParams.set(name, val);
  }));

  return _url.toString();
}