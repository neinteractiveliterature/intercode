class Types::UserConProfileFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :first_name, String, required: false, camelize: false
  argument :last_name, String, required: false, camelize: false
  argument :email, String, required: false
  argument :ticket, [String], required: false
  argument :ticket_type, [String], required: false, camelize: false
  argument :privileges, [String],
    required: false,
    deprecation_reason: 'Privileges are deprecated in favor of permissions and staff positions'
  argument :payment_amount, Float, required: false, camelize: false
  argument :attending, Boolean, required: false
  argument :is_team_member, Boolean, required: false, camelize: false
end
