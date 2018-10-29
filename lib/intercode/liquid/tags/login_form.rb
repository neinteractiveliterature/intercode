module Intercode
  module Liquid
    module Tags
      # Renders a login form for the site.
      #
      # @liquid_tag_name login_form
      class LoginForm < RailsPartialRenderer
        def partial(_context)
          'devise/sessions/login_form'
        end

        def locals(context)
          {
            resource: context.registers['controller'].current_user || User.new,
            resource_name: 'user',
            devise_mapping: Devise.mappings[:user]
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag('login_form', Intercode::Liquid::Tags::LoginForm)
