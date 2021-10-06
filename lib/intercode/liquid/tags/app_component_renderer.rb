module Intercode
  module Liquid
    module Tags
      # @api
      module AppComponentRenderer
        include ActionView::Helpers::TagHelper

        def render_react_component(context)
          render_low_level_component_tag(component_name(context), merge_controller_props(context, props(context)))
        end

        def merge_controller_props(context, component_props)
          controller_props = context.registers['controller']&.app_component_props
          (controller_props || {}).merge(component_props)
        end

        def render_low_level_component_tag(classname, component_props)
          content_tag(:div, '', 'data-react-class' => classname, 'data-react-props' => JSON.dump(component_props))
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
