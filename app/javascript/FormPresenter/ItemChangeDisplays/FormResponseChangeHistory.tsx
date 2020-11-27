import { useContext, useMemo } from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../../AppRootContext';
import FormItemChangeGroup from './FormItemChangeGroup';
import {
  buildChangeGroups,
  getTimespanForChangeGroup,
  ParseableFormResponseChange,
} from './FormItemChangeUtils';
import { ConventionForFormItemChangeDisplay } from './FormItemChangeDisplay';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';

export type FormResponseChangeHistoryProps = {
  basePath: string;
  changes: ParseableFormResponseChange[];
  convention: ConventionForFormItemChangeDisplay;
  form: CommonFormFieldsFragment;
};

function FormResponseChangeHistory({
  basePath,
  changes,
  convention,
  form,
}: FormResponseChangeHistoryProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const changeGroups = useMemo(() => buildChangeGroups(changes, form), [changes, form]);

  if (changeGroups.length === 0) {
    return <>{t('forms.history.noChanges', 'No changes.')}</>;
  }

  return (
    <div className="row">
      <nav className="col-md-3">
        <ul className="nav flex-column nav-pills">
          {changeGroups.map((changeGroup) => (
            <li className="nav-item" key={changeGroup.id}>
              <NavLink to={`${basePath}/${changeGroup.id}`} className="nav-link">
                <strong>{changeGroup.changes[0].user_con_profile.name_without_nickname}</strong>
                <br />
                <small>
                  {getTimespanForChangeGroup(changeGroup).humanizeInTimezone(
                    timezoneName,
                    t,
                    'longDateTime',
                    'shortTime',
                  )}
                </small>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="col-md-9">
        <Switch>
          {changeGroups.map((changeGroup) => (
            <Route key={changeGroup.id} path={`${basePath}/${changeGroup.id}`}>
              <FormItemChangeGroup convention={convention} changeGroup={changeGroup} />
            </Route>
          ))}
          <Redirect to={`${basePath}/${changeGroups[0].id}`} />
        </Switch>
      </div>
    </div>
  );
}

export default FormResponseChangeHistory;
