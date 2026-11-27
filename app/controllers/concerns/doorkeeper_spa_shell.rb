# frozen_string_literal: true

# The SPA renders the HTML pages of Doorkeeper's authorization and authorized applications endpoints, so where
# Doorkeeper would render one of its own views for them, serve the SPA shell instead (see render_spa_shell).
# Redirects, JSON and the form_post response (a self-submitting form, which has to be Doorkeeper's own view) are left
# alone.
module DoorkeeperSpaShell
  SPA_TEMPLATES = %i[new error].freeze

  def render(*args, **options, &)
    # No arguments at all is the implicit render of AuthorizedApplicationsController#index
    return super unless SPA_TEMPLATES.include?(args.first) || (args.empty? && options.empty? && !block_given?)

    render_spa_shell
    # Set afterwards because send_file always sets a status of its own. In development render_spa_shell can redirect to
    # the frontend dev server instead (see FrontendDevServer), and that has to stay a redirect.
    self.status = options[:status] if options[:status] && !response.redirect?
  end
end
