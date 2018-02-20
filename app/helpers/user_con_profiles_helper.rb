module UserConProfilesHelper
  def edit_user_con_profile_form(subject_profile)
    react_component(
      'EditUserConProfile',
      id: subject_profile.id,
      authenticityToken: graphql_authenticity_token,
      regularPrivilegeNames: (UserConProfile::PRIV_NAMES - UserConProfile::MAIL_PRIV_NAMES),
      mailPrivilegeNames: UserConProfile::MAIL_PRIV_NAMES
    )
  end
end
