module UserFilters
  def login_form(user)
    @context.registers["controller"].render_to_string(
      partial: "devise/sessions/login_form",
      locals: {
        resource: @context.registers["controller"].current_user || User.new,
        resource_name: "user",
        devise_mapping: Devise.mappings[:user]
      }
    )
  end
end