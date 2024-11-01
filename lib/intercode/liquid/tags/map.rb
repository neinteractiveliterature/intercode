module Intercode
  module Liquid
    module Tags
      # Renders a map centered on a given location.  You can pass an explicit height as a CSS
      # length value.  If no height is passed, the height will default to "30rem".
      #
      # @liquid_tag_name map
      # @example
      #   {% map convention.location "8rem" %}
      class Map < ::Liquid::Tag
        SYNTAX = /(\S+)(\s+(\S+))?/om

        include AppComponentRenderer

        attr_reader :value_expression, :height_expression

        def initialize(tag_name, args, _options)
          super
          match = SYNTAX.match(args)
          raise SyntaxError, "Invalid map arguments syntax" unless match

          @value_expression = ::Liquid::Expression.parse(match[1])
          @height_expression = match[3] ? ::Liquid::Expression.parse(match[3]) : nil
        end

        def render(context)
          component_props = props(context)

          render_low_level_component_tag(component_name(context), merge_controller_props(context, component_props))
        end

        def component_name(_context)
          "ConventionLocationMap"
        end

        def props(context)
          location = context.evaluate(value_expression)
          height = height_expression ? context.evaluate(height_expression) : nil

          { location: location.to_json, height: height }
        end
      end
    end
  end
end

Liquid::Template.register_tag("map", Intercode::Liquid::Tags::Map)
