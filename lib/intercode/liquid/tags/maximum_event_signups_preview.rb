module Intercode
  module Liquid
    module Tags
      # Renders a calendar showing the maximum event signup schedule for a convention.
      #
      # @liquid_tag_name maximum_event_signups_preview
      # @example
      #   {% maximum_event_signups_preview convention.maximum_event_signups %}
      class MaximumEventSignupsPreview < ::Liquid::Tag
        include AppComponentRenderer

        attr_reader :value_expression

        def initialize(tag_name, args, _options)
          super
          @value_expression = ::Liquid::Expression.parse(args)
        end

        def render(context)
          render_react_component(context)
        end

        def component_name(_context)
          'MaximumEventSignupsPreview'
        end

        def props(context)
          scheduled_value = context.evaluate(value_expression).scheduled_value
          {
            maximumEventSignups: {
              timespans:
                scheduled_value.timespans.map do |timespan|
                  { start: timespan.start&.iso8601, finish: timespan.finish&.iso8601, value: timespan.value }
                end,
              timezoneName: Time.zone.name
            }
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag('maximum_event_signups_preview', Intercode::Liquid::Tags::MaximumEventSignupsPreview)
