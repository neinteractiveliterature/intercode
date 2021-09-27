import { useState } from 'react';
import groupBy from 'lodash/groupBy';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

function getGroupForScopeName(scopeName: string) {
  if (scopeName.startsWith('read_')) {
    return 'readPrivate';
  }

  if (scopeName.startsWith('manage_')) {
    return 'manage';
  }

  return 'readPublic';
}

const CLASS_NAMES_BY_SCOPE_GROUP = {
  readPublic: 'bg-success-light',
  readPrivate: 'bg-warning-light',
  manage: 'bg-danger-light',
};

// I know this all seems very redundant
// But it's necessary to get i18next-parser to work right :(
function getScopeGroupDescription(scopeGroup: string, t: TFunction) {
  switch (scopeGroup) {
    case 'readPublic':
      return t('oauth.permissionGroups.readPublic', 'Read-only access to public data');
    case 'readPrivate':
      return t('oauth.permissionGroups.readPrivate', 'Read-only access to personal data');
    case 'manage':
      return t('oauth.permissionGroups.manage', 'Read/write access to personal data');
    default:
      return scopeGroup;
  }
}

function getScopeDescription(scopeName: string, t: TFunction) {
  switch (scopeName) {
    case 'public':
      return t(
        'oauth.permissions.public',
        'Access your public data, and public data about conventions you are signed up for',
      );
    case 'openid':
      return t('oauth.permissions.openid', 'Authenticate you using your account');
    case 'read_profile':
      return t('oauth.permissions.read_profile', 'Access your personal profile data');
    case 'read_signups':
      return t('oauth.permissions.read_signups', 'Access data about your signups');
    case 'read_events':
      return t(
        'oauth.permissions.read_events',
        'Access data about the events and event proposals you manage',
      );
    case 'read_conventions':
      return t(
        'oauth.permissions.read_conventions',
        'Access privileged data about the conventions you manage (e.g. user profiles)',
      );
    case 'read_organizations':
      return t(
        'oauth.permissions.read_organizations',
        'Access privileged data about organizations on the site',
      );
    case 'read_email_routing':
      return t('oauth.permissions.read_email_routing', 'Read sitewide email routing rules');
    case 'manage_profile':
      return t('oauth.permissions.manage_profile', 'Update your personal profile data');
    case 'manage_signups':
      return t('oauth.permissions.manage_signups', 'Sign you up and withdraw you from events');
    case 'manage_events':
      return t('oauth.permissions.manage_events', 'Update events and event proposals you manage');
    case 'manage_conventions':
      return t('oauth.permissions.manage_conventions', 'Update conventions you manage');
    case 'manage_organizations':
      return t(
        'oauth.permissions.manage_organizations',
        'Update privileged data about organizations on the site',
      );
    case 'manage_email_routing':
      return t('oauth.permissions.manage_email_routing', 'Update sitewide email routing rules');
    default:
      return scopeName;
  }
}

export type PermissionsPromptProps = {
  scopeNames: string[];
};

function PermissionsPrompt({ scopeNames }: PermissionsPromptProps): JSX.Element {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const groupedScopes = groupBy(scopeNames, (scopeName) => getGroupForScopeName(scopeName));
  const { t } = useTranslation();

  const groupClicked = (scopeGroup: string) => {
    setExpandedGroups((prevExpandedGroups) => {
      if (prevExpandedGroups.includes(scopeGroup)) {
        return prevExpandedGroups.filter((group) => group !== scopeGroup);
      }

      return [...prevExpandedGroups, scopeGroup];
    });
  };

  return (
    <>
      {(['readPublic', 'readPrivate', 'manage'] as const).map((scopeGroup) => {
        if (!groupedScopes[scopeGroup]) {
          return null;
        }

        return (
          <section
            key={scopeGroup}
            className={`card mb-4 ${CLASS_NAMES_BY_SCOPE_GROUP[scopeGroup]}`}
          >
            <div className="card-header">
              <button
                type="button"
                className="cursor-pointer btn btn-link text-body p-0 text-decoration-none"
                onClick={() => groupClicked(scopeGroup)}
              >
                {expandedGroups.includes(scopeGroup) ? (
                  <i className="bi-caret-down-fill">
                    <span className="visually-hidden">{t('buttons.collapse', 'Collapse')}</span>
                  </i>
                ) : (
                  <i className="bi-caret-right-fill">
                    <span className="visually-hidden">{t('buttons.expand', 'Expand')}</span>
                  </i>
                )}{' '}
                <strong>{getScopeGroupDescription(scopeGroup, t)}</strong>
              </button>
            </div>

            {expandedGroups.includes(scopeGroup) ? (
              <div className="card-body">
                <p>This application will be able to:</p>
                <ul className="mb-0">
                  {groupedScopes[scopeGroup].map((scopeName) => (
                    <li key={scopeName}>{getScopeDescription(scopeName, t)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        );
      })}
    </>
  );
}

export default PermissionsPrompt;
