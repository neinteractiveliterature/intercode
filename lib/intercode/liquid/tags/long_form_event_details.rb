module Intercode
  module Liquid
    module Tags
      # Renders the long-form event details section (usually including stuff like the event's
      # description, content warnings, etc.)  Requires specifying an event ID.
      #
      # @liquid_tag_name long_form_event_details
      # @example
      #   {% long_form_event_details 1234 %}
      class LongFormEventDetails < ::Liquid::Tag
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
          'LongFormEventDetails'
        end

        def props(context)
          { eventId: context.evaluate(event_id_expression) }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'long_form_event_details',
  Intercode::Liquid::Tags::LongFormEventDetails
)
