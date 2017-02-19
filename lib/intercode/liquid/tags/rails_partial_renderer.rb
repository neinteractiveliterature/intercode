module Intercode
  module Liquid
    module Tags
      class RailsPartialRenderer < ::Liquid::Tag
        def render(context)
          context.registers["controller"].render_to_string(
            partial: partial(context),
            locals: locals(context)
          )
        end

        def partial(_context)
          raise "RailsPartialRenderer#partial must be implemented by subclasses"
        end

        def locals(_context)
          {}
        end
      end
    end
  end
end