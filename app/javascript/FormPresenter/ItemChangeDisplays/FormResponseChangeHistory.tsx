import { useMemo } from 'react';
import { NavLink, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import FormItemChangeGroup from './FormItemChangeGroup';
import { FormResponseChangeGroup, getTimespanForChangeGroup } from './FormItemChangeUtils';
import { ConventionForFormItemChangeDisplay } from './FormItemChangeDisplay';
import { useAppDateTimeFormat } from '../../TimeUtils';

export type FormResponseChangeHistoryProps = {
  changeGroups: FormResponseChangeGroup[];
  changeGroupId: string;
  convention: ConventionForFormItemChangeDisplay;
  basePath: string;
};

function FormResponseChangeHistory({
  changeGroupId,
  convention,
  changeGroups,
  basePath,
}: FormResponseChangeHistoryProps): React.JSX.Element {
  const { t } = useTranslation();
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
