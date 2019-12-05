module Intercode
  module Liquid
    module Filters
      include AbsoluteUrls

      # Can be used to either pluralize a singular noun, or to conditionally pluralize a noun based
      # on a count.
      #
      # @param input [String, Integer] The input to pluralize.  If it's a string, that string will
      #                                be unconditionally pluralized.  If it's a number, pluralize
      #                                will read the singular and plural parameters and decide
      #                                between them depending on whether input is 1.
      # @param singular [String] Optional.  If input is a number, this will be the result if input
      #                                     is 1.
      # @param plural [String] Optional.  If input is a number, this will be the result if input is
      #                                   not 1.
      # @return String
      # @example Pluralizing a noun unconditionally
      #   {{ "goose" | pluralize }} => "geese"
      # @example Pluralizing a count
      #   You are signed up for {{ user_con_profile.signups.length | pluralize "game" "games" }}
      #   => "You are signed up for 3 games"
      def pluralize(input, singular = nil, plural = nil)
        return input.pluralize if input.is_a?(String)

        if input.to_i == 1
          "#{input} #{singular}"
        else
          "#{input} #{plural}"
        end
      end

      # Outputs either a clickable mailto: link (if the user is currently logged in), or an
      # obfuscated email (if the user is not logged in).  The intent of this is to be a spammer-safe
      # way to link to email addresses.
      #
      # @param input [String] An email address
      # @return String A spammer-safe HTML representation of the email address
      # @example When logged in
      #   {{ "test@example.com" | email_link }}
      #   => <a href="mailto:test@example.com">test@example.com</a>
      # @example When not logged in
      #   {{ "test@example.com" | email_link }}
      #   => test AT example DOT com
      def email_link(input)
        return unless input

        if @context['user']
          %(<a href="mailto:#{input}">#{input}</a>)
        else
          ApplicationHelper.obfuscated_email(input)
        end
      end

      # Given an array of strings, outputs an English representation of that array.
      #
      # @param input [Array<String>] An array of strings
      # @return String
      # @example One string
      #   {{ ["one fish"] | to_sentence }} => one fish
      # @example Two strings
      #   {{ ["one fish", "two fish"] | to_sentence }} => one fish and two fish
      # @example More than two strings
      #   {{ ["one fish", "two fish", "red fish", "blue fish"] | to_sentence }}
      #   => one fish, two fish, red fish, and blue fish
      def to_sentence(input)
        input&.to_sentence
      end

      # Runs a string through the Ruby on Rails "humanize" filter.
      # @see https://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#method-i-humanize
      #      the Rails documentation for this method
      def humanize(input)
        input&.humanize
      end

      # Runs a string through the Ruby on Rails "singularize" filter.
      # @see https://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#method-i-singularize
      #      the Rails documentation for this method
      def singularize(input)
        input&.singularize
      end

      # Runs a string through the Ruby on Rails "titleize" filter.
      # @see https://api.rubyonrails.org/classes/ActiveSupport/Inflector.html#method-i-titleize
      #      the Rails documentation for this method
      def titleize(input)
        input&.titleize
      end

      # Given a relative URL, turns it into an absolute URL for the current convention.
      # Given an absolute URL, changes the hostname to the current convention host.
      def absolute_url(path)
        return path unless @context.registers['convention']
        url_with_convention_host(path, @context.registers['convention'])
      end
    end
  end
end

Liquid::Template.register_filter(Intercode::Liquid::Filters)
