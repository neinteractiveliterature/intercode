import nodeFetch from 'node-fetch';
import Headers, { SetCookie, SetCookieInit } from '@mjackson/headers';
import { CookieJar } from 'tough-cookie';

export type ServerFetcher = {
  (url: URL, init: RequestInit): Promise<Response>;
  setCookie: (...items: (string | SetCookieInit)[]) => void;
};

export function buildServerFetcher(res: import('express').Response): ServerFetcher {
  const cookieJar = new CookieJar();

  const setCookie = (...items: (string | SetCookieInit)[]) => {
    const headers = new Headers();
    const prevSetCookie = res.getHeader('set-cookie');
    if (typeof prevSetCookie === 'number') {
      headers.append('set-cookie', prevSetCookie.toString());
    } else if (Array.isArray(prevSetCookie)) {
      for (const item of prevSetCookie) {
        headers.append('set-cookie', item);
      }
    } else if (prevSetCookie != null) {
      headers.append('set-cookie', prevSetCookie);
    }

    headers.setCookie.push(...items.map((item) => new SetCookie(item)));

    res.setHeader('set-cookie', headers.getSetCookie());
  };

  const serverFetch = async (url: URL, init: RequestInit) => {
    const requestHeaders = new Headers(init.headers);
    const cookies = await cookieJar.getCookies(url.toString());
    for (const cookie of cookies) {
      requestHeaders.cookie.set(cookie.key, cookie.value);
    }

    const requestInitWithCookies: import('node-fetch').RequestInit = {
      ...(init as import('node-fetch').RequestInit),
      headers: requestHeaders.entries(),
    };

    const response = await nodeFetch(url, requestInitWithCookies);
    const responseHeaders = new Headers(response.headers);

    for (const item of responseHeaders.setCookie) {
      setCookie(item);
      await cookieJar.setCookie(item.toString(), url);
    }

    return response as unknown as Response;
  };

  serverFetch.setCookie = setCookie;

  return serverFetch;
}
