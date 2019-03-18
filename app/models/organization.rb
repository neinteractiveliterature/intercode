class Organization < ApplicationRecord
  has_many :conventions, dependent: :nullify
  has_many :organization_roles, dependent: :destroy

  def to_liquid
    OrganizationDrop.new(self)
  end
end
