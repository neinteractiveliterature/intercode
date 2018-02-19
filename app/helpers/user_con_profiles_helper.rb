module UserConProfilesHelper
  def edit_user_con_profile_form(subject_profile)
    update_authenticity_token = form_authenticity_token(
      form_options: { action: my_profile_path, method: 'PATCH' }
    )

    react_component(
      'EditUserConProfile',
      id: subject_profile.id,
      graphqlAuthenticityToken: graphql_authenticity_token,
      regularPrivilegeNames: (UserConProfile::PRIV_NAMES - UserConProfile::MAIL_PRIV_NAMES),
      mailPrivilegeNames: UserConProfile::MAIL_PRIV_NAMES,
      formProps: {
        formUrl: form_url(convention.user_con_profile_form),
        conventionUrl: convention_url,
        responseUrl: my_profile_path,
        authenticityToken: update_authenticity_token,
        autocommit: 'change'
      }
    )
  end
end
