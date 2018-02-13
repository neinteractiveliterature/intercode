class StaffPosition < ApplicationRecord
  belongs_to :convention
  has_and_belongs_to_many :user_con_profiles

  validates :name, presence: true

  def to_liquid
    StaffPositionDrop.new(self)
  end
end
