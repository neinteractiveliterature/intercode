import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import usePageTitle from '../usePageTitle';
import Gravatar from '../Gravatar';
import { useMyProfileQuery } from './queries.generated';
import { getSortedParsedFormItems } from '../Models/Form';
import AdminWarning from '../UIComponents/AdminWarning';
import { ConventionForTimespanUtils } from '../TimespanUtils';
import FourOhFourPage from '../FourOhFourPage';

function MyProfileDisplay(): JSX.Element {
  const { t } = useTranslation();
  const { data, loading, error } = useMyProfileQuery();

  const formResponse = useMemo(() => {
    if (loading || error) {
      return null;
    }

    if (!data?.convention.my_profile) {
      return null;
    }

    return JSON.parse(data.convention.my_profile.form_response_attrs_json ?? '{}');
  }, [data, loading, error]);

  const formItems = useMemo(() => {
    if (!data?.convention?.user_con_profile_form) {
      return [];
    }

    return getSortedParsedFormItems(data.convention.user_con_profile_form);
  }, [data?.convention?.user_con_profile_form]);

  usePageTitle(t('myProfile.display.pageTitle'));

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <FourOhFourPage />;
  }

  if (!formItems) {
    return (
      <AdminWarning>
        <Trans i18nKey="admin.warnings.emptyUserConProfileForm">
          <p>This convention has no user profile form set up, or the form is empty.</p>

          <Link to="/admin_forms">To create or edit the user profile form, go here.</Link>
          <br />
          <Link to="/convention/edit">To set it as the user profile form for this convention, go here.</Link>
        </Trans>
      </AdminWarning>
    );
  }

  const convention = data.convention;
  const myProfile = data.convention.my_profile;

  if (!myProfile) {
    return <FourOhFourPage />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <section>
          <h1 className="mb-4">
            {t('myProfile.display.header', {
              conventionName: convention.name,
            })}
          </h1>

          <dl className="row">
            <dt className="col-md-3 mb-2">{t('myProfile.display.emailLabel')}</dt>
            <dd className="col-md-9 mb-2">{myProfile.email}</dd>

            <dt className="col-md-3 mb-2">{t('myProfile.display.avatarLabel')}</dt>
            <dd className="col-md-9 mb-2">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <Gravatar url={myProfile.gravatar_url} enabled={myProfile.gravatar_enabled} pixelSize={32} />
                </div>
                <div className="font-italic">
                  {myProfile.gravatar_enabled
                    ? t('myProfile.display.gravatarEnabled')
                    : t('myProfile.display.gravatarDisabled')}
                </div>
              </div>
            </dd>

            {myProfile.can_have_bio && (
              <>
                <dt className="col-md-3 mb-2">{t('myProfile.display.bioLabel')}</dt>
                <dd className="col-md-9 mb-2">
                  <div className="card bg-light">
                    <div className="card-body">
                      <strong>{myProfile.bio_name}</strong>
                      <br />
                      {/* eslint-disable-next-line react/no-danger */}
                      <div dangerouslySetInnerHTML={{ __html: myProfile.bio_html ?? '' }} />
                    </div>
                  </div>
                </dd>
              </>
            )}

            {formItems.map(
              (item) =>
                item.identifier && (
                  <Fragment key={item.id}>
                    <dt className="col-md-3 mb-2">
                      <AdminCaption formItem={item} />
                    </dt>
                    <dd className="col-md-9 mb-2">
                      <FormItemDisplay
                        formItem={item}
                        value={formResponse[item.identifier]}
                        convention={convention as ConventionForTimespanUtils}
                        displayMode="admin"
                      />
                    </dd>
                  </Fragment>
                ),
            )}
          </dl>

          <Link to="/my_profile/edit" className="btn btn-secondary">
            {t('myProfile.editButton')}
          </Link>
        </section>
      </div>
      <div className="col-lg-3">
        <div className="mt-4 mt-lg-0">
          <UserConProfileSignupsCard userConProfileId={myProfile.id} />
        </div>
      </div>
    </div>
  );
}

export default MyProfileDisplay;
