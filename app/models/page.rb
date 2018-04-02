class Page < ApplicationRecord
  include Cadmus::Page
  include Concerns::CmsReferences

  cadmus_page
  belongs_to :cms_layout, optional: true

  def effective_cms_layout
    cms_layout || parent&.default_layout
  end

  def to_liquid
    PageDrop.new(self)
  end

  def referenced_partials_recursive(blacklist = [])
    (super + effective_cms_layout.referenced_partials_recursive(blacklist)).uniq
  end
end
