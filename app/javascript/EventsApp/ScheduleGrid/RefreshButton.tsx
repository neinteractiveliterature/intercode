import React from 'react';
import classNames from 'classnames';
import useAsyncFunction from '../../useAsyncFunction';

export type RefreshButtonProps = {
  refreshData: () => Promise<any>,
};

function RefreshButton({ refreshData }: RefreshButtonProps) {
  const [refreshAsync, , refreshInProgress] = useAsyncFunction(refreshData);

  return (
    <button
      className="btn btn-link"
      type="button"
      disabled={refreshInProgress}
      onClick={refreshAsync}
    >
      <i className={classNames('fa fa-refresh', { 'fa-spin': refreshInProgress })} />
      <span className="d-none d-md-inline"> Refresh</span>
    </button>
  );
}

export default RefreshButton;
