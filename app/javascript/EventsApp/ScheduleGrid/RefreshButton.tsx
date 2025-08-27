import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import useAsyncFunction from '../../useAsyncFunction';

export type RefreshButtonProps = {
  refreshData: () => Promise<unknown>;
};

function RefreshButton({ refreshData }: RefreshButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const [refreshAsync, , refreshInProgress] = useAsyncFunction(refreshData);

  return (
    <button
      className="btn btn-link"
      type="button"
      disabled={refreshInProgress}
      onClick={refreshAsync}
      aria-label={t('buttons.refresh')}
    >
      <i className={classNames('bi-arrow-clockwise', { spin: refreshInProgress })} />
      <span className="d-none d-md-inline">
        <> {t('buttons.refresh')}</>
      </span>
    </button>
  );
}

export default RefreshButton;
