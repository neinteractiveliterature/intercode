class SetupUserConProfileService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :user_con_profile
  end
  self.result_class = Result

  attr_reader :convention, :user, :controller

  def initialize(convention:, user:, controller: nil)
    @convention = convention
    @user = user
    @controller = controller
  end

  private

  def inner_call
    user_con_profile =
      user.user_con_profiles.build(
        first_name: user.first_name,
        last_name: user.last_name,
        convention_id: convention.id,
        needs_update: true
      )
    user_con_profile.assign_default_values_from_form_items(convention.user_con_profile_form.form_items)
    copy_most_recent_profile_attributes(user_con_profile)
    user_con_profile.save!

    success user_con_profile:
  end

  def copy_most_recent_profile_attributes(destination_profile)
    return unless profiles_by_recency&.any?

    this_convention_profile_fields = convention.user_con_profile_form.form_items.pluck(:identifier)

    profiles_by_recency.each do |profile|
      profile_attrs = FormResponsePresenter.new(profile.convention.user_con_profile_form, profile, controller:).as_json

      destination_profile.assign_form_response_attributes(
        destination_profile.filter_form_response_attributes_for_assignment(
          profile_attrs.slice(*this_convention_profile_fields),
          convention.user_con_profile_form.form_items,
          AuthorizationInfo.cast(destination_profile.user)
        )
      )

      destination_profile.assign_attributes(gravatar_enabled: profile.gravatar_enabled)
    end
  end

  def profiles_by_recency
    return nil unless convention.organization_id

    @profiles_by_recency ||=
      user
        .user_con_profiles
        .joins(:convention)
        .where(conventions: { organization_id: convention.organization_id })
        .order(Arel.sql("conventions.starts_at"))
  end
end
