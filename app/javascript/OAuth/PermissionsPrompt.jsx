import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash-es/groupBy';

function getGroupForScopeName(scopeName) {
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

const SCOPE_GROUP_DESCRIPTIONS = {
  readPublic: 'Read-only access to public data',
  readPrivate: 'Read-only access to personal data',
  manage: 'Read/write access to personal data',
};

const SCOPE_DESCRIPTIONS = {
  public: 'Access your public data, and public data about conventions you are signed up for',
  openid: 'Authenticate you using your account',
  read_profile: 'Access your personal profile data',
  read_signups: 'Access data about your signups',
  read_events: 'Access data about the events and event proposals you manage',
  read_conventions: 'Access privileged data about the conventions you manage (e.g. user profiles)',
  read_organizations: 'Access privileged data about organizations on the site',
  manage_profile: 'Update your personal profile data',
  manage_signups: 'Sign you up and withdraw you from events',
  manage_events: 'Update events and event proposals you manage',
  manage_conventions: 'Update conventions you manage',
  manage_organizations: 'Update privileged data about organizations on the site',
};

class PermissionsPrompt extends React.Component {
  static propTypes = {
    scopeNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    expandedGroups: [],
  }

  render = () => {
    const { scopeNames } = this.props;
    const groupedScopes = groupBy(scopeNames, (scopeName) => getGroupForScopeName(scopeName));

    return ['readPublic', 'readPrivate', 'manage'].map((scopeGroup) => {
      if (!groupedScopes[scopeGroup]) {
        return null;
      }

      return (
        <section key={scopeGroup} className={`card mb-4 ${CLASS_NAMES_BY_SCOPE_GROUP[scopeGroup]}`}>
          <div className="card-header">
            <button
              type="button"
              className="cursor-pointer btn btn-link text-body p-0 text-decoration-none"
              onClick={() => {
                this.setState((prevState) => {
                  if (prevState.expandedGroups.includes(scopeGroup)) {
                    return {
                      expandedGroups: prevState.expandedGroups
                        .filter((group) => group !== scopeGroup),
                    };
                  }

                  return { expandedGroups: [...prevState.expandedGroups, scopeGroup] };
                });
              }}
            >
              {
                this.state.expandedGroups.includes(scopeGroup)
                  ? <i className="fa fa-caret-down"><span className="sr-only">Collapse</span></i>
                  : <i className="fa fa-caret-right"><span className="sr-only">Expand</span></i>
              }
              {' '}
              <strong>{SCOPE_GROUP_DESCRIPTIONS[scopeGroup]}</strong>
            </button>
          </div>

          {
            this.state.expandedGroups.includes(scopeGroup)
              ? (
                <div className="card-body">
                  <p>This application will be able to:</p>
                  <ul className="mb-0">
                    {groupedScopes[scopeGroup].map((scopeName) => (
                      <li key={scopeName}>{SCOPE_DESCRIPTIONS[scopeName]}</li>
                    ))}
                  </ul>
                </div>
              )
              : null
          }
        </section>
      );
    });
  }
}

export default PermissionsPrompt;
