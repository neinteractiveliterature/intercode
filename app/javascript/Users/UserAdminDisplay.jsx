import React, { useMemo } from 'react';
import { humanize, titleize } from 'inflected';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';

import ErrorDisplay from '../ErrorDisplay';
import { UserAdminQuery } from './queries.gql';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import LoadingIndicator from '../LoadingIndicator';

function sortByConventionDate(profiles) {
  return reverse(sortBy(profiles, (profile) => profile.convention.starts_at));
}

function buildProfileUrl(profile) {
  const profileUrl = new URL(
    `//${profile.convention.domain}/user_con_profiles/${profile.id}`,
    window.location.href,
  );
  profileUrl.port = window.location.port;
  return profileUrl.toString();
}

function UserAdminDisplay() {
  const userId = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(UserAdminQuery, { variables: { id: userId } });

  usePageTitle(useValueUnless(() => data.user.name, error || loading));

  const userConProfiles = useMemo(
    () => (loading || error ? null : sortByConventionDate(data.user.user_con_profiles)),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <h1>{data.user.name}</h1>
        <table className="table table-sm table-striped my-4">
          <tbody>
            {['first_name', 'last_name', 'email'].map((field) => (
              <tr key={field}>
                <th scope="row" className="pr-2">{humanize(field)}</th>
                <td className="col-md-9">
                  {data.user[field]}
                </td>
              </tr>
            ))}

            <tr>
              <th scope="row" className="pr-2">Privileges</th>
              <td>
                {data.user.privileges.length > 0
                  ? data.user.privileges.map((priv) => titleize(priv)).join(', ')
                  : 'none'}
              </td>
            </tr>

            <tr>
              <th scope="row" className="pr-2">Convention profiles</th>
              <td>
                {data.user.user_con_profiles.length > 0
                  ? (
                    <ul className="list-unstyled mb-0">
                      {userConProfiles.map((profile) => (
                        <li key={profile.id}>
                          <a href={buildProfileUrl(profile)}>
                            {profile.convention.name}
                            {' '}
                            <small>
                              (
                              {moment.tz(profile.convention.starts_at, profile.convention.timezone_name).format('YYYY')}
                              )
                            </small>
                          </a>
                          {profile.staff_positions.length > 0
                            ? ` (${profile.staff_positions.map((pos) => pos.name).sort().join(', ')})`
                            : null}
                        </li>
                      ))}
                    </ul>
                  )
                  : 'none'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-lg-3">
        {/* this.renderUserAdminSection(data) */}
      </div>
    </div>
  );
}

export default UserAdminDisplay;
