import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton } from '@neinteractiveliterature/litform';

export type EmailListEntry = { email: string; name?: string | null };

function formatEmail({ email, name }: EmailListEntry) {
  if (name?.match(/[^0-9A-Za-z ]/)) {
    return `"${name.replace(/"/g, '\\"')}" <${email}>`;
  }

  return `${name} <${email}>`;
}

export type EmailListProps = {
  emails: EmailListEntry[];
  separator: string;
  renderToolbarContent?: () => ReactNode;
};

function EmailList({ emails, separator, renderToolbarContent }: EmailListProps) {
  const { t } = useTranslation();
  const addresses = emails.map(formatEmail).join(separator);
  const mailtoParams = new URLSearchParams();
  mailtoParams.append('bcc', addresses);
  const mailtoLink = `mailto:?bcc=${addresses}`;

  const textareaRows = emails.length > 80 ? emails.length / 4 : 20;

  return (
    <>
      <div className="d-flex align-items-baseline mb-2">
        <div className="flex-grow-1">
          <a href={mailtoLink} className="btn btn-secondary me-2">
            <i className="bi-envelope-fill" /> {t('buttons.composeEmail', 'Compose email')}
          </a>

          <CopyToClipboardButton
            className="btn btn-secondary me-2"
            text={addresses}
            copiedProps={{
              className: 'btn btn-outline-secondary me-2',
            }}
            defaultText={t('copyToClipboard.defaultText', 'Copy to clipboard')}
            copiedText={t('copyToClipboard.defaultSuccess', 'Copied!')}
            iconSet="bootstrap-icons"
          />
        </div>
        {renderToolbarContent ? renderToolbarContent() : null}
      </div>

      <textarea
        className="form-control"
        readOnly
        rows={textareaRows}
        value={addresses}
        aria-label="Email addresses"
      />
    </>
  );
}

export default EmailList;
