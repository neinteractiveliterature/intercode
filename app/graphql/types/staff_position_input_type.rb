class Types::StaffPositionInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :email, String, required: false
  argument :visible, Boolean, required: false
  argument :user_con_profile_ids, [Integer], required: false
end
