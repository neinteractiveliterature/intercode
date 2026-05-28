import { useTranslation } from 'react-i18next';

import { OAuthApplicationInput } from '../graphqlTypes.generated';
import OAUTH_SCOPES from './scopeDescriptions';

export type EditingOAuthApplication = Pick<OAuthApplicationInput, 'name' | 'redirect_uri' | 'scopes' | 'confidential'>;

type OAuthApplicationFormProps = {
  value: EditingOAuthApplication;
  onChange: (value: EditingOAuthApplication) => void;
  readOnlyFields?: string[];
};

function OAuthApplicationForm({ value, onChange, readOnlyFields = [] }: OAuthApplicationFormProps) {
  const { t } = useTranslation();
  const scopes = value.scopes ?? [];

  const toggleScope = (scope: string) => {
    const updated = scopes.includes(scope) ? scopes.filter((s) => s !== scope) : [...scopes, scope];
    onChange({ ...value, scopes: updated });
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="oauth-application-name" className="form-label fw-bold">
          {t('admin.oauthApplications.fields.name')}
        </label>
        <input
          aria-label={t('admin.oauthApplications.fields.name')}
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
            {t('admin.oauthApplications.fields.redirectUri')}
          </label>
          <textarea
            aria-label={t('admin.oauthApplications.fields.redirectUri')}
            id="oauth-application-redirect-uri"
            className="form-control"
            value={value.redirect_uri ?? ''}
            onChange={(e) => onChange({ ...value, redirect_uri: e.target.value })}
            rows={3}
          />
          <div className="form-text text-secondary">{t('admin.oauthApplications.fields.redirectUriHelp')}</div>
        </div>
      )}

      <div className="mb-3">
        <div className="form-label fw-bold">{t('admin.oauthApplications.fields.scopes')}</div>
        {!readOnlyFields.includes('scopes') ? (
          <div className="card">
            <div className="card-body">
              {OAUTH_SCOPES.map((scope) => (
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
                    <code>{scope}</code> — {t(`oauth.permissions.${scope}`)}
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
              <em className="text-secondary">{t('admin.oauthApplications.fields.scopesAllIntercodeFrontend')}</em>
            )}
          </p>
        )}
      </div>

      {!readOnlyFields.includes('confidential') && (
        <div className="mb-3 form-check">
          <input
            aria-label={t('admin.oauthApplications.fields.confidential')}
            id="oauth-application-confidential"
            type="checkbox"
            className="form-check-input"
            checked={value.confidential ?? true}
            onChange={(e) => onChange({ ...value, confidential: e.target.checked })}
          />
          <label htmlFor="oauth-application-confidential" className="form-check-label fw-bold">
            {t('admin.oauthApplications.fields.confidential')}
          </label>
          <div className="form-text text-secondary">{t('admin.oauthApplications.confidentialHelpText')}</div>
        </div>
      )}
    </div>
  );
}

export default OAuthApplicationForm;
