module Intercode
  module LiquidTags
    class PartialRenderer < Liquid::Tag
      
      def render(context)
        context.registers["controller"].render_to_string(
          partial: partial(context),
          locals: locals(context)
        )
      end
      
      def locals
        {}
      end
      
    end
  end
end