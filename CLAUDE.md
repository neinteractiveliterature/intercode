# Intercode Development Guide for AI Assistants

This document provides essential context about the Intercode codebase for AI assistants working on the project.

## Project Overview

Intercode is a convention management system built with:
- **Backend**: Ruby on Rails with GraphQL API
- **Frontend**: React with TypeScript
- **Routing**: React Router v7
- **Data Fetching**: Apollo Client for GraphQL
- **Styling**: Bootstrap 5
- **Build Tool**: Vite

## Apollo Client Usage Patterns

### Context-Based Client Access

The codebase uses React Router v7's context system to provide the Apollo Client instance. There are two distinct patterns depending on where the client is needed:

#### Pattern 1: Loaders and Actions (Server-Side)

React Router loaders and actions run during navigation and need to access the client from the router context.

```typescript
import { LoaderFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from 'AppContexts';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, params }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: MyQueryDocument,
    variables: { id: params.id },
  });
  return data;
};

export const action: ActionFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  await client.mutate({
    mutation: MyMutationDocument,
    variables: await request.json(),
  });
  return redirect('/success');
};
```

**Key points:**
- Always use `LoaderFunction<RouterContextProvider>` or `ActionFunction<RouterContextProvider>` as the type
- Get client with `context.get(apolloClientContext)`
- Import `apolloClientContext` from `'AppContexts'`

#### Pattern 2: Component Code (Client-Side)

React components and hooks use the Apollo Client hook to access the client instance.

```typescript
import { useApolloClient } from '@apollo/client/react';

function MyComponent() {
  const client = useApolloClient();

  const handleAction = async () => {
    await client.mutate({
      mutation: MyMutationDocument,
      variables: { ... },
    });
  };

  return <button onClick={handleAction}>Submit</button>;
}
```

**Key points:**
- Use `useApolloClient()` hook from `'@apollo/client/react'`
- Call the hook inside the component/hook function body
- Never try to use `useApolloClient()` in loaders or actions (they're not React components)

### Common Mistakes to Avoid

❌ **Don't**: Import a global client instance
```typescript
import { client } from 'useIntercodeApolloClient'; // This no longer exists
```

❌ **Don't**: Use `useApolloClient()` in loaders/actions
```typescript
export const loader: LoaderFunction = async () => {
  const client = useApolloClient(); // Error: hooks can't be used here
};
```

❌ **Don't**: Try to access `client` directly in loaders without getting it from context
```typescript
export const loader: LoaderFunction = async () => {
  const { data } = await client.query(...); // Error: client is not defined
};
```

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

### Route Structure

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

### Query/Mutation Generation

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

The codebase uses `react-i18next` for internationalization:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('myNamespace.myKey')}</h1>;
}
```

Translation keys are defined in locale files and should be used instead of hardcoded strings.

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

## Common Utilities

### Date/Time Handling

Use Luxon for date/time operations:

```typescript
import { DateTime } from 'luxon';
import { useAppDateTimeFormat } from './TimeUtils';

function MyComponent() {
  const format = useAppDateTimeFormat();
  const formatted = format(
    DateTime.fromISO(isoString, { zone: timezoneName }),
    'longWeekdayDateTimeWithZone'
  );
}
```

### Money Formatting

```typescript
import formatMoney from './formatMoney';

const formattedPrice = formatMoney(priceInCents);
```

## Testing Considerations

When modifying loader/action patterns:
1. Ensure loaders use `LoaderFunction<RouterContextProvider>`
2. Ensure actions use `ActionFunction<RouterContextProvider>`
3. Always get the client from context in loaders/actions
4. Run `yarn run tsc --noEmit` to check for TypeScript errors
5. Test actual navigation flows to ensure data loading works

## Build and Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Type check
yarn run tsc --noEmit

# Generate GraphQL types
yarn graphql:codegen

# Run tests
yarn test
```

## Common Errors and Solutions

### "Cannot find name 'client'" in loader/action
**Cause**: Trying to use a global `client` variable that doesn't exist.
**Solution**: Get client from context using `context.get(apolloClientContext)`.

### "useApolloClient is defined but never used" in file with loader
**Cause**: File has loader/action that needs context-based client, not hook-based.
**Solution**: Remove `useApolloClient` import, add `apolloClientContext` import, update loader signature.

### "Property 'instance' does not exist on type 'typeof AuthenticityTokensManager'"
**Cause**: Incorrect usage of AuthenticityTokensManager.
**Solution**: Use `AuthenticityTokensContext` with `useContext` hook instead.

## Getting Help

- Check existing patterns in similar files
- Look for `*.generated.ts` files for type definitions
- Use TypeScript's "Go to Definition" to understand type structures
- Run `yarn run tsc --noEmit` to catch type errors early
