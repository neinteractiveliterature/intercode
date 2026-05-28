import { Suspense, ReactNode, useState, useMemo, useEffect } from 'react';
import { Outlet } from 'react-router';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  Confirm,
  // TODO bring this back when we re-add prompting
  // useConfirm,
  PageLoadingIndicator,
  AlertProvider,
  ErrorBoundary,
  ErrorDisplay,
  ToastProvider,
} from '@neinteractiveliterature/litform';

import getI18n from './setupI18Next';
import RailsDirectUploadsContext from './RailsDirectUploadsContext';
import { DateTime, Duration } from 'luxon';
import { ApolloClient, OperationVariables } from '@apollo/client';

function I18NextWrapper({ children }: { children: (i18nInstance: i18n) => ReactNode }) {
  const [i18nInstance, seti18nInstance] = useState<i18n>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    getI18n()
      .then((instance) => seti18nInstance(instance))
      .catch((err) => setError(err));
  }, []);

  if (i18nInstance) {
    return <I18nextProvider i18n={i18nInstance}>{children(i18nInstance)}</I18nextProvider>;
  }

  if (error) {
    return <ErrorDisplay stringError={error.message} />;
  }

  return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
}

export function ProviderStack(props: AppWrapperProps) {
  // TODO bring this back when we re-add prompting
  // const confirm = useConfirm();

  const railsDirectUploadsContextValue = useMemo(
    () => ({
      railsDirectUploadsUrl: props.railsDirectUploadsUrl,
      railsDefaultActiveStorageServiceName: props.railsDefaultActiveStorageServiceName,
    }),
    [props.railsDirectUploadsUrl, props.railsDefaultActiveStorageServiceName],
  );

  return (
    <Confirm>
      <RailsDirectUploadsContext.Provider value={railsDirectUploadsContextValue}>
        {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
        <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
          <I18NextWrapper>
            {(i18nInstance) => (
              <AlertProvider okText={i18nInstance.t('buttons.ok', 'OK')}>
                <ToastProvider
                  formatTimeAgo={(timeAgo) =>
                    DateTime.now().minus(Duration.fromMillis(timeAgo.milliseconds)).toRelative()
                  }
                >
                  <ErrorBoundary placement="replace" errorType="plain">
                    <Outlet />
                  </ErrorBoundary>
                </ToastProvider>
              </AlertProvider>
            )}
          </I18NextWrapper>
        </Suspense>
      </RailsDirectUploadsContext.Provider>
    </Confirm>
  );
}

export type AppWrapperProps = {
  queryData?: ApolloClient.WriteQueryOptions<unknown, OperationVariables>[];
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
};
