require 'carrierwave/orm/activerecord'

class Convention < ApplicationRecord
  belongs_to :updated_by, :class_name => "User", optional: true
  has_many :pages, :as => :parent
  has_many :user_con_profiles, dependent: :destroy
  has_many :users, :through => :user_con_profiles
  has_many :events, dependent: :destroy
  has_many :runs, through: :events
  has_many :rooms, dependent: :destroy
  has_many :ticket_types, dependent: :destroy

  belongs_to :root_page, :class_name => "Page"

  before_create :create_default_root_page
  after_create :fix_root_page_parent

  serialize :maximum_event_signups, ActiveModelCoder.new('ScheduledValue::ScheduledValue')

  validates :name, :presence => true
  validates :domain, :presence => true, :uniqueness => true
  validates :timezone_name, presence: true
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }
  validates :maximum_event_signups, presence: true
  validate :maximum_event_signups_must_cover_all_time

  mount_uploader :banner_image, BannerImageUploader

  def started?
    starts_at && starts_at <= Time.now
  end

  def ended?
    ends_at && ends_at <= Time.now
  end

  def create_default_root_page
    return if root_page

    con_name = name || "Untitled con"
    content = <<-EOF
    <h1>#{con_name}</h1>

    <p>Welcome to #{con_name}.  Content goes here.</p>
    EOF

    self.create_root_page(:content => content, :name => "Home page")
  end

  def fix_root_page_parent
    root_page.parent = self
    root_page.save!
  end

  def timezone
    return nil unless timezone_name.present?
    ActiveSupport::TimeZone[timezone_name]
  end

  def bucket_metadata_from_events
    events.pluck(:registration_policy).flat_map { |p| p.buckets.flat_map(&:metadata) }.uniq
  end

  def to_liquid
    ConventionDrop.new(self)
  end

  private

  def maximum_event_signups_must_cover_all_time
    return if maximum_event_signups.try!(:covers_all_time?)

    errors.add(:maximum_event_signups, "must cover all time")
  end
end
