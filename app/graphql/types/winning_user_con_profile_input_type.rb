# frozen_string_literal: true
class Types::WinningUserConProfileInputType < Types::BaseInputObject
  argument :convention_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_convention_id, ID, required: false, camelize: true
  argument :user_con_profile_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_user_con_profile_id, ID, required: false, camelize: true
end
