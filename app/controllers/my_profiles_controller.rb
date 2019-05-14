class MyProfilesController < ApplicationController
  skip_before_action :ensure_user_con_profile_exists
  authorize_resource :user_con_profile

  respond_to :html

  def new
    new_profile = build_user_con_profile
    new_profile.needs_update = true
    new_profile.save!
    redirect_to edit_my_profile_path
  end

  private

  def build_user_con_profile
    new_profile = current_user.user_con_profiles.build(
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      convention_id: convention.id
    )
    new_profile.assign_default_values_from_form_items(
      convention.user_con_profile_form.form_items
    )
    copy_most_recent_profile_attributes(new_profile)
    new_profile
  end

  def copy_most_recent_profile_attributes(destination_profile)
    return unless most_recent_profile

    destination_profile.assign_form_response_attributes(
      FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
    )
  end

  def most_recent_profile
    @most_recent_profile ||= current_user.user_con_profiles.joins(:convention).order(
      Arel.sql('conventions.starts_at DESC')
    ).first
  end
end
