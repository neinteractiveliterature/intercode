class OrganizationRole < ApplicationRecord
  belongs_to :organization
  has_and_belongs_to_many :users
  has_many :permisisons, dependent: :destroy
end
