# frozen_string_literal: true
class Types::SignupRequestFiltersInputType < Types::BaseInputObject
  argument :state, [Types::SignupRequestStateType], required: false
end
