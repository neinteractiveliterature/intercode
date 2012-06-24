module Intercode
  module LiquidTags
    class LoginForm < PartialRenderer
      def partial(context)
        "devise/sessions/login_form"
      end
      
      def locals(context)
        {
          resource: context.registers["controller"].current_user || User.new,
          resource_name: "user",
          devise_mapping: Devise.mappings[:user]
        }
      end
    end
  end
end

Liquid::Template.register_tag('login_form', Intercode::LiquidTags::LoginForm)