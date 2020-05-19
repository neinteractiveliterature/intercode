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

      # Converts all whitespace in a string to single spaces, and strips whitespace off the
      # beginning and end.
      def condense_whitespace(input)
        return nil unless input
        input.strip.gsub(/\s+/, ' ')
      end

      # Given a time object, format it in the given timezone, translating to the user's local
      # time if it isn't the same.
      # @param input [ActiveSupport::TimeWithZone] A time object
      # @param format [String] A time formatting string, like the one the built-in Liquid "date"
      #                        filter uses (see http://strftime.net for examples).  We recommend
      #                        including "%Z" in this string in order to have an explicit time zone
      #                        specifier.
      # @param timezone_name [String] An IANA timezone name to use for the default format.  If
      #                               not given, this filter will try to use the convention's
      #                               local timezone (if one exists).
      # @return String
      # @example Formatting a time using an explicit time zone, while the user is in that zone
      #   {{ convention.starts_at | date_with_local_time: "%l:%M%P %Z", "America/New_York" }} =>
      #     "7:00pm EDT"
      # @example Formatting a time using an explicit time zone, while the user is not in that zone
      #   {{ convention.starts_at | date_with_local_time: "%l:%M%P %Z", "America/New_York" }} =>
      #     "7:00pm EDT (4:00pm PDT)"
      # @example Using the convention's time zone implicitly
      #   {{ convention.starts_at | date_with_local_time: "%l:%M%P %Z" }} => "7:00pm EDT"
      def date_with_local_time(input, format, timezone_name = nil)
        return nil unless input

        effective_timezone = find_effective_timezone(timezone_name)
        time_in_zone = input.in_time_zone(effective_timezone).strftime(format)

        if timezones_match?(effective_timezone, @context.registers[:timezone])
          time_in_zone
        else
          time_in_user_zone = input.in_time_zone(@context.registers[:timezone]).strftime(format)
          "#{time_in_zone.strip} (#{time_in_user_zone.strip})"
        end
      end

      # Given a timespan, format it in the given timezone, translating to the user's local
      # time if it isn't the same.  Automatically removes duplicate verbiage in the middle (e.g.
      # day of week, time zone, etc.)
      # @param input [ScheduledValue::TimespanDrop] A timespan
      # @param format [String] A time formatting string, like the one the built-in Liquid "date"
      #                        filter uses (see http://strftime.net for examples).  We recommend
      #                        including "%Z" in this string in order to have an explicit time zone
      #                        specifier.
      # @param timezone_name [String] An IANA timezone name to use for the default format.  If
      #                               not given, this filter will try to use the convention's
      #                               local timezone (if one exists).
      # @return String
      # @example Formatting a timespan using an explicit time zone, while the user is in that zone
      #   {{ convention.timespan
      #     | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z", "America/New_York" }} =>
      #     "Saturday, July 11 from 10:00am to 11:59pm EDT"
      # @example Formatting a time using an explicit time zone, while the user is not in that zone
      #   {{ convention.timespan
      #     | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z", "America/New_York" }} =>
      #     "Saturday, July 11 from 10:00am to 11:59pm EDT (7:00am to 8:59pm PDT)"
      # @example Using the convention's time zone implicitly
      #   {{ convention.timespan | timespan_with_local_time: "%A, %B %e from %l:%M%P %Z" }} =>
      #     "Saturday, July 11 from 10:00am to 11:59pm EDT"
      def timespan_with_local_time(input, format, timezone_name = nil)
        return nil unless input

        effective_timezone = find_effective_timezone(timezone_name)
        timespan_in_zone = describe_timespan(input, format, effective_timezone)

        if timezones_match?(effective_timezone, @context.registers[:timezone])
          timespan_in_zone.strip
        else
          timespan_in_user_zone = describe_timespan(input, format, @context.registers[:timezone])
          _, deduped_user = remove_common_middle(timespan_in_zone, timespan_in_user_zone)
          "#{timespan_in_zone.strip} (#{deduped_user.strip})"
        end
      end

      private

      def find_effective_timezone(timezone_name = nil)
        effective_timezone_name = (
          timezone_name.presence || @context.registers['convention'].timezone_name
        )
        ActiveSupport::TimeZone[effective_timezone_name]
      end

      def timezones_match?(a, b)
        now = Time.zone.now
        zone_strings = [a, b].map { |zone| now.in_time_zone(zone).strftime('%Z') }
        zone_strings[0] == zone_strings[1]
      end

      def common_prefix(a, b, delimiter = '')
        i = 0
        prefix = []
        a_arr = a.split(delimiter)
        b_arr = b.split(delimiter)

        while i < a_arr.length && i < b_arr.length
          return prefix.join(delimiter) unless a_arr[i] == b_arr[i]

          prefix << a_arr[i]
          i += 1
        end

        prefix.join(delimiter)
      end

      def common_suffix(a, b, delimiter = '')
        common_prefix(a.reverse, b.reverse, delimiter).reverse
      end

      def remove_common_middle(a, b, delimiter = ' ')
        prefix = common_prefix(a, b, delimiter)
        suffix = common_suffix(a, b, delimiter)
        prefix_regex = /\A#{Regexp.escape(prefix)}/
        suffix_regex = /#{Regexp.escape(suffix)}\z/

        [a.sub(suffix_regex, '').strip, b.sub(prefix_regex, '').strip]
      end

      def describe_timespan(timespan, format, timezone)
        start = if timespan.start
          timespan.start.in_time_zone(timezone).strftime(format)
        else
          'anytime'
        end

        finish = if timespan.finish
          timespan.finish.in_time_zone(timezone).strftime(format)
        else
          'indefinitely'
        end

        deduped_start, deduped_finish = remove_common_middle(start, finish)
        [deduped_start, deduped_finish].join(timespan.finish ? ' to ' : ' ')
      end
    end
  end
end

Liquid::Template.register_filter(Intercode::Liquid::Filters)
