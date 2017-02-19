module Intercode
  module Liquid
    module Filters
      def pluralize(input, singular, plural)
        if input.to_i == 1
          "#{input} #{singular}"
        else
          "#{input} #{plural}"
        end
      end
    end
  end
end

Liquid::Template.register_filter(Intercode::Liquid::Filters)