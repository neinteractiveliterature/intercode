module Concerns::ProfileSetupWorkflow
  include Concerns::CmsContentHelpers

  protected

  def ensure_user_con_profile_exists
    return unless convention && user_signed_in?
    return if user_con_profile

    @user_con_profile = current_user.user_con_profiles.build(
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      convention_id: convention.id,
      needs_update: true
    )
    @user_con_profile.assign_default_values_from_form_items(
      convention.user_con_profile_form.form_items
    )
    copy_most_recent_profile_attributes(@user_con_profile)
    @user_con_profile.save!
  end

  def copy_most_recent_profile_attributes(destination_profile)
    return unless most_recent_profile

    destination_profile.assign_form_response_attributes(
      FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
    )
  end

  def most_recent_profile
    return nil unless convention.organization_id

    @most_recent_profile ||= current_user.user_con_profiles.joins(:convention)
      .where(conventions: { organization_id: convention.organization_id })
      .order(Arel.sql('conventions.starts_at DESC'))
      .first
  end

  def redirect_if_user_con_profile_needs_update
    return unless user_con_profile&.needs_update?
    return if assumed_identity_from_profile
    return if request.path == '/my_profile/setup'
    return if current_page_skips_clickwrap_agreement?

    redirect_to '/my_profile/setup'
  end

  def ensure_clickwrap_agreement_accepted
    return unless clickwrap_agreement_present?
    return if assumed_identity_from_profile
    return unless user_con_profile && !user_con_profile.accepted_clickwrap_agreement?
    return if current_page_skips_clickwrap_agreement?

    flash.clear
    redirect_to '/clickwrap_agreement'
  end

  def clickwrap_agreement_present?
    convention && convention.clickwrap_agreement.present?
  end

  def current_page_skips_clickwrap_agreement?
    return true if request.path == '/clickwrap_agreement'
    current_cms_page(request.path)&.skip_clickwrap_agreement?
  end
end
