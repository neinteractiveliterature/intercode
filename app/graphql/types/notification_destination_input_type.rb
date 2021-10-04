# frozen_string_literal: true
class Types::NotificationDestinationInputType < Types::BaseInputObject
  argument :user_con_profile_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_user_con_profile_id, ID, required: false, camelize: true
  argument :staff_position_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_staff_position_id, ID, required: false, camelize: true
end
