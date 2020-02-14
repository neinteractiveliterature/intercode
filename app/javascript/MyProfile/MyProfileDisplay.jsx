import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { MyProfileQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import Form from '../Models/Form';
import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import usePageTitle from '../usePageTitle';
import Gravatar from '../Gravatar';
import PageLoadingIndicator from '../PageLoadingIndicator';

function MyProfileDisplay() {
  const { data, loading, error } = useQuery(MyProfileQuery);

  const form = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return Form.fromApiResponse(JSON.parse(data.convention.user_con_profile_form.form_api_json));
    },
    [data, loading, error],
  );

  const formResponse = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return JSON.parse(data.myProfile.form_response_attrs_json);
    },
    [data, loading, error],
  );

  const formItems = useMemo(
    () => {
      if (!form) {
        return [];
      }

      return form.getAllItems().filter((item) => item.identifier);
    },
    [form],
  );

  usePageTitle('My profile');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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
            {' profile'}
          </h1>

          <dl className="row">
            <dt className="col-md-3 mb-2">Email</dt>
            <dd className="col-md-9 mb-2">{data.myProfile.email}</dd>

            <dt className="col-md-3 mb-2">Avatar</dt>
            <dd className="col-md-9 mb-2">
              <div className="d-flex align-items-center">
                <div className="mr-2">
                  <Gravatar
                    url={data.myProfile.gravatar_url}
                    enabled={data.myProfile.gravatar_enabled}
                    pixelSize={32}
                  />
                </div>
                <div className="font-italic">
                  {data.myProfile.gravatar_enabled ? 'Gravatar enabled' : 'Gravatar disabled'}
                </div>
              </div>
            </dd>

            {
              data.myProfile.can_have_bio && (
                <>
                  <dt className="col-md-3 mb-2">Bio</dt>
                  <dd className="col-md-9 mb-2">
                    <div className="card bg-light">
                      <div className="card-body">
                        <strong>{data.myProfile.bio_name}</strong>
                        <br />
                        { /* eslint-disable-next-line react/no-danger */}
                        <div dangerouslySetInnerHTML={{ __html: data.myProfile.bio_html }} />
                      </div>
                    </div>
                  </dd>
                </>
              )
            }

            {formItems.map((item) => (
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

          <Link to="/my_profile/edit" className="btn btn-secondary">
            Edit my profile
          </Link>
        </section>


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
