class Run < ActiveRecord::Base
  belongs_to :event
  belongs_to :updated_by, :class_name => "User"
  has_many :signups, dependent: :destroy
  has_and_belongs_to_many :rooms

  delegate :length_seconds, :to => :event

  def ends_at
    starts_at + length_seconds.seconds
  end
end
