import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { MyProfileQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import Form from '../Models/Form';
import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import BioDisplay from './BioDisplay';

function MyProfileDisplay() {
  const { data, error } = useQuerySuspended(MyProfileQuery);

  const form = useMemo(
    () => {
      if (error) {
        return null;
      }

      return Form.fromApiResponse(JSON.parse(data.convention.user_con_profile_form.form_api_json));
    },
    [data, error],
  );

  const formResponse = useMemo(
    () => {
      if (error) {
        return null;
      }

      return JSON.parse(data.myProfile.form_response_attrs_json);
    },
    [data, error],
  );

  const formItems = useMemo(
    () => {
      if (!form) {
        return [];
      }

      return form.getAllItems().filter(item => item.identifier);
    },
    [form],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <section>
          <h1 className="mb-4">
            {'My '}
            {data.convention.name}
            {' Profile'}
          </h1>

          <dl className="row">
            <dt className="col-md-3 mb-2">Email</dt>
            <dd className="col-md-9 mb-2">{data.myProfile.email}</dd>

            {formItems.map(item => (
              <React.Fragment key={item.id}>
                <dt className="col-md-3 mb-2"><AdminCaption formItem={item} /></dt>
                <dd className="col-md-9 mb-2">
                  <FormItemDisplay
                    formItem={item}
                    value={formResponse[item.identifier]}
                    convention={data.convention}
                  />
                </dd>
              </React.Fragment>
            ))}
          </dl>

          <Link to="/edit" className="btn btn-secondary">
            Edit my profile
          </Link>
        </section>

        {
          data.myProfile.can_have_bio && (
            <>
              <hr className="mb-4" />
              <BioDisplay userConProfile={data.myProfile} />
            </>
          )
        }
      </div>

      <div className="col-lg-3">
        <div className="mt-4 mt-lg-0">
          <UserConProfileSignupsCard userConProfileId={data.myProfile.id} />
        </div>
      </div>
    </div>
  );
}

export default MyProfileDisplay;
