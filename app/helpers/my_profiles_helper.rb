module MyProfilesHelper
  def user_con_profile_form
    update_authenticity_token = form_authenticity_token(
      form_options: { action: my_profile_path, method: 'PATCH' }
    )

    react_component(
      'MyProfileForm',
      formUrl: form_url(convention.user_con_profile_form),
      conventionUrl: convention_url,
      responseUrl: my_profile_path,
      responseAuthenticityToken: update_authenticity_token,
      graphqlAuthenticityToken: graphql_authenticity_token
    )
  end
end
