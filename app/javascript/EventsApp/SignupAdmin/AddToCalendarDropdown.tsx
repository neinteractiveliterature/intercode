import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton } from '@neinteractiveliterature/litform';

import { DropdownMenu } from '../../UIComponents/DropdownMenu';

export type AddToCalendarDropdownProps = {
  icalSecret: string;
  className?: string;
};

function AddToCalendarDropdown({ icalSecret, className }: AddToCalendarDropdownProps): React.JSX.Element {
  const { t } = useTranslation();
  const icalUrl = new URL(`/calendars/user_schedule/${encodeURIComponent(icalSecret)}`, window.location.href);
  const icalUrlWithWebcalProtocol = icalUrl.toString().replace(/^https?:/, 'webcal:');
  // eslint-disable-next-line i18next/no-literal-string
  const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icalUrlWithWebcalProtocol)}`;

  return (
    <DropdownMenu
      buttonClassName={`${className ?? 'btn btn-outline-secondary'} dropdown-toggle`}
      buttonContent={
        <>
          <i className="bi-calendar3" aria-hidden />
          <span className="visually-hidden">{t('addToCalendarDropdown.title')}</span>
        </>
      }
      popperOptions={{ placement: 'bottom-end' }}
    >
      <a className="dropdown-item" href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
        <>
          <i className="bi-google" aria-hidden /> {t('addToCalendarDropdown.subscribeGoogle')}
        </>
      </a>
      <a className="dropdown-item" href={icalUrlWithWebcalProtocol}>
        <>
          <i className="bi-calendar3" aria-hidden /> {t('addToCalendarDropdown.subscribeICal')}
        </>
      </a>
      <CopyToClipboardButton
        className="dropdown-item"
        text={icalUrlWithWebcalProtocol}
        copiedProps={{ className: 'dropdown-item text-success' }}
        defaultText={t('addToCalendarDropdown.copyWebcal')}
        copiedText={t('copyToClipboard.defaultSuccess')}
        iconSet="bootstrap-icons"
      />
    </DropdownMenu>
  );
}

export default AddToCalendarDropdown;
