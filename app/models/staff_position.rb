class StaffPosition < ApplicationRecord
  belongs_to :convention
  has_and_belongs_to_many :user_con_profiles

  validates :name, presence: true

  scope :visible, -> { where(visible: true) }

  def to_liquid
    StaffPositionDrop.new(self)
  end
end
