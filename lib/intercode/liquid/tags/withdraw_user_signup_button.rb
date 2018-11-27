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
      class WithdrawUserSignupButton < RailsPartialRenderer
        attr_reader :button_text, :button_class, :signup_variable_name

        def initialize(tag_name, args, _options)
          super
          return unless args && args =~ /(\w+)(\s+\"([^\"]+)\")?(\s+(\w.*))?/

          @signup_variable_name = Regexp.last_match(1)
          @button_text = Regexp.last_match(3)
          @button_class = Regexp.last_match(5)
        end

        def partial(_context)
          'events/withdraw_user_signup_button'
        end

        def locals(context)
          {
            event_title: context[signup_variable_name].event.title,
            run_id: context[signup_variable_name].run.id,
            button_text: button_text,
            button_class: button_class
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
