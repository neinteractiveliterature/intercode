import { vi } from 'vitest';
import { render } from '@testing-library/react';
import BootErrorBoundary from '../../app/javascript/BootErrorBoundary';

function Boom(): never {
  throw new Error('boom');
}

describe('BootErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    const { getByText } = render(
      <BootErrorBoundary>
        <div>app content</div>
      </BootErrorBoundary>,
    );

    expect(getByText('app content')).toBeTruthy();
  });

  it('renders a reload fallback instead of a blank page when a child throws', () => {
    // React logs caught boundary errors to console.error; silence it for this case.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { getByRole, queryByText } = render(
        <BootErrorBoundary>
          <Boom />
        </BootErrorBoundary>,
      );

      expect(getByRole('button', { name: /reload/i })).toBeTruthy();
      expect(queryByText('app content')).toBeNull();
    } finally {
      consoleError.mockRestore();
    }
  });
});
