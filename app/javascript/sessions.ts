import { createCookieSessionStorage, Session } from 'react-router';
import { v4 } from 'uuid';

export type SessionData = {
  tzName: string;
  uuid: string;
};

export type SessionFlashData = Record<string, never>;

export type AppSession = Session<SessionData, SessionFlashData>;

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

export { getSession, commitSession, destroySession };
