class CmsPartial < ApplicationRecord
  include Cadmus::Partial
  include Concerns::CmsReferences

  cadmus_partial
end
