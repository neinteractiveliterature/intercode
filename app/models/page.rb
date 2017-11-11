class Page < ApplicationRecord
  include Cadmus::Page

  cadmus_page
  belongs_to :cms_layout, optional: true

  def effective_cms_layout
    cms_layout || parent&.default_layout
  end
end
