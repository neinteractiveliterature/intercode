class Types::WinningUserConProfileInputType < Types::BaseInputObject
  argument :convention_id, Integer, required: true
  argument :user_con_profile_id, Integer, required: true
end
