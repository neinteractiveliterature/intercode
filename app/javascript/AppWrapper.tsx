import { Suspense, useCallback, useRef, useEffect, ReactNode, useState, useMemo, useContext } from 'react';
import * as React from 'react';
import { DataProxy } from '@apollo/client';
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

import AuthenticationModalContext, {
  useAuthenticationModalProvider,
} from './Authentication/AuthenticationModalContext';
import AuthenticationModal from './Authentication/AuthenticationModal';
import { AuthenticityTokensContext } from './AuthenticityTokensContext';
import getI18n from './setupI18Next';
import RailsDirectUploadsContext from './RailsDirectUploadsContext';
import { DateTime, Duration } from 'luxon';

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
  const { recaptchaSiteKey } = props;
  // TODO bring this back when we re-add prompting
  // const confirm = useConfirm();
  const manager = useContext(AuthenticityTokensContext);
  const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
  const {
    open: openAuthenticationModal,
    unauthenticatedError,
    setUnauthenticatedError,
  } = authenticationModalContextValue;
  const openSignIn = useCallback(async () => {
    setUnauthenticatedError(true);
    await manager.refresh();
    openAuthenticationModal({ currentView: 'signIn' });
  }, [openAuthenticationModal, setUnauthenticatedError, manager]);
  const onUnauthenticatedRef = useRef(openSignIn);
  useEffect(() => {
    onUnauthenticatedRef.current = openSignIn;
  }, [openSignIn]);

  const railsDirectUploadsContextValue = useMemo(
    () => ({
      railsDirectUploadsUrl: props.railsDirectUploadsUrl,
      railsDefaultActiveStorageServiceName: props.railsDefaultActiveStorageServiceName,
    }),
    [props.railsDirectUploadsUrl, props.railsDefaultActiveStorageServiceName],
  );

  return (
    <React.StrictMode>
      <Confirm>
        <RailsDirectUploadsContext.Provider value={railsDirectUploadsContextValue}>
          {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
          <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
            <>
              {!unauthenticatedError && (
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
              )}
              <AuthenticationModal />
            </>
          </AuthenticationModalContext.Provider>
        </RailsDirectUploadsContext.Provider>
      </Confirm>
    </React.StrictMode>
  );
}

export type AppWrapperProps = {
  queryData?: DataProxy.WriteQueryOptions<unknown, unknown>[];
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
  recaptchaSiteKey: string;
};
