import { useState } from 'react';
import { vi } from 'vitest';

import { act, render, userEvent } from '../testUtils';
import FileInputWithPreview from '../../../app/javascript/CmsAdmin/CmsFilesAdmin/FileInputWithPreview';

function StatefulFileInputWithPreview({
  existingFileUrl,
  initialFile,
  onChangeSpy,
}: {
  existingFileUrl?: string;
  initialFile?: File | null;
  onChangeSpy?: (file: File | null | undefined) => void;
}) {
  const [file, setFile] = useState<File | null | undefined>(initialFile);

  return (
    <FileInputWithPreview
      existingFileUrl={existingFileUrl}
      file={file}
      onChange={(newFile) => {
        onChangeSpy?.(newFile);
        setFile(newFile);
      }}
    />
  );
}

// FileReader whose reads only complete when the test says so, so we can look at the state in between
class ControlledFileReader {
  static pending: ControlledFileReader[] = [];
  result: string | null = null;
  private file: File | undefined;
  private loadListeners: (() => void)[] = [];

  addEventListener(eventName: string, listener: () => void) {
    if (eventName === 'load') {
      this.loadListeners.push(listener);
    }
  }

  readAsDataURL(file: File) {
    this.file = file;
    ControlledFileReader.pending.push(this);
  }

  async finish() {
    this.result = dataUrlFor(this.file?.name ?? '', this.file?.type ?? '');
    await act(async () => this.loadListeners.forEach((listener) => listener()));
  }

  static async finishAll() {
    const readers = ControlledFileReader.pending.splice(0);
    for (const reader of readers) {
      await reader.finish();
    }
  }
}

const dataUrlFor = (content: string, type: string) => `data:${type};base64,${btoa(content)}`;

describe('FileInputWithPreview', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
    ControlledFileReader.pending = [];
    vi.stubGlobal('FileReader', ControlledFileReader);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows a file input when there is no file', async () => {
    const { getByLabelText, queryByRole } = await render(<StatefulFileInputWithPreview />);

    expect(getByLabelText('File', { exact: false })).toHaveAttribute('type', 'file');
    expect(queryByRole('button')).toBeNull();
  });

  it('reports the chosen file', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = await render(<StatefulFileInputWithPreview onChangeSpy={onChange} />);
    const chosen = new File(['hello'], 'hello.png', { type: 'image/png' });

    await user.upload(getByLabelText('File', { exact: false }), chosen);

    expect(onChange).toHaveBeenCalledWith(chosen);
  });

  it('previews the chosen file once it has been read', async () => {
    const { getByLabelText, findByRole, queryByRole } = await render(<StatefulFileInputWithPreview />);

    await user.upload(getByLabelText('File', { exact: false }), new File(['one'], 'one.png', { type: 'image/png' }));
    expect(queryByRole('img')).toBeNull();

    await ControlledFileReader.finishAll();

    const image = await findByRole('img', { name: 'one.png' });
    expect(image).toHaveAttribute('src', dataUrlFor('one.png', 'image/png'));
  });

  it('does not show the previous file’s preview while a newly chosen file is being read', async () => {
    const { getByLabelText, getByRole, findByRole, queryByRole } = await render(<StatefulFileInputWithPreview />);

    await user.upload(getByLabelText('File', { exact: false }), new File(['one'], 'one.png', { type: 'image/png' }));
    await ControlledFileReader.finishAll();
    await findByRole('img', { name: 'one.png' });

    await user.click(getByRole('button'));
    expect(queryByRole('img')).toBeNull();

    await user.upload(getByLabelText('File', { exact: false }), new File(['two'], 'two.png', { type: 'image/png' }));

    // the second file hasn't been read yet, so there must be no (stale) image
    expect(queryByRole('img')).toBeNull();

    await ControlledFileReader.finishAll();
    const image = await findByRole('img', { name: 'two.png' });
    expect(image).toHaveAttribute('src', dataUrlFor('two.png', 'image/png'));
  });

  it('shows the existing file when no file has been chosen, and clears it', async () => {
    const onChange = vi.fn();
    const { getByRole, getByLabelText } = await render(
      <StatefulFileInputWithPreview existingFileUrl="https://example.com/existing.png" onChangeSpy={onChange} />,
    );

    expect(getByRole('img')).toHaveAttribute('src', 'https://example.com/existing.png');

    await user.click(getByRole('button'));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(getByLabelText('File', { exact: false })).toHaveAttribute('type', 'file');
  });
});
