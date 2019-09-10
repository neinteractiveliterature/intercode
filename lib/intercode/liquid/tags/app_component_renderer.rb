module Intercode
  module Liquid
    module Tags
      # @api
      module AppComponentRenderer
        include ActionView::Helpers::TagHelper

        def render_react_component(context)
          content_tag(
            :div,
            '',
            'data-react-class' => component_name(context),
            'data-react-props' => JSON.dump(
              context.registers['controller'].app_component_props
                .merge(props(context))
            )
          )
        end

        def component_name(_context)
          raise 'AppComponentRenderer#component_name must be implemented by subclasses'
        end

        def props(_context)
          {}
        end
      end
    end
  end
end
