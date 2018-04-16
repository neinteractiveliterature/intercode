class Types::TeamMemberInputType < Types::BaseInputObject

  argument :display, Boolean, required: false
  argument :show_email, Boolean, required: false
  argument :receive_con_email, Boolean, required: false
  argument :receive_signup_email, Boolean, required: false
end
