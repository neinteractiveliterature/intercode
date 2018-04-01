class CmsLayout < ApplicationRecord
  include Cadmus::Layout
  include Concerns::CmsReferences

  cadmus_layout
end
