module Intercode
  module Liquid
    module Tags
      # Renders an event's admin menu, if the user is permitted to administer the event.
      # Requires specifying an event ID.
      #
      # @liquid_tag_name event_admin_menu
      # @example
      #   {% event_admin_menu 1234 %}
      class EventAdminMenu < AppComponentRenderer
        attr_reader :event_id_expression

        def initialize(tag_name, args, _options)
          super
          @event_id_expression = ::Liquid::Expression.parse(args)
        end

        def component_name(_context)
          'EventAdminMenu'
        end

        def props(context)
          { eventId: context.evaluate(event_id_expression) }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'event_admin_menu',
  Intercode::Liquid::Tags::EventAdminMenu
)
