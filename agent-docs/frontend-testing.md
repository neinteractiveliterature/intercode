# Frontend Testing

Frontend tests use Vitest (jsdom) and React Testing Library. They live in `test/javascript/`, mirroring the layout of `app/javascript/`.

```bash
yarn run vitest run                                   # everything
yarn run vitest run test/javascript/Store             # one directory or file
COVERAGE=1 yarn run vitest run                        # with coverage (writes coverage/)
yarn run tsc --noEmit                                 # tests are type checked too
```

## What kind of test to write

| What you're testing                                        | Write                             | Notes                                                                                                        |
| ---------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Pure logic (parsing, layout, permissions, formatting)      | A plain `.test.ts` unit test      | Fastest, and where most of the bugs we've found have been.                                                   |
| A component or route, including what a user can do with it | A component test (`.test.tsx`)    | Render it, interact with it like a user, assert on what they'd see.                                          |
| A flow across pages, a real browser, real timing           | Playwright or a Rails system test | **Keep these to a minimum.** Browser-driven tests are flaky; prefer a component test that gets close enough. |

Test behavior a user (or another part of the app) would notice, not implementation details. A regression test should fail without the fix: after writing one, temporarily revert the fix and make sure it does.

## The test harness: `test/javascript/testUtils.tsx`

Import `render`, `renderRoute`, `userEvent`, `waitFor` and the rest of Testing Library from `../testUtils`, not from `@testing-library/react` directly.

- **`render(ui, options)`** is async (`await` it). It wraps the component in i18n, an Apollo `MockedProvider`, a router, `AppRootContext`, Stripe and a Suspense boundary. Options: `apolloMocks`, `apolloCache`, `appRootContextValue`, `stripePublishableKey`.
- **`renderRoute(routes, options)`** is for components that get their data from a React Router loader (`context.get(apolloClientContext)` in a `loader`/`action`). It builds one real `ApolloClient` on a `MockLink`, used by loaders, actions and (through `ApolloProvider`) hooks, so they share a cache like in production: a component updates after an action changes the cache. Each mock is used once, so list a query twice if the page will make it twice (e.g. a refetch after a mutation).
- **Apollo mocks** are `MockLink.MockedResponse` objects built from the generated documents and data types (`FooQueryDocument`, `FooQueryData`), so a query change breaks the type check instead of silently drifting.
- **Time**: use `vi.useFakeTimers({ toFake: ['Date'] })` with `vi.setSystemTime(...)`. Faking only `Date` leaves the timers Testing Library relies on alone.

## Interacting with components: `userEvent`, not `fireEvent`

```tsx
describe('MyComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('adds a bucket', async () => {
    const { getByText } = await render(<MyComponent />);
    await user.click(getByText('Add bucket'));
    ...
  });
});
```

