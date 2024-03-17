import { useMemo } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import FormItemChangeGroup from './FormItemChangeGroup';
import { buildChangeGroups, getTimespanForChangeGroup, ParseableFormResponseChange } from './FormItemChangeUtils';
import { ConventionForFormItemChangeDisplay } from './FormItemChangeDisplay';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import { useAppDateTimeFormat } from '../../TimeUtils';

export type FormResponseChangeHistoryProps = {
  changes: ParseableFormResponseChange[];
  convention: ConventionForFormItemChangeDisplay;
  form: CommonFormFieldsFragment;
  basePath: string;
};

function FormResponseChangeHistory({
  changes,
  convention,
  form,
  basePath,
}: FormResponseChangeHistoryProps): JSX.Element {
  const { t } = useTranslation();
  const changeGroups = useMemo(() => buildChangeGroups(changes, form), [changes, form]);
  const format = useAppDateTimeFormat();

  const renderTimespan = (changeGroup: (typeof changeGroups)[number]) => {
    const timespan = getTimespanForChangeGroup(changeGroup);
    return (
      <>
        {format(timespan.start, 'shortDateTime')} - {format(timespan.finish, 'shortTime')}
      </>
    );
  };

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
                <small>{renderTimespan(changeGroup)}</small>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="col-md-9">
        <Routes>
          {changeGroups.map((changeGroup) => (
            <Route
              key={changeGroup.id}
              path={changeGroup.id}
              element={<FormItemChangeGroup convention={convention} changeGroup={changeGroup} />}
            />
          ))}
          <Route path="" element={<Navigate to={`${basePath}/${changeGroups[0].id}`} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default FormResponseChangeHistory;
