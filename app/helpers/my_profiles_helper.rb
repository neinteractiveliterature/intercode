module MyProfilesHelper
  def user_con_profile_form
    update_authenticity_token = form_authenticity_token(
      form_options: { action: my_profile_path, method: 'PATCH' }
    )

    react_component(
      'FormPresenter',
      formUrl: form_url(convention.user_con_profile_form),
      conventionUrl: convention_url,
      responseUrl: my_profile_path,
      authenticityToken: update_authenticity_token
    )
  end
end
