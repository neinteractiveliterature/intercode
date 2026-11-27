# frozen_string_literal: true
class GraphiqlController < ApplicationController
  # The editor's script comes from the frontend development server, so the page has to be loaded through it
  def show
    return unless FrontendDevServer.enabled? && !FrontendDevServer.proxied?(request)

    redirect_to FrontendDevServer.url_for(request), allow_other_host: true
  end
end
