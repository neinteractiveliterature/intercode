class Page < ActiveRecord::Base
  attr_accessible :content, :name, :parent_id, :parent_type, :slug
  cadmus_page
end
