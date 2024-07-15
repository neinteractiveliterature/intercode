import { Suspense, useCallback, useRef, useEffect, ReactNode, useState, useMemo } from 'react';
import * as React from 'react';
import { ApolloProvider, DataProxy } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
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
import { HelmetProvider } from 'react-helmet-async';

import AuthenticationModalContext, {
  useAuthenticationModalProvider,
} from './Authentication/AuthenticationModalContext';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import useIntercodeApolloClient from './useIntercodeApolloClient';
import MapboxContext, { useMapboxContext } from './MapboxContext';
import getI18n from './setupI18Next';
import RailsDirectUploadsContext from './RailsDirectUploadsContext';
import { BrowserContentParserProvider } from './BrowserAppShell';

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

export type AppWrapperInnerProps = {
  authenticityTokens: {
    graphql: string;
  };
  children: ReactNode;
  mapboxAccessToken: string;
  queryData?: DataProxy.WriteQueryOptions<unknown, unknown>[];
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
  recaptchaSiteKey: string;
  stripePublishableKey: string;
};

export function AppWrapperInner(props: AppWrapperInnerProps) {
  const { mapboxAccessToken } = props;
  // TODO bring this back when we re-add prompting
  // const confirm = useConfirm();

  const railsDirectUploadsContextValue = useMemo(
    () => ({
      railsDirectUploadsUrl: props.railsDirectUploadsUrl,
      railsDefaultActiveStorageServiceName: props.railsDefaultActiveStorageServiceName,
    }),
    [props.railsDirectUploadsUrl, props.railsDefaultActiveStorageServiceName],
  );

  // TODO bring this back when we re-add prompting
  // const getUserConfirmation = useCallback(
  //   (message: ReactNode, callback: (confirmed: boolean) => void) => {
  //     confirm({
  //       prompt: message,
  //       action: () => callback(true),
  //       onCancel: () => callback(false),
  //     });
  //   },
  //   [confirm],
  // );

  const mapboxContextValue = useMapboxContext({ mapboxAccessToken });

  return (
    <Confirm>
      <HelmetProvider>
        {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
        <RailsDirectUploadsContext.Provider value={railsDirectUploadsContextValue}>
          <MapboxContext.Provider value={mapboxContextValue}>
            <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
              <I18NextWrapper>
                {(i18nInstance) => (
                  <AlertProvider okText={i18nInstance.t('buttons.ok', 'OK')}>
                    <ToastProvider>
                      <ErrorBoundary placement="replace" errorType="plain">
                        {props.children}
                      </ErrorBoundary>
                    </ToastProvider>
                  </AlertProvider>
                )}
              </I18NextWrapper>
            </Suspense>
          </MapboxContext.Provider>
        </RailsDirectUploadsContext.Provider>
      </HelmetProvider>
    </Confirm>
  );
}

function BrowserAppWrapper(props: AppWrapperInnerProps) {
  const authenticityTokensProviderValue = useAuthenticityTokens(props.authenticityTokens);
  const { graphql: authenticityToken, refresh } = authenticityTokensProviderValue;
  const authenticationModalContextValue = useAuthenticationModalProvider(props.recaptchaSiteKey);
  const {
    open: openAuthenticationModal,
    unauthenticatedError,
    setUnauthenticatedError,
  } = authenticationModalContextValue;
  const openSignIn = useCallback(async () => {
    setUnauthenticatedError(true);
    await refresh();
    openAuthenticationModal({ currentView: 'signIn' });
  }, [openAuthenticationModal, setUnauthenticatedError, refresh]);
  const onUnauthenticatedRef = useRef(openSignIn);
  useEffect(() => {
    onUnauthenticatedRef.current = openSignIn;
  }, [openSignIn]);

  const apolloClient = useIntercodeApolloClient(authenticityToken, onUnauthenticatedRef, props.queryData);

  if (!apolloClient) {
    // we need one render cycle to initialize the client
    return <></>;
  }

  return (
    <React.StrictMode>
      <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter basename="/">
            <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
              <>
                {!unauthenticatedError && <AppWrapperInner {...props} />}
                <AuthenticationModal />
              </>
            </AuthenticationModalContext.Provider>
          </BrowserRouter>
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </React.StrictMode>
  );
}

export function wrapBrowserApp<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  const Wrapped = (props: P & Omit<AppWrapperInnerProps, 'children'>) => {
    const {
      authenticityTokens,
      mapboxAccessToken,
      railsDefaultActiveStorageServiceName,
      railsDirectUploadsUrl,
      recaptchaSiteKey,
      stripePublishableKey,
      i18nIsDynamicList,
      queryData,
      ...componentProps
    } = props;
    return (
      <BrowserContentParserProvider>
        <BrowserAppWrapper
          authenticityTokens={authenticityTokens}
          mapboxAccessToken={mapboxAccessToken}
          railsDefaultActiveStorageServiceName={railsDefaultActiveStorageServiceName}
          railsDirectUploadsUrl={railsDirectUploadsUrl}
          recaptchaSiteKey={recaptchaSiteKey}
          stripePublishableKey={stripePublishableKey}
          i18nIsDynamicList={i18nIsDynamicList}
          queryData={queryData}
        >
          <WrappedComponent {...(componentProps as unknown as P)} />
        </BrowserAppWrapper>
      </BrowserContentParserProvider>
    );
  };

  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  Wrapped.displayName = `BrowserAppWrapper(${wrappedComponentDisplayName})`;
  return Wrapped;
}

export default BrowserAppWrapper;
