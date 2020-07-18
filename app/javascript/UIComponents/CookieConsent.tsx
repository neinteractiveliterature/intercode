import React from 'react';
import ReactCookieConsent from 'react-cookie-consent';
import { Trans, useTranslation } from 'react-i18next';

export type CookieConsentProps = {
  cookiePolicyUrl: string,
};

function CookieConsent({ cookiePolicyUrl }) {
  const { t } = useTranslation();

  return (
    <ReactCookieConsent
      location="bottom"
      buttonText={t('cookieConsent.buttonText', 'I understand')}
      buttonClasses="btn btn-warning mr-2"
      overlay
      overlayClasses="fixed-bottom bg-dark text-white py-2"
      disableStyles
      containerClasses="container d-flex align-items-center"
      contentClasses="flex-grow-1"
    >
      <div className="container">
        <Trans i18nKey="cookieConsent.text">
          This web site uses cookies to enhance the user experience.  For more information,
          please see
          {' '}
          <a
            href={cookiePolicyUrl}
            target="_blank"
            rel="noreferrer"
            className="text-warning"
          >
            our cookie policy
          </a>
          .
        </Trans>
      </div>
    </ReactCookieConsent>
  );
}

export default CookieConsent;
