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
      #   {% withdraw_user_signup_button signup "Withdraw my signup" btn-warning %}
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
          "WithdrawMySignupButton"
        end

        def props(context) # rubocop:disable Metrics/MethodLength
          signup = context[signup_variable_name]
          signup_rounds = signup.event.convention.signup_rounds

          {
            event: {
              title: signup.event.title
            },
            run: {
              id: signup.run.id
            },
            signup: {
              id: signup.id,
              state: signup.state,
              counted: signup.counted
            },
            signupRounds:
              signup_rounds.map do |round|
                { start: round.start&.rfc3339, maximum_event_signups: round.maximum_event_signups }
              end,
            buttonText: button_text,
            buttonClass: button_class,
            reloadOnSuccess: true
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag("withdraw_user_signup_button", Intercode::Liquid::Tags::WithdrawUserSignupButton)
