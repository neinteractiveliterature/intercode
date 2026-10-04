# frozen_string_literal: true
class Mutations::CreateUserConProfile < Mutations::BaseMutation
  description <<~MARKDOWN
    Adds an existing user to the current convention as an attendee.  The new profile is pre-filled from the user's
    most recent profile at another convention, and any details given here take precedence.  Only users the caller can
    see (the same ones the Add Attendee modal lists) can be added.
  MARKDOWN

  field :user_con_profile, Types::UserConProfileType, null: false, description: "The user profile that was created"

  argument :user_con_profile,
           Types::UserConProfileInputType,
           required: true,
           camelize: false,
           description: "The details for the new profile"
  argument :user_id, ID, required: false, camelize: true, description: "The ID of the user to add as an attendee"

  authorize_create_convention_associated_model :user_con_profiles

  # rubocop:disable Metrics/AbcSize
  def resolve(**args)
    # Only users the caller is allowed to see (the same ones the Add Attendee modal lists), since this pre-fills the
    # new profile with details from the user's profiles at other conventions
    user = policy_scope(User).find(args[:user_id])
    ensure_no_existing_user_con_profile(user)

    user_con_profile = convention.user_con_profiles.new(user:)
    user_con_profile.assign_default_values_from_form_items(convention.user_con_profile_form.form_items)

    most_recent_profile = user.user_con_profiles.joins(:convention).order(Arel.sql("conventions.starts_at DESC")).first

    if most_recent_profile
      assign_filtered_attrs(
        user_con_profile,
        FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
      )
    end

    user_con_profile_attrs = args[:user_con_profile].to_h.stringify_keys
    user_con_profile_attrs.merge!(JSON.parse(user_con_profile_attrs.delete("form_response_attrs_json")))
    assign_filtered_attrs(user_con_profile, user_con_profile_attrs.compact_blank)
    user_con_profile.needs_update = true
    user_con_profile.save!

    { user_con_profile: }
  end
  # rubocop:enable Metrics/AbcSize

  def assign_filtered_attrs(user_con_profile, attrs)
    user_con_profile.assign_form_response_attributes(
      user_con_profile.filter_form_response_attributes_for_assignment(
        attrs,
        convention.user_con_profile_form.form_items,
        context[:pundit_user]
      )
    )
  end

  def ensure_no_existing_user_con_profile(user)
    existing_profile = convention.user_con_profiles.find_by(user_id: user.id)
    return unless existing_profile

    raise(GraphQL::ExecutionError, "#{existing_profile.name} is already an attendee of #{convention.name}")
  end
end
