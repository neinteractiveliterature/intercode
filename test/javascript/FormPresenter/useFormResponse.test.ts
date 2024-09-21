import { renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import useFormResponse from '../../../app/javascript/FormPresenter/useFormResponse';

describe('useFormResponse', () => {
  it('extracts attributes from the form response', () => {
    const model = { form_response_attrs: { color: 'blue' } };
    const setModel = vi.fn();
    const { result } = renderHook(() => useFormResponse(model, setModel));
    const [formResponse] = result.current;
    expect(formResponse).toEqual({ color: 'blue' });
  });

  it('changes the form response', () => {
    const model = { form_response_attrs: { color: 'blue' } };
    const setModel = vi.fn();
    const { result } = renderHook(() => useFormResponse(model, setModel));
    const [, formResponseAttrsChanged] = result.current;

    formResponseAttrsChanged({ color: 'green' });
    expect(setModel).toHaveBeenCalledTimes(1);

    const nextModel = setModel.mock.calls[0][0](model);
    expect(nextModel.form_response_attrs.color).toEqual('green');
  });
});
