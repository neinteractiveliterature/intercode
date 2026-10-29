import { describe, expect, test } from 'vitest';
import { lazyRoute } from './lazyRoute';

describe('lazyRoute', () => {
  test('renames clientLoader and clientAction to loader and action', async () => {
    const clientLoader = () => null;
    const clientAction = () => null;
    const Component = () => null;
    const route = await lazyRoute(async () => ({ clientLoader, clientAction, Component }))();
    expect(route).toEqual({ loader: clientLoader, action: clientAction, Component });
  });

  test('leaves out loader and action when the module has neither', async () => {
    const Component = () => null;
    const route = await lazyRoute(async () => ({ Component }))();
    expect(Object.keys(route)).toEqual(['Component']);
  });

  test('passes other exports through', async () => {
    const ErrorBoundary = () => null;
    const route = await lazyRoute(async () => ({ ErrorBoundary }))();
    expect(route).toEqual({ ErrorBoundary });
  });

  test('maps a default export to Component', async () => {
    const Page = () => null;
    const route = await lazyRoute(async () => ({ default: Page }))();
    expect(route).toEqual({ Component: Page });
  });
});
