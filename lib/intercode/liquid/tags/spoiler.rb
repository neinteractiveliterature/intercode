module Intercode
  module Liquid
    module Tags
      # Renders the included text as a spoiler (click to reveal).
      #
      # @liquid_tag_name spoiler
      # @example
      #   {% spoiler %}Rosebud is a sled{% endspoiler %}
      class Spoiler < ::Liquid::Block
        include AppComponentRenderer

        def component_name(_context)
          'Spoiler'
        end

        def render(context)
          @spoiler_content = super(context)
          render_react_component(context)
        end

        def props(_context)
          { content: @spoiler_content }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'spoiler',
  Intercode::Liquid::Tags::Spoiler
)
