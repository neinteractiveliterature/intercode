# frozen_string_literal: true
class Types::UserConProfileFiltersInputType < Types::BaseInputObject
  argument :attending, Boolean, required: false
  argument :email, String, required: false
  argument :first_name, String, required: false, camelize: false
  argument :is_team_member, Boolean, required: false, camelize: false
  argument :last_name, String, required: false, camelize: false
  argument :name, String, required: false
  argument :payment_amount, Float, required: false, camelize: false
  argument :privileges,
           [String],
           'DEPRECATED. Privileges are deprecated in favor of permissions and staff positions',
           required: false
  argument :ticket, [String], required: false
  argument :ticket_type, [String], required: false, camelize: false
end
