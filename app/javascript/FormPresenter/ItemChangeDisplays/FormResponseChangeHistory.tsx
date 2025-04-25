import { useMemo } from 'react';
import { NavLink, useParams, Navigate } from 'react-router';
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
  const { changeGroupId } = useParams();
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

  const changeGroup = useMemo(
    () => changeGroups.find((changeGroup) => changeGroup.id === changeGroupId),
    [changeGroups, changeGroupId],
  );

  if (changeGroups.length === 0) {
    return <>{t('forms.history.noChanges')}</>;
  }

  if (!changeGroup) {
    return <Navigate to={`./${changeGroups[0].id}`} replace />;
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
        <FormItemChangeGroup convention={convention} changeGroup={changeGroup} />
      </div>
    </div>
  );
}

export default FormResponseChangeHistory;
