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

### Loader Data Access

```typescript
import { useLoaderData, useRouteLoaderData } from 'react-router';
import { NamedRoute } from './AppRouter';

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
