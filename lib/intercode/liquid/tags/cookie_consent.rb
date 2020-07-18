module Intercode
  module Liquid
    module Tags
      # Renders a cookie consent.  Requires a URL for a cookie policy to link to.
      #
      # @liquid_tag_name cookie_consent
      # @example
      #   {% cookie_consent https://www.neilhosting.net/pages/cookies %}
      class CookieConsent < ::Liquid::Tag
        include AppComponentRenderer

        attr_reader :cookie_policy_url

        def initialize(tag_name, args, _options)
          super
          @cookie_policy_url = args.strip
        end

        def render(context)
          render_react_component(context)
        end

        def component_name(_context)
          'CookieConsent'
        end

        def props(_context)
          { cookiePolicyUrl: cookie_policy_url }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'cookie_consent',
  Intercode::Liquid::Tags::CookieConsent
)
