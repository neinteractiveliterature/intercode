class Types::SignupRequestFiltersInputType < Types::BaseInputObject
  argument :state, [Types::SignupRequestStateType], required: false
end
