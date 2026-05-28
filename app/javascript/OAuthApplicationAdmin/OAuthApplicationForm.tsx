import { BootstrapFormCheckbox, BootstrapFormInput, BootstrapFormTextarea } from '@neinteractiveliterature/litform';
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
      <BootstrapFormInput
        label={t('admin.oauthApplications.fields.name')}
        value={value.name ?? ''}
        onTextChange={(name) => onChange({ ...value, name })}
      />

      {!readOnlyFields.includes('redirect_uri') && (
        <BootstrapFormTextarea
          label={t('admin.oauthApplications.fields.redirectUri')}
          helpText={t('admin.oauthApplications.fields.redirectUriHelp')}
          value={value.redirect_uri ?? ''}
          onTextChange={(redirect_uri) => onChange({ ...value, redirect_uri })}
          rows={3}
        />
      )}

      <div className="mb-3">
        <div className="form-label">{t('admin.oauthApplications.fields.scopes')}</div>
        {!readOnlyFields.includes('scopes') ? (
          <div className="card">
            <div className="card-body">
              {OAUTH_SCOPES.map((scope) => (
                <BootstrapFormCheckbox
                  key={scope}
                  type="checkbox"
                  label={
                    <>
                      <code>{scope}</code> — {t(`oauth.permissions.${scope}`)}
                    </>
                  }
                  checked={scopes.includes(scope)}
                  onCheckedChange={() => toggleScope(scope)}
                />
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
        <div className="mb-3">
          <BootstrapFormCheckbox
            type="checkbox"
            label={t('admin.oauthApplications.fields.confidential')}
            checked={value.confidential ?? true}
            onCheckedChange={(confidential) => onChange({ ...value, confidential })}
          />
          <div className="form-text text-secondary ms-4">{t('admin.oauthApplications.confidentialHelpText')}</div>
        </div>
      )}
    </div>
  );
}

export default OAuthApplicationForm;
