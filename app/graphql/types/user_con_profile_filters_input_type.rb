class Types::UserConProfileFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :first_name, String, required: false, camelize: false
  argument :last_name, String, required: false, camelize: false
  argument :email, String, required: false
  argument :ticket, [String], required: false
  argument :ticket_type, [String], required: false, camelize: false
  argument :privileges, [String], required: false
  argument :payment_amount, Float, required: false, camelize: false
  argument :attending, Boolean, required: false
  argument :is_team_member, Boolean, required: false, camelize: false
end
