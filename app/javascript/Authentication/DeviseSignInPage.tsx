import { useContext } from 'react';
import { AuthenticityTokensContext } from '../AuthenticityTokensContext';
import usePageTitle from '../usePageTitle';

function DeviseSignInPage() {
  const manager = useContext(AuthenticityTokensContext);
  const authenticityToken = manager.tokens?.signIn;
  usePageTitle('Sign In');

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title h4 mb-4">Sign In</h2>
              <form action="/users/sign_in" method="post">
                <input type="hidden" name="authenticity_token" value={authenticityToken ?? ''} />
                <div className="mb-3">
                  <label htmlFor="user_email" className="form-label">
                    Email
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
                    Password
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
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={!authenticityToken}>
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = DeviseSignInPage;
