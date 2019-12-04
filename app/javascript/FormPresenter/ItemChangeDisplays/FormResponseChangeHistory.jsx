import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  NavLink, Switch, Route, Redirect,
} from 'react-router-dom';
import AppRootContext from '../../AppRootContext';
import FormItemChangeGroup from './FormItemChangeGroup';
import { buildChangeGroups, getTimespanForChangeGroup } from './FormItemChangeUtils';

function FormResponseChangeHistory({
  basePath, changes, convention, form,
}) {
  const { timezoneName } = useContext(AppRootContext);
  const changeGroups = useMemo(
    () => buildChangeGroups(changes, form),
    [changes, form],
  );

  if (changeGroups.length === 0) {
    return 'No changes.';
  }

  return (
    <div className="row">
      <nav className="col-md-3">
        <ul className="nav flex-column nav-pills">
          {changeGroups.map((changeGroup) => (
            <li className="nav-item" key={changeGroup.id}>
              <NavLink
                to={`${basePath}/${changeGroup.id}`}
                className="nav-link"
              >
                <strong>{changeGroup.changes[0].user_con_profile.name_without_nickname}</strong>
                <br />
                <small>
                  {getTimespanForChangeGroup(changeGroup)
                    .humanizeInTimezone(timezoneName, 'MMMM DD, YYYY - h:mma', 'h:mma')}
                </small>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="col-md-9">
        <Switch>
          {changeGroups.map((changeGroup) => (
            <Route
              key={changeGroup.id}
              path={`${basePath}/${changeGroup.id}`}
              render={() => (
                <FormItemChangeGroup
                  convention={convention}
                  changeGroup={changeGroup}
                />
              )}
            />
          ))}
          <Redirect to={`${basePath}/${changeGroups[0].id}`} />
        </Switch>
      </div>
    </div>
  );
}

FormResponseChangeHistory.propTypes = {
  basePath: PropTypes.string.isRequired,
  changes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convention: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({}).isRequired,
};

export default FormResponseChangeHistory;
