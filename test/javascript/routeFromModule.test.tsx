import { Form, redirect, useLoaderData } from 'react-router';
import { describe, expect, test } from 'vitest';
import { renderRoute, routeFromModule, userEvent } from './testUtils';

// A route module the way the app writes them: clientLoader and clientAction, and a Component
const greetingModule = {
  clientLoader: () => ({ greeting: 'Hello from the loader' }),
  clientAction: async () => redirect('/done'),
  Component: function Greeting() {
    const { greeting } = useLoaderData() as { greeting: string };
    return (
      <Form method="POST">
        <p>{greeting}</p>
        <button type="submit">Submit</button>
      </Form>
    );
  },
};

describe('routeFromModule', () => {
  test('uses the module clientLoader as the loader and its Component to render', async () => {
    const { getByText } = await renderRoute([routeFromModule('/', greetingModule)]);
    expect(getByText('Hello from the loader')).toBeVisible();
  });

  test('uses the module clientAction as the action', async () => {
    const user = userEvent.setup();
    const { getByRole, findByText } = await renderRoute(
      [routeFromModule('/', greetingModule), { path: '/done', Component: () => <h1>Done</h1> }],
      {},
    );
    await user.click(getByRole('button', { name: 'Submit' }));
    expect(await findByText('Done')).toBeVisible();
  });

  test('renders a default export when there is no Component', async () => {
    const { getByText } = await renderRoute([routeFromModule('/', { default: () => <p>From default</p> })]);
    expect(getByText('From default')).toBeVisible();
  });
});
