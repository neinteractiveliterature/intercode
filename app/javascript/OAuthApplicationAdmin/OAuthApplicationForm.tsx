import { OAuthApplicationInput } from '../graphqlTypes.generated';
import SCOPE_DESCRIPTIONS from './scopeDescriptions';

export type EditingOAuthApplication = Pick<OAuthApplicationInput, 'name' | 'redirect_uri' | 'scopes' | 'confidential'>;

type OAuthApplicationFormProps = {
  value: EditingOAuthApplication;
  onChange: (value: EditingOAuthApplication) => void;
  readOnlyFields?: string[];
};

function OAuthApplicationForm({ value, onChange, readOnlyFields = [] }: OAuthApplicationFormProps) {
  const scopes = value.scopes ?? [];

  const toggleScope = (scope: string) => {
    const updated = scopes.includes(scope) ? scopes.filter((s) => s !== scope) : [...scopes, scope];
    onChange({ ...value, scopes: updated });
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="oauth-application-name" className="form-label fw-bold">
          Name
        </label>
        <input
          aria-label="Name"
          id="oauth-application-name"
          type="text"
          className="form-control"
          value={value.name ?? ''}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          required
        />
      </div>

      {!readOnlyFields.includes('redirect_uri') && (
        <div className="mb-3">
          <label htmlFor="oauth-application-redirect-uri" className="form-label fw-bold">
            Redirect URI
          </label>
          <textarea
            aria-label="Redirect URI"
            id="oauth-application-redirect-uri"
            className="form-control"
            value={value.redirect_uri ?? ''}
            onChange={(e) => onChange({ ...value, redirect_uri: e.target.value })}
            rows={3}
          />
          <div className="form-text text-secondary">Enter one redirect URI per line.</div>
        </div>
      )}

      <div className="mb-3">
        <div className="form-label fw-bold">Scopes</div>
        {!readOnlyFields.includes('scopes') ? (
          <div className="card">
            <div className="card-body">
              {SCOPE_DESCRIPTIONS.map(({ scope, description }) => (
                <div className="form-check" key={scope}>
                  <input
                    aria-label={scope}
                    className="form-check-input"
                    type="checkbox"
                    id={`scope-${scope}`}
                    checked={scopes.includes(scope)}
                    onChange={() => toggleScope(scope)}
                  />
                  <label className="form-check-label" htmlFor={`scope-${scope}`}>
                    <code>{scope}</code> — {description}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>
            {scopes.length > 0 ? (
              scopes.map((s) => (
                <code key={s} className="me-2">
                  {s}
                </code>
              ))
            ) : (
              <em className="text-secondary">All scopes (Intercode frontend)</em>
            )}
          </p>
        )}
      </div>

      {!readOnlyFields.includes('confidential') && (
        <div className="mb-3 form-check">
          <input
            aria-label="Confidential"
            id="oauth-application-confidential"
            type="checkbox"
            className="form-check-input"
            checked={value.confidential ?? true}
            onChange={(e) => onChange({ ...value, confidential: e.target.checked })}
          />
          <label htmlFor="oauth-application-confidential" className="form-check-label fw-bold">
            Confidential
          </label>
          <div className="form-text text-secondary">
            Confidential applications can keep their client secret confidential. Non-confidential (public) applications
            are for use with native apps or single-page applications that cannot keep a secret.
          </div>
        </div>
      )}
    </div>
  );
}

export default OAuthApplicationForm;
