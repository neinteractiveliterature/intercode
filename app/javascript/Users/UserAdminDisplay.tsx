import { useMemo } from 'react';
import { humanize, titleize } from 'inflected';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import { useParams } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { UserAdminQueryData, useUserAdminQuery } from './queries.generated';
import { timespanFromConvention } from '../TimespanUtils';
import { useAppDateTimeFormat } from '../TimeUtils';

function sortByConventionDate(profiles: UserAdminQueryData['user']['user_con_profiles']) {
  return reverse(sortBy(profiles, (profile) => profile.convention.starts_at));
}

function buildProfileUrl(profile: UserAdminQueryData['user']['user_con_profiles'][0]) {
  const profileUrl = new URL(
    `//${profile.convention.domain}/user_con_profiles/${profile.id}`,
    window.location.href,
  );
  profileUrl.port = window.location.port;
  return profileUrl.toString();
}

function useLoadUserAdminData() {
  const userId = Number.parseInt(useParams<{ id: string }>().id, 10);
  return useUserAdminQuery({ variables: { id: userId } });
}

function renderProfileConventionYear(
  profile: UserAdminQueryData['user']['user_con_profiles'][number],
  format: ReturnType<typeof useAppDateTimeFormat>,
) {
  const { start } = timespanFromConvention(profile.convention);
  return start ? format(start, 'year') : null;
}

export default LoadQueryWrapper(useLoadUserAdminData, function UserAdminDisplay({ data }) {
  usePageTitle(data.user.name);
  const format = useAppDateTimeFormat();

  const userConProfiles = useMemo(() => sortByConventionDate(data.user.user_con_profiles), [data]);

  return (
    <div className="row">
      <div className="col-lg-9">
        <h1>{data.user.name}</h1>
        <table className="table table-sm table-striped my-4">
          <tbody>
            {(['first_name', 'last_name', 'email'] as const).map((field) => (
              <tr key={field}>
                <th scope="row" className="pe-2">
                  {humanize(field)}
                </th>
                <td className="col-md-9">{data.user[field]}</td>
              </tr>
            ))}

            <tr>
              <th scope="row" className="pe-2">
                Privileges
              </th>
              <td>
                {(data.user.privileges?.length ?? 0) > 0
                  ? data.user.privileges!.map(titleize).join(', ')
                  : 'none'}
              </td>
            </tr>

            <tr>
              <th scope="row" className="pe-2">
                Convention profiles
              </th>
              <td>
                {data.user.user_con_profiles.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {userConProfiles.map((profile) => (
                      <li key={profile.id}>
                        <a href={buildProfileUrl(profile)}>
                          {profile.convention.name}
                          {profile.convention.starts_at && (
                            <>
                              {' '}
                              <small>({renderProfileConventionYear(profile, format)})</small>
                            </>
                          )}
                        </a>
                        {profile.staff_positions.length > 0
                          ? ` (${profile.staff_positions
                              .map((pos) => pos.name)
                              .sort()
                              .join(', ')})`
                          : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'none'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-lg-3">{/* this.renderUserAdminSection(data) */}</div>
    </div>
  );
});
