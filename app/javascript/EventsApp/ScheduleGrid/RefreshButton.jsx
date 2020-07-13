import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import useAsyncFunction from '../../useAsyncFunction';

function RefreshButton({ refreshData }) {
  const { t } = useTranslation();
  const [refreshAsync, , refreshInProgress] = useAsyncFunction(refreshData);

  return (
    <button
      className="btn btn-link"
      type="button"
      disabled={refreshInProgress}
      onClick={refreshAsync}
    >
      <i className={classNames('fa fa-refresh', { 'fa-spin': refreshInProgress })} />
      <span className="d-none d-md-inline">
        {' '}
        {t('buttons.refresh', 'Refresh')}
      </span>
    </button>
  );
}

RefreshButton.propTypes = {
  refreshData: PropTypes.func.isRequired,
};

export default RefreshButton;
