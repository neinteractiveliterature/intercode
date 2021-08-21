import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../../UIComponents/DropdownMenu';

export type AddToCalendarDropdownProps = {
  icalSecret: string;
  className?: string;
};

function AddToCalendarDropdown({ icalSecret, className }: AddToCalendarDropdownProps) {
  const { t } = useTranslation();
  const icalUrl = new URL(
    `/calendars/user_schedule/${encodeURIComponent(icalSecret)}`,
    window.location.href,
  );
  icalUrl.protocol = 'webcal';
  const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
    icalUrl.toString(),
  )}`;

  return (
    <DropdownMenu
      buttonClassName={`${className ?? 'btn btn-outline-secondary'} dropdown-toggle`}
      buttonContent={
        <>
          <i className="bi-calendar3" aria-hidden />
          <span className="visually-hidden">
            {t('addToCalendarDropdown.title', 'Add to calendar')}
          </span>
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
        <i className="bi-google" aria-hidden />{' '}
        {t('addToCalendarDropdown.subscribeGoogle', 'Subscribe on Google Calendar')}
      </a>
      <a className="dropdown-item" href={icalUrl.toString()}>
        <i className="bi-calendar3" aria-hidden />{' '}
        {t('addToCalendarDropdown.subscribeICal', 'Subscribe via iCal')}
      </a>
      <CopyToClipboardButton
        className="dropdown-item"
        text={icalUrl.toString()}
        copiedProps={{ className: 'dropdown-item text-success' }}
        defaultText={t('addToCalendarDropdown.copyWebcal', 'Copy webcal:// link')}
        copiedText={t('copyToClipboard.defaultSuccess', 'Copied!')}
        iconSet="bootstrap-icons"
      />
    </DropdownMenu>
  );
}

export default AddToCalendarDropdown;
