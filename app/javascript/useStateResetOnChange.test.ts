import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import useStateResetOnChange from './useStateResetOnChange';

describe('useStateResetOnChange', () => {
  test('starts out as the value', () => {
    const { result } = renderHook(() => useStateResetOnChange('a'));
    expect(result.current[0]).toEqual('a');
  });

  test('can be changed without the value changing', () => {
    const { result } = renderHook(() => useStateResetOnChange('a'));
    act(() => result.current[1]('edited'));
    expect(result.current[0]).toEqual('edited');
  });

  test('goes back to the value when it changes', () => {
    const { result, rerender } = renderHook(({ value }) => useStateResetOnChange(value), {
      initialProps: { value: 'a' },
    });
    act(() => result.current[1]('edited'));
    rerender({ value: 'b' });
    expect(result.current[0]).toEqual('b');
  });

  test('keeps edits across rerenders with the same value', () => {
    const { result, rerender } = renderHook(({ value }) => useStateResetOnChange(value), {
      initialProps: { value: 'a' },
    });
    act(() => result.current[1]('edited'));
    rerender({ value: 'a' });
    expect(result.current[0]).toEqual('edited');
  });

  test('goes back to the value when the reset key changes, and not before', () => {
    const { result, rerender } = renderHook(({ resetKey }) => useStateResetOnChange(false, resetKey), {
      initialProps: { resetKey: '/a' },
    });
    act(() => result.current[1](true));
    rerender({ resetKey: '/a' });
    expect(result.current[0]).toBe(true);
    rerender({ resetKey: '/b' });
    expect(result.current[0]).toBe(false);
  });
});
