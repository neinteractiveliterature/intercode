# Apollo Client Usage Patterns

The codebase uses React Router v7's context system to provide the Apollo Client instance. There are two distinct patterns depending on where the client is needed.

## Pattern 1: Loaders and Actions

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

## Pattern 2: Component Code

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
- Never use `useApolloClient()` in loaders or actions (they're not React components)

## Common Mistakes to Avoid

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

❌ **Don't**: Access `client` directly in loaders without getting it from context

```typescript
export const loader: LoaderFunction = async () => {
  const { data } = await client.query(...); // Error: client is not defined
};
```

## Common Errors

**"Cannot find name 'client'" in loader/action**
Cause: Trying to use a global `client` variable that doesn't exist.
Solution: Get client from context using `context.get(apolloClientContext)`.

**"useApolloClient is defined but never used" in file with loader**
Cause: File has loader/action that needs context-based client, not hook-based.
Solution: Remove `useApolloClient` import, add `apolloClientContext` import, update loader signature.
