# frozen_string_literal: true

# Serving the prebuilt framework-mode shell (build/framework/client/index.html) from Rails, for deployments without a
# CDN or reverse proxy that does it. Set STATIC_SHELL_DIR to a copy of the build in which the assets host has already
# been substituted (see script/substituteAssetsHost.sh); the assets themselves are served from public/assets as usual.
# Without it, Rails keeps rendering the shell itself.
module StaticSpaShell
  ROUTING = JSON.parse(Rails.root.join("terraform/modules/cloudfront_intercode/routing.json").read).freeze

  # The same list the CloudFront Function and the nginx config use
  CRAWLER_USER_AGENT_REGEX =
    Regexp.new(ROUTING.fetch("crawler_user_agents").map { |agent| Regexp.escape(agent) }.join("|"), Regexp::IGNORECASE)

  class << self
    def directory
      ENV["STATIC_SHELL_DIR"].presence
    end

    def enabled?
      directory.present?
    end

    def index_path
      File.join(directory, "index.html")
    end

    def crawler?(user_agent)
      CRAWLER_USER_AGENT_REGEX.match?(user_agent.to_s)
    end
  end
end
