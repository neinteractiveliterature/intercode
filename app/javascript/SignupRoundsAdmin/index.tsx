import { ActionFunction, data, Outlet } from 'react-router';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import RouteActivatedBreadcrumbItemV2 from '../Breadcrumbs/RouteActivatedBreadcrumbItemV2';
import { useTranslation } from 'react-i18next';
import { buildSignupRoundInputFromFormData } from './buildSignupRoundInput';
import { i18n } from '../setupI18Next';
import { client } from '../useIntercodeApolloClient';
import { CreateSignupRoundDocument } from './mutations.generated';
import { SignupRoundsAdminQueryDocument } from './queries.generated';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const signupRound = buildSignupRoundInputFromFormData(formData);
      if (!signupRound.start) {
        throw new Error(i18n.t('signups.signupRounds.errors.startTimeRequired'));
      }

      const result = await client.mutate({
        mutation: CreateSignupRoundDocument,
        variables: {
          conventionId: formData.get('convention_id')?.toString() ?? '',
          signupRound: signupRound,
        },
        refetchQueries: [{ query: SignupRoundsAdminQueryDocument }],
        awaitRefetchQueries: true,
      });

      return data(result.data?.createSignupRound.signup_round);
    } catch (error) {
      return error;
    }
  }
};

function SignupRoundsAdmin() {
  const { t } = useTranslation();

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="/signup_rounds" end>
          {t('navigation.admin.signupRounds')}
        </RouteActivatedBreadcrumbItem>

        <RouteActivatedBreadcrumbItemV2 route={{ path: '/signup_rounds/:id/results' }} to="." hideUnlessMatch>
          {t('signups.signupRounds.results')}
        </RouteActivatedBreadcrumbItemV2>
      </ol>

      <Outlet />
    </>
  );
}

export const Component = SignupRoundsAdmin;
