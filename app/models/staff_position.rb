class StaffPosition < ApplicationRecord
  belongs_to :convention
  has_and_belongs_to_many :user_con_profiles
  has_many :permissions, dependent: :destroy

  validates :name, presence: true
  validate :ensure_email_domain_matches_convention

  scope :visible, -> { where(visible: true) }

  def to_liquid
    StaffPositionDrop.new(self)
  end
end
