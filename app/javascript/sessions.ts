// app/sessions.ts
import { createContext } from 'react';
import { createCookieSessionStorage, createSession, Session } from 'react-router';
import { v4 } from 'uuid';
import { parse, serialize } from 'cookie';
import { PKCEChallengeData } from './Authentication/openid';

export type SessionData = {
  jwtToken?: string;
  jwtRefreshToken?: string;
  pkceChallenge?: PKCEChallengeData;
  tzName: string;
  uuid: string;
};

export type SessionFlashData = Record<string, never>;

export type AppSession = Session<SessionData, SessionFlashData>;

export const SessionContext = createContext<AppSession>(
  createSession({
    tzName: 'Etc/UTC',
    uuid: '0',
  }),
);

const SESSION_COOKIE_NAME = '__intercode_react_router_session';

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: SESSION_COOKIE_NAME,

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
    ...(import.meta.env.SECRET_KEY_BASE
      ? {
          secrets: [import.meta.env.SECRET_KEY_BASE],
        }
      : {}),

    // secure: true,
  },
});

export async function getSessionUuid(session: Session<SessionData, SessionFlashData>) {
  const uuid = session.data.uuid ?? v4();

  if (!session.data.uuid) {
    session.set('uuid', uuid);
    await commitSession(session);
  }

  return uuid;
}

export async function getSessionFromBrowser() {
  const cookieValue = await window.cookieStore.get(SESSION_COOKIE_NAME);
  if (cookieValue?.value) {
    return await getSession(serialize({ name: SESSION_COOKIE_NAME, value: cookieValue.value }));
  } else {
    return await getSession();
  }
}

export async function commitSessionToBrowser(session: AppSession) {
  if (typeof window === 'undefined') {
    return;
  }

  const setCookieHeader = await commitSession(session);
  const cookie = parse(setCookieHeader);
  const cookieValue = cookie[SESSION_COOKIE_NAME];
  if (cookieValue) {
    await window.cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      path: cookie.Path,
      sameSite: cookie.SameSite === 'Lax' ? 'lax' : cookie.sameSite === 'None' ? 'none' : 'strict',
    });
  } else {
    await window.cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export { getSession, commitSession, destroySession };
