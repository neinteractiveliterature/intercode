import React from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';

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

class OAuthPermissionsPrompt extends React.Component {
  static propTypes = {
    scopes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })).isRequired,
  };

  state = {
    expandedGroups: [],
  }

  render = () => {
    const { scopes } = this.props;
    const groupedScopes = groupBy(scopes, scope => getGroupForScopeName(scope.name));

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
                        .filter(group => group !== scopeGroup),
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
                    {groupedScopes[scopeGroup].map(scope => (
                      <li key={scope.name}>{scope.description}</li>
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

export default OAuthPermissionsPrompt;
