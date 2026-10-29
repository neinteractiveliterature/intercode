# Frontend Patterns

## File Organization

### TypeScript Files

- **Components**: `*.tsx` files in feature directories
- **Loaders/Actions**: Can be in separate `loaders.ts` files or co-located with components
- **Types**: Generated types are in `*.generated.ts` files (don't edit these manually)
- **GraphQL**: Queries/mutations are in `queries.graphql` and `mutations.graphql` files

### Key Directories

- `app/javascript/`: All frontend TypeScript/React code
- `app/graphql/`: Backend GraphQL schema and resolvers
- `app/javascript/AppContexts.ts`: Context providers including `apolloClientContext`
- `app/javascript/useIntercodeApolloClient.ts`: Apollo Client setup and configuration

## React Router Patterns

Routes follow a file-based convention similar to Remix/React Router v7:

- `route.tsx` or `index.tsx`: Default route component
- `$id.ts`: Dynamic route segment
- `loaders.ts`: Loader functions for the route

### Route module exports

The app is moving from data-mode React Router (`AppRouter.tsx`) to framework mode (#12219), so route modules use the names framework mode expects. `AppRouter.tsx` loads them through `lazyRoute`, which maps the names back for data mode:

- the component is the **default export** (`export default MyPage;`), not `Component`
- the loader and action are **`clientLoader`** and **`clientAction`**, not `loader` and `action` (framework SPA builds reject those)
- a route module may also export `ErrorBoundary`, `HydrateFallback`, `handle` and `shouldRevalidate`

Middleware, route-level loaders and `element`s that `AppRouter.tsx` attaches to a route are not in the module yet; they are generated into small wrapper modules for the framework build.

Guards that reject a request (login required, an ability required, only on a convention's site or only on the root site) are in `routeGuards.ts` and attached with `loader: guarded([...])`, not as `middleware`. React Router renders an error from middleware at the shallowest route that still has data to load, which on a page load is the root route, and that has no `ErrorBoundary`, so the visitor would get React Router's "Application Error" screen instead of `RouteErrorBoundary`'s login prompt, not-authorized or not-found page. Middleware is fine for redirects (`routeMiddleware.ts`).

### Route types (typegen)

`yarn run typegen` (which `ts:check` runs first) has React Router generate a `Route` namespace for each route module under `.react-router/types`, and tsconfig's `rootDirs` makes it importable next to the module:

```typescript
import type { Route } from './+types/EditDepartment';

export const clientAction = async ({ context, params: { id }, request }: Route.ClientActionArgs) => {
  /* params is typed from the route's path */
};

export const clientLoader = singleDepartmentAdminLoader;

function EditDepartment() {
  const { department } = useLoaderData<typeof clientLoader>(); // typed from the loader, not cast
}
```

- Don't write `LoaderFunction`/`ActionFunction` types for route loaders and actions: type the arguments with `Route.ClientLoaderArgs`/`Route.ClientActionArgs` (or `LoaderFunctionArgs` for a loader shared by several routes) and let the return type be inferred. Read the data with `useLoaderData<typeof clientLoader>()`/`useActionData<typeof clientAction>()`, not `as SomeType`.
- Don't use the `loaderData`/`actionData` props of `Route.ComponentProps` yet: only framework mode passes them, and the data-mode build that production still uses renders route components without props. They can be used once the cutover has happened.
- Typegen only covers route files under the app directory (`app/javascript`), which is why `react-router.config.ts` points there and `root.tsx`, `routes.ts` and `entry.client.tsx` are in `app/javascript` (the data-mode root route module is `AppRootProviders.tsx`).
- With `apollo.query`, pass `errorPolicy: 'none'` so that `data` is typed as present (the runtime default).
- A component that reads its parent route's data (`useXLoader()` hooks next to a shared `loaders.ts`) uses `useRequiredRouteLoaderData<typeof theLoader>(NamedRoute.X)`, which throws if the route isn't matched instead of casting. Use `useRouteLoaderData<typeof theLoader>(...)` where the route may legitimately not be there.
- A loader that can't find its record `throw`s the 404 `Response` (a returned `Response` is data, not an error), which also keeps the type of the loader's result free of `Response`.

### Loader Data Access

```typescript
import { useLoaderData, useRouteLoaderData } from 'react-router';
import { NamedRoute } from './NamedRoute';

function MyComponent() {
  // For current route's loader data
  const data = useLoaderData() as MyQueryData;

  // For parent route's loader data (use NamedRoute enum)
  const parentData = useRouteLoaderData(NamedRoute.AdminUserConProfile) as ParentQueryData;
}
```

## GraphQL Conventions

GraphQL operations are defined in `.graphql` files and types are generated using `graphql-codegen`:

```bash
# Generate types after modifying .graphql files
yarn graphql:codegen
```

### Cache Updates

When mutating data, update the Apollo Client cache to reflect changes:

```typescript
await client.mutate({
  mutation: DeleteItemDocument,
  variables: { id },
  update: (cache) => {
    cache.modify({
      id: cache.identify({ __typename: 'ParentType', id: parentId }),
      fields: {
        items: (existing, { INVALIDATE }) => INVALIDATE,
      },
    });
  },
});
```

## Form Handling

The codebase uses `react-router`'s form handling with fetchers:

```typescript
import { useFetcher } from 'react-router';

function MyForm() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <input name="field" />
      <button type="submit">Submit</button>
    </fetcher.Form>
  );
}
```

## Modal Patterns

Use the `useModal` hook from `@neinteractiveliterature/litform`:

```typescript
import { useModal } from '@neinteractiveliterature/litform';

function MyComponent() {
  const modal = useModal<{ userId: string }>();

  return (
    <>
      <button onClick={() => modal.open({ userId: '123' })}>Open</button>
      <MyModal
        visible={modal.visible}
        onClose={modal.close}
        userId={modal.state?.userId}
      />
    </>
  );
}
```

## Internationalization

The codebase uses `react-i18next` for internationalization. Translation keys are defined in `locales/en.json`.

**Always use `t('some.key')` instead of hardcoded strings in React components.** Never use literal strings in JSX or passed as props. For JSX with mixed content (text + components), use the `<Trans>` component.

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('myNamespace.myKey')}</h1>;
}
```

## Authentication Context

Authentication tokens are managed through `AuthenticityTokensContext`:

```typescript
import { useContext } from 'react';
import { AuthenticityTokensContext } from './AuthenticityTokensContext';

function MyComponent() {
  const { tokens } = useContext(AuthenticityTokensContext);
  // Use tokens for CSRF protection
}
```

**Common error**: "Property 'instance' does not exist on type 'typeof AuthenticityTokensManager'"
Solution: Use `AuthenticityTokensContext` with `useContext` hook instead.

### When the framework-mode shell can't load its files

The generated `index.html` names hashed files (manifest, root module, entry), and a copy cached from before a release can name files that are gone. The app never boots then, so `BootErrorBoundary` can't help. `shellRecovery.ts` holds a small inline script that `root.tsx`'s `Layout` puts in the shell's `<head>`: when a script or module-preload link fails, or the entry's dynamic import is rejected, it reloads once (at most once per 15 seconds, using the same `sessionStorage` key as the Rails-rendered shell's `ENTRY_SCRIPT_ONERROR`), and if that doesn't help it shows a plain message with a reload button. `entry.client.tsx` sets `window.intercodeShellBooted` so that the script stops watching once the app has started. The script is a string, so it can't import anything; `test/javascript/shellRecovery.test.ts` runs it against a stand-in window, and `test/system/framework_shell_recovery_test.rb` breaks the shell in a real browser.

### How the browser gets a session

Both entries (the data-mode `packs/application.tsx` and the framework-mode `entry.client.tsx`) call `startAppBootstrap()` in `appBootstrap.ts` and hand the result to the router through `buildRouterContext`, so authentication works the same way in both:

- The refresh token is an HttpOnly `__Host-` cookie set by `/oauth_session/*`. `AuthenticationManager` redeems it for an in-memory access token on boot (`bootstrapFromCookie`) and again when the token is about to expire (`ensureFreshAccessToken`). A 401 means "no session" and is remembered, not retried.
- Signing in is a PKCE redirect: `SignInButton` or `useLoginRequired` calls `initiateAuthentication`, the visitor signs in on the **root site's** `/users/sign_in` page, and `/oauth/callback` (`OAuthCallback`) exchanges the code through `/oauth_session/exchange`. The sign-in page exists only on the root site, so a convention site sends visitors there and back.
- The root route's loader (`AppRootProviders`) puts the `AuthenticityTokensManager` and Apollo client in React context; the Devise pages read their CSRF tokens from there.
- Assuming an identity (`/user_con_profiles/:id/become`) swaps the Rails session and the refresh cookie on the server, then does a full page load.

`test/system/authentication_test.rb` and `test/system/assumed_identity_test.rb` cover these against both builds. The sign-in test runs the real redirect on `http://localhost` (see the comments in that file for the issuer and redirect URI overrides it needs), which is why `buildOpenidConfig` accepts an `http` issuer on `localhost` and nowhere else.

## Common Utilities

### Date/Time Handling

Use Luxon for date/time operations:

```typescript
import { DateTime } from 'luxon';
import { useAppDateTimeFormat } from './TimeUtils';

function MyComponent() {
  const format = useAppDateTimeFormat();
  const formatted = format(DateTime.fromISO(isoString, { zone: timezoneName }), 'longWeekdayDateTimeWithZone');
}
```

### Money Formatting

```typescript
import formatMoney from './formatMoney';

const formattedPrice = formatMoney(priceInCents);
```
