class Con < ActiveRecord::Base
  belongs_to :updated_by, :class_name => "User"
  
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }
  
  has_many :virtual_hosts
  
  def started?
    starts_at <= Time.now
  end
  
  def ended?
    ends_at <= Time.now
  end
end
