import { vi } from 'vitest';
import { act } from '@testing-library/react';
import { render, userEvent, waitFor } from '../testUtils';
import SearchNavigationItem from '../../../app/javascript/NavigationBar/SearchNavigationItem';

const { showContent } = vi.hoisted(() => ({ showContent: { now: () => {} } }));

vi.mock('../../../app/javascript/contentShown', () => ({
  afterContentShown: () =>
    new Promise<void>((resolve) => {
      showContent.now = resolve;
    }),
}));

describe('SearchNavigationItem', () => {
  const searchBox = (container: HTMLElement) => container.querySelector('.site-search');

  it('loads the search box once the content has been shown', async () => {
    const { container } = await render(<SearchNavigationItem />);
    expect(searchBox(container)).toBeNull();

    await act(async () => showContent.now());

    await waitFor(() => expect(searchBox(container)).not.toBeNull());
  });

  it('loads the search box when the button is clicked before that', async () => {
    const user = userEvent.setup();
    const { container, getByRole } = await render(<SearchNavigationItem />);

    await user.click(getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(searchBox(container)).not.toBeNull());
    await waitFor(() => expect(container.querySelector('.site-search input')).toHaveFocus());
  });

  it('opens with the keyboard shortcut', async () => {
    const user = userEvent.setup();
    const { container } = await render(<SearchNavigationItem />);
    await act(async () => showContent.now());
    await waitFor(() => expect(searchBox(container)).not.toBeNull());

    await user.keyboard('{Control>}/{/Control}');

    await waitFor(() => expect(container.querySelector('.site-search input')).toHaveFocus());
  });
});
