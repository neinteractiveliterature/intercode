module Intercode
  module Liquid
    module Tags
      # Renders a "Withdraw" button for an existing signup.  The button text and the button
      # CSS classes can be customized.
      #
      # @liquid_tag_name withdraw_user_signup_button
      # @example Basic
      #   {% withdraw_user_signup_button signup %}
      # @example Customizing the button text
      #   {% withdraw_user_signup_button signup "Withdraw my signup" %}
      # @example Customizing the button text and the CSS class
      #   {% withdraw_user_signup_button "Withdraw my signup" btn-warning %}
      class WithdrawUserSignupButton < ::Liquid::Tag
        include AppComponentRenderer

        attr_reader :button_text, :button_class, :signup_variable_name

        def initialize(tag_name, args, _options)
          super
          return unless args && args =~ /(\w+)(\s+\"([^\"]+)\")?(\s+(\w.*))?/

          @signup_variable_name = Regexp.last_match(1)
          @button_text = Regexp.last_match(3)
          @button_class = Regexp.last_match(5)
        end

        def render(context)
          render_react_component(context)
        end

        def component_name(_context)
          'WithdrawMySignupButton'
        end

        def props(context)
          {
            event: { title: context[signup_variable_name].event.title },
            run: { id: context[signup_variable_name].run.id },
            buttonText: button_text,
            buttonClass: button_class,
            reloadOnSuccess: true
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'withdraw_user_signup_button',
  Intercode::Liquid::Tags::WithdrawUserSignupButton
)
