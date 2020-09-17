import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import CopyToClipboardButton from '../../UIComponents/CopyToClipboardButton';
import { DropdownMenu } from '../../UIComponents/DropdownMenu';

function AddToCalendarDropdown({ icalSecret, className }) {
  const { t } = useTranslation();
  const icalUrl = new URL(
    `/calendars/user_schedule/${encodeURIComponent(icalSecret)}`,
    window.location.href,
  );
  icalUrl.protocol = 'webcal';
  const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
    icalUrl,
  )}`;

  return (
    <DropdownMenu
      buttonClassName={`${className} dropdown-toggle`}
      buttonContent={
        <>
          <i className="fa fa-calendar" aria-hidden />
          <span className="sr-only">{t('addToCalendarDropdown.title', 'Add to calendar')}</span>
        </>
      }
      popperOptions={{ placement: 'bottom-end' }}
    >
      <a
        className="dropdown-item"
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-google" aria-hidden />{' '}
        {t('addToCalendarDropdown.subscribeGoogle', 'Subscribe on Google Calendar')}
      </a>
      <a className="dropdown-item" href={icalUrl}>
        <i className="fa fa-calendar" aria-hidden />{' '}
        {t('addToCalendarDropdown.subscribeICal', 'Subscribe via iCal')}
      </a>
      <CopyToClipboardButton
        className="dropdown-item"
        data-clipboard-text={icalUrl}
        copiedProps={{ className: 'dropdown-item text-success' }}
        defaultText={t('addToCalendarDropdown.copyWebcal', 'Copy webcal:// link')}
      />
    </DropdownMenu>
  );
}

AddToCalendarDropdown.propTypes = {
  icalSecret: PropTypes.string.isRequired,
  className: PropTypes.string,
};

AddToCalendarDropdown.defaultProps = {
  className: 'btn btn-outline-secondary',
};

export default AddToCalendarDropdown;
