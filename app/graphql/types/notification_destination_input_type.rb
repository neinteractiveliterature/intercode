# frozen_string_literal: true
class Types::NotificationDestinationInputType < Types::BaseInputObject
  argument :transitional_user_con_profile_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userConProfileId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true
  argument :transitional_staff_position_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the staffPositionId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :staff_position_id, ID, required: false, camelize: true
end
