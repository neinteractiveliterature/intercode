// app/sessions.ts
import { createCookieSessionStorage } from 'react-router'; // or cloudflare/deno

export type SessionData = {
  csrfToken: string;
  tzName: string;
  uuid: string;
};

export type SessionFlashData = Record<string, never>;

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__intercode_react_router_session',

    // all of these are optional
    // domain: 'remix.run',
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    // httpOnly: true,
    // maxAge: 60,
    // path: '/',
    // sameSite: 'lax',
    secrets: [
      process.env['SECRET_KEY_BASE'] ??
        '28cb566d2224bf06b0b1d91292f2188f35d22a54e6e2c626c5f34a35d68067aaec889ccbabfb0109021f0ec8b1d73feae0f68f526a768b299332c95ee90c40be',
    ],
    // secure: true,
  },
});

export { getSession, commitSession, destroySession };