- Always `await` the interaction (`click`, `type`, `clear`, `selectOptions`, `keyboard`, ...).
- Use `fireEvent` only for events a user can't produce directly (like an image `load` event).
- **Controlled components with a mocked `onChange` don't work with real typing**, because the parent never updates the value between keystrokes. Render the component inside a small stateful wrapper that holds the value (like the real form does), pass it a `vi.fn()` to spy on, and assert on `mock.lastCall`. See `RegistrationPolicyEditor.test.tsx`. This also catches bugs that only appear once the component re-renders with what it just emitted: that's how the preset bucket bug (#12081) was found.

## Testing a route with a loader and an action

`test/javascript/UserConProfiles/EditUserConProfile.test.tsx` is the worked example: a route whose loader fetches data, whose form submits to an action, which calls a mutation and redirects. Use `renderRoute` with the real `loader` and `action`, plus a stand-in route for wherever the action redirects to:

```tsx
renderRoute(
  [
    { path: '/user_con_profiles/:id/edit', loader, action, Component: EditUserConProfile },
    { path: '/user_con_profiles/:id', Component: () => <h1>Viewing a profile</h1> },
  ],
  { apolloMocks, initialEntries: ['/user_con_profiles/7/edit'] },
);
```

- Cover the whole cycle: loader renders the data, the user edits and submits, the mutation gets the right payload, and the redirect lands. Also cover the failure path (the error is shown and the user can retry) and the in-progress state (`delay` on the mock).
- To check what the mutation was sent, give the mock `request.variables` as a function: it receives the variables, so it can record them and return whether they match (`variables: (variables) => { saved(variables.input); return true; }`).
- A component that needs Stripe (like `OrderPaymentModal`) can be stubbed with `vi.mock` when a test is about the page driving it (see `Store/Cart.test.tsx`); give the stub buttons for the callbacks you want to trigger.
- Make fixtures carry `__typename` all the way down. Data from a loader goes through Apollo's cache, which can't read back objects that lack one.
- Check the tests can fail: break the redirect, the payload and the error display in turn and make sure a test goes red each time.

## Finding elements

In order of preference: `ByRole` (with `name`), `ByLabelText`, `ByText`, `ByPlaceholderText` / `ByDisplayValue`, and only then `ByTestId`. Avoid `querySelector`. For things that appear later, `await findBy...` or `await waitFor(() => expect(...))` rather than asserting immediately. `jest-dom` matchers (`toHaveValue`, `toBeDisabled`, `toHaveAttribute`, ...) are available.

## `act()` warnings fail the test

`test/javascript/setupTests.ts` fails any test during which React logs "not wrapped in act(...)". It means a state update landed outside the test's control, so the test might assert on an intermediate state or finish early. To fix one:

- `await` the interaction (`await user.click(...)`) and anything you're waiting on (`findBy...`, `waitFor`).
- Don't call `act` yourself unless you're driving something outside Testing Library.
- For a `rerender`, prefer driving a stateful wrapper with `userEvent` instead.

One category is not guarded: "a component suspended inside an `act` scope, but the `act` call was not awaited". It appears when a user event causes something to suspend (`useSuspenseQuery`, a lazy component). Seeding the Apollo cache (`apolloCache` option) avoids it for data; for lazy components, wait for them with `findBy...`.

## Test data

- **Build data from the generated types**, with a small builder per test file that takes `Partial<...>` overrides, so each test states only what it cares about.
- **Shared leaf builders** live in `test/javascript/fixtures/` (e.g. `buildBucket`, `buildStandardBuckets`, `buildRegistrationPolicy`). They return the full generated type, which any GraphQL fragment type that picks a subset of the fields accepts. Add one when the same small shape is being rebuilt in several files; don't add one for a big shape that every query picks different fields from.
- Don't cast with `as unknown as` to make a fixture fit: if the types don't line up, the fixture (or the code) is wrong.

## Things to know about the environment

- **Modals stay `aria-hidden` in jsdom**, so role queries inside one need `{ hidden: true }` (e.g. `getByRole('button', { name: 'OK', hidden: true })`). A closed modal's element also lingers because jsdom never finishes the fade transition; assert on its contents instead of the element.
- **jsdom has no layout.** Anything that depends on measurement (scroll positions, popper placement, element sizes) can't be asserted on.
- **jsdom's `crypto.subtle` can't hash its own byte arrays**, so real PKCE challenge generation fails there. Mock `generatePKCEChallenge` (see `authenticationManager.test.ts`).
- **The Testing Library packages are inlined in `vitest.config.mts`** so that React Testing Library and `user-event` share one copy of `@testing-library/dom`. Without that, `userEvent` interactions aren't wrapped in `act` and every one logs a warning. If you add another package that wraps Testing Library, inline it too.
- React 19 hoists `<title>` and `<meta>` into `document.head`, so check `document.title` rather than the rendered container.
- Mocking a module with `vi.mock` only affects modules Vite processes; dependencies that are externalized load natively and aren't intercepted (add them to `server.deps.inline` if you must).
