# frozen_string_literal: true
class Types::NotificationDestinationInputType < Types::BaseInputObject
  argument :user_con_profile_id, ID, required: false, camelize: true
  argument :staff_position_id, ID, required: false, camelize: true
end
