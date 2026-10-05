import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import FileUploadForm from '../../../app/javascript/BuiltInForms/FileUploadForm';

// DirectUpload talks to Rails over XHR; here each test decides how the upload ends
const upload = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('@rails/activestorage', () => ({
  DirectUpload: class {
    create(callback: (error: Error | null, blob?: unknown) => void) {
      upload.create(callback);
    }
  },
}));

describe('FileUploadForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const photo = new File(['pixels'], 'photo.png', { type: 'image/png' });

  beforeEach(() => {
    user = userEvent.setup();
    upload.create.mockReset();
  });

  const chooseFile = async (container: HTMLElement) => {
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, photo);
  };

  it('uploads the chosen file, hands the blob to onUpload, and clears the file input', async () => {
    const blob = { signed_id: 'abc' };
    upload.create.mockImplementation((callback) => callback(null, blob));
    const onUpload = vi.fn();
    const { container, getByRole } = await render(<FileUploadForm onUpload={onUpload} />);

    await chooseFile(container);
    await user.click(getByRole('button', { name: 'Upload' }));

    await waitFor(() => expect(onUpload).toHaveBeenCalledWith(blob, photo));
    // with no file chosen any more, the Upload button is disabled again
    await waitFor(() => expect(getByRole('button', { name: 'Upload' })).toBeDisabled());
  });

  it('shows the error and keeps the chosen file when the upload fails', async () => {
    upload.create.mockImplementation((callback) => callback(new Error('Upload failed: network down')));
    const onUpload = vi.fn();
    const { container, getByRole, findByText } = await render(<FileUploadForm onUpload={onUpload} />);

    await chooseFile(container);
    await user.click(getByRole('button', { name: 'Upload' }));

    expect(await findByText(/Upload failed: network down/)).toBeTruthy();
    expect(onUpload).not.toHaveBeenCalled();
    // the file is still chosen, so the attendee can try again
    expect(getByRole('button', { name: 'Upload' })).toBeEnabled();
  });

  it('shows the error if onUpload fails', async () => {
    upload.create.mockImplementation((callback) => callback(null, { signed_id: 'abc' }));
    const onUpload = vi.fn().mockRejectedValue(new Error('Could not attach file'));
    const { container, getByRole, findByText } = await render(<FileUploadForm onUpload={onUpload} />);

    await chooseFile(container);
    await user.click(getByRole('button', { name: 'Upload' }));

    expect(await findByText(/Could not attach file/)).toBeTruthy();
    expect(getByRole('button', { name: 'Upload' })).toBeEnabled();
  });
});
