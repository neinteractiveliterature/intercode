# frozen_string_literal: true
class Types::WinningUserConProfileInputType < Types::BaseInputObject
  argument :convention_id, ID, required: false, camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true
end
