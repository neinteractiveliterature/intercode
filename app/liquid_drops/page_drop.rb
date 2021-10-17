# frozen_string_literal: true
# A page in the CMS for this convention
class PageDrop < Liquid::Drop
  # @api
  attr_reader :page

  # @!method name
  #   @return [String] The name of the page
  # @!method slug
  #   @return [String] The unique URL path of the page (under the /pages URL)
  delegate :name, :slug, to: :page

  # @api
  def initialize(page)
    @page = page
  end
end
