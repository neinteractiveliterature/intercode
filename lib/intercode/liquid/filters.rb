module Intercode
  module Liquid
    module Filters
      def pluralize(input, singular = nil, plural = nil)
        return input.pluralize if input.is_a?(String)

        if input.to_i == 1
          "#{input} #{singular}"
        else
          "#{input} #{plural}"
        end
      end

      def email_link(input)
        return unless input

        if @context['user']
          %(<a href="mailto:#{input}">#{input}</a>)
        else
          ApplicationHelper.obfuscated_email(input)
        end
      end

      def to_sentence(input)
        input&.to_sentence
      end

      def humanize(input)
        input&.humanize
      end

      def singularize(input)
        input&.singularize
      end

      def titleize(input)
        input&.titleize
      end
    end
  end
end

Liquid::Template.register_filter(Intercode::Liquid::Filters)
