module Intercode
  module Liquid
    module Tags
      # Renders an "Add to Calendar" dropdown menu for a user to subscribe to their personal con
      # schedule.  The user's ical_secret must be provided.  The button CSS classes can be
      # customized.
      #
      # @liquid_tag_name add_to_calendar_dropdown
      # @example Customizing the CSS class
      #   {% add_to_calendar_dropdown user_con_profile.ical_secret btn btn-primary %}
      class AddToCalendarDropdown < ::Liquid::Tag
        include AppComponentRenderer

        attr_reader :ical_secret_expression, :button_class

        def initialize(tag_name, args, _options)
          super
          return unless args && args =~ /([^\s]+)(\s+(\w.*))?/

          @ical_secret_expression = ::Liquid::Expression.parse(Regexp.last_match(1))
          @button_class = Regexp.last_match(3)
        end

        def render(context)
          render_react_component(context)
        end

        def component_name(_context)
          'AddToCalendarDropdown'
        end

        def props(context)
          {
            icalSecret: context.evaluate(ical_secret_expression),
            className: button_class.presence || 'btn btn-secondary'
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'add_to_calendar_dropdown',
  Intercode::Liquid::Tags::AddToCalendarDropdown
)
