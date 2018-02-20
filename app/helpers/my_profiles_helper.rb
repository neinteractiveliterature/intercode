module MyProfilesHelper
  def user_con_profile_form
    react_component(
      'MyProfileForm',
      authenticityToken: graphql_authenticity_token
    )
  end
end
