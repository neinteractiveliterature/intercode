import { useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';

export default function FourOhFourPage(): JSX.Element {
  const location = useLocation();

  return (
    <div className="alert alert-warning">
      <Trans i18nKey="errors.404">
        <h1>Oops!</h1>

        <p className="mb-0">
          We couldn’t find a page at the location {{ pathname: location.pathname }}.
        </p>
      </Trans>
    </div>
  );
}
