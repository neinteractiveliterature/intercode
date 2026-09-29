import { ReactNode, useContext } from 'react';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { AuthenticationManagerContext } from '../Authentication/authenticationManager';
import useAsyncFunction from '../useAsyncFunction';

// The blob: page we open has no useful base URL, so relative asset URLs in the report
// (stylesheets, etc.) would break. Point them back at our own origin.
function addBaseHref(html: string): string {
   
  return html.replace(/<head>/i, `<head><base href="${window.location.origin}/">`);
}

// Printable reports are authenticated the same way GraphQL requests are (a bearer token
// from AuthenticationManager, since OIDC sign-in never establishes a cookie session Rails
// can see). A plain <a href> navigation can't attach that header, so we fetch the report
// HTML ourselves and hand the browser a blob to display.
async function openReport(url: string, token: string | undefined, reportWindow: Window | null) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      // eslint-disable-next-line i18next/no-literal-string
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { credentials: 'same-origin', headers });
    if (!response.ok) {
      throw new Error(`Report failed: HTTP ${response.status}`);
    }

    const html = addBaseHref(await response.text());
    // Not revoked: the tab needs the URL to stay valid for reloads, and it's freed when this page closes.
    const objectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));

    if (reportWindow) {
      reportWindow.location.href = objectUrl;
    } else {
      window.open(objectUrl, '_blank');
    }
  } catch (error) {
    reportWindow?.close();
    throw error;
  }
}

export type PrintableReportLinkProps = {
  path: string;
  children: ReactNode;
};

function PrintableReportLink({ path, children }: PrintableReportLinkProps): React.JSX.Element {
  const authenticationManager = useContext(AuthenticationManagerContext);
  const [openReportAsync, error, inProgress] = useAsyncFunction(openReport, { suppressError: true });

  const onClick = async () => {
    // Open the tab synchronously, inside the click handler, so popup blockers allow it;
    // we point it at the report once the fetch finishes.
    const reportWindow = window.open('', '_blank');
    const token = await authenticationManager.ensureFreshAccessToken();
    await openReportAsync(path, token, reportWindow);
  };

  return (
    <>
      <button type="button" className="btn btn-link p-0 align-baseline" onClick={onClick} disabled={inProgress}>
        {children}
      </button>
      <ErrorDisplay stringError={error?.message} />
    </>
  );
}

export default PrintableReportLink;
