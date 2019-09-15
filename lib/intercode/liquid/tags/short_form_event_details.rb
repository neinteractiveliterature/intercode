module Intercode
  module Liquid
    module Tags
      # Renders the short-form event details list (usually including stuff like the event's team
      # members, contact email, authors, etc.)  Requires specifying an event ID.
      #
      # @liquid_tag_name short_form_event_details
      # @example
      #   {% short_form_event_details 1234 %}
      class ShortFormEventDetails < ::Liquid::Tag
        include AppComponentRenderer

        attr_reader :event_id_expression

        def initialize(tag_name, args, _options)
          super
          @event_id_expression = ::Liquid::Expression.parse(args)
        end

        def render(context)
          render_react_component(context)
        end

        def component_name(_context)
          'ShortFormEventDetails'
        end

        def props(context)
          { eventId: context.evaluate(event_id_expression) }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'short_form_event_details',
  Intercode::Liquid::Tags::ShortFormEventDetails
)
