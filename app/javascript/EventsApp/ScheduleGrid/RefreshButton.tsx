import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import useAsyncFunction from '../../useAsyncFunction';

export type RefreshButtonProps = {
  refreshData: () => Promise<any>;
};

function RefreshButton({ refreshData }: RefreshButtonProps) {
  const { t } = useTranslation();
  const [refreshAsync, , refreshInProgress] = useAsyncFunction(refreshData);

  return (
    <button
      className="btn btn-link"
      type="button"
      disabled={refreshInProgress}
      onClick={refreshAsync}
    >
      <i className={classNames('bi-arrow-clockwise', { spin: refreshInProgress })} />
      <span className="d-none d-md-inline"> {t('buttons.refresh', 'Refresh')}</span>
    </button>
  );
}

export default RefreshButton;
