import { useContext } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import AppRootContext from '../AppRootContext';
import usePageTitle from '../usePageTitle';

function DeviseSignInPage() {
  const { t } = useTranslation();
  const manager = useContext(AuthenticityTokensContext);
  const authenticityToken = manager.tokens?.signIn;
  const { conventionName } = useContext(AppRootContext);
  const header = conventionName
    ? t('authentication.signInForm.headerWithConvention', { conventionName })
    : t('authentication.signInForm.header');
  usePageTitle(header);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="lead">{header}</div>
            </div>
            <div className="card-body p-4">
              <form action="/users/sign_in" method="post">
                <input type="hidden" name="authenticity_token" value={authenticityToken ?? ''} />
                <div className="mb-3">
                  <label htmlFor="user_email" className="form-label">
                    {t('authentication.signInForm.emailLabel')}
                  </label>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <input
                    type="email"
                    id="user_email"
                    name="user[email]"
                    autoFocus
                    autoComplete="email"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="user_password" className="form-label">
                    {t('authentication.signInForm.passwordLabel')}
                  </label>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <input
                    type="password"
                    id="user_password"
                    name="user[password]"
                    autoComplete="current-password"
                    className="form-control"
                  />
                </div>
                <div className="mb-3 form-check">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <input
                    type="checkbox"
                    id="user_remember_me"
                    name="user[remember_me]"
                    value="1"
                    className="form-check-input"
                  />
                  <label htmlFor="user_remember_me" className="form-check-label">
                    {t('authentication.signInForm.rememberMeLabel')}
                  </label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={!authenticityToken}>
                    {t('authentication.signInForm.logInButton')}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer bg-light">
              <div className="d-flex flex-column align-items-start">
                <Link to="/users/sign_up" className="btn btn-link p-0 mb-1">
                  {t('authentication.signUpLink')}
                </Link>
                <Link to="/users/password/new" className="btn btn-link p-0">
                  {t('authentication.forgotPasswordLink')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = DeviseSignInPage;
