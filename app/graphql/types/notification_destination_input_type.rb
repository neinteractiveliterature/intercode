class Types::NotificationDestinationInputType < Types::BaseInputObject
  argument :user_con_profile_id, Int, required: false, camelize: false
  argument :staff_position_id, Int, required: false, camelize: false
end
