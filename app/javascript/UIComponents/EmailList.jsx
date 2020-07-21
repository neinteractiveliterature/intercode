import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import CopyToClipboardButton from './CopyToClipboardButton';

function formatEmail({ email, name }) {
  if (name.match(/[^0-9A-Za-z ]/)) {
    return `"${name.replace(/"/g, '\\"')}" <${email}>`;
  }

  return `${name} <${email}>`;
}

function EmailList({ emails, separator, renderToolbarContent }) {
  const { t } = useTranslation();
  const addresses = emails.map(formatEmail).join(separator);
  const mailtoParams = new URLSearchParams();
  mailtoParams.append('bcc', addresses);
  const mailtoLink = `mailto:?bcc=${addresses}`;

  const textareaRows = (emails.length > 80 ? (emails.length / 4) : 20);

  return (
    <>
      <div className="d-flex align-items-baseline mb-2">
        <div className="flex-grow-1">
          <a href={mailtoLink} className="btn btn-secondary mr-2">
            <i className="fa fa-envelope" />
            {' '}
            {t('buttons.composeEmail', 'Compose email')}
          </a>

          <CopyToClipboardButton
            className="btn btn-secondary mr-2"
            data-clipboard-text={addresses}
            copiedProps={{
              className: 'btn btn-outline-secondary mr-2',
            }}
          />
        </div>
        {
          renderToolbarContent
            ? renderToolbarContent()
            : null
        }
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

EmailList.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
  separator: PropTypes.string.isRequired,
  renderToolbarContent: PropTypes.func,
};

EmailList.defaultProps = {
  renderToolbarContent: null,
};

export default EmailList;
