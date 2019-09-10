module Intercode
  module Liquid
    module Tags
      # Renders an event's runs section, which includes the capacity graphs and signup buttons.
      # Requires specifying an event ID.
      #
      # @liquid_tag_name event_runs_section
      # @example
      #   {% event_runs_section 1234 %}
      class EventRunsSection < ::Liquid::Tag
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
          'RunsSection'
        end

        def props(context)
          { eventId: context.evaluate(event_id_expression) }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'event_runs_section',
  Intercode::Liquid::Tags::EventRunsSection
)
