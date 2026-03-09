# frozen_string_literal: true
class Types::OrganizationAttendanceCountType < Types::BaseObject
  description "Attendance data for a single attendee across all conventions in the organization."

  field :attended_conventions,
        [Types::ConventionType],
        null: false,
        description: "All conventions in the organization that this attendee has attended."
  field :current_convention_user_con_profile,
        Types::UserConProfileType,
        null: false,
        description: "The attendee's profile for the current convention."
  field :user_con_profiles,
        [Types::UserConProfileType],
        null: false,
        description: "IDs of all the attendee's profiles across conventions in the organization."
  field :user_id, ID, null: false, description: "The ID of the user account for this attendee." # rubocop:disable GraphQL/ExtractType

  def attended_conventions
    dataloader.with(Sources::ModelById, Convention).load_all(object.attended_convention_ids)
  end

  def user_con_profiles
    dataloader.with(Sources::ModelById, UserConProfile).load_all(object.user_con_profile_ids)
  end
end
