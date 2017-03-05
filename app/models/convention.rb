require 'carrierwave/orm/activerecord'

class Convention < ApplicationRecord
  belongs_to :updated_by, :class_name => "User", optional: true
  has_many :pages, :as => :parent, dependent: :destroy
  has_many :cms_partials, dependent: :destroy
  has_many :cms_files, dependent: :destroy
  has_many :user_con_profiles, dependent: :destroy
  has_many :users, :through => :user_con_profiles
  has_many :events, dependent: :destroy
  has_many :runs, through: :events
  has_many :rooms, dependent: :destroy
  has_many :ticket_types, dependent: :destroy

  belongs_to :root_page, :class_name => "Page"

  serialize :maximum_event_signups, ActiveModelCoder.new('ScheduledValue::ScheduledValue')

  validates :name, :presence => true
  validates :domain, :presence => true, :uniqueness => true
  validates :timezone_name, presence: true
  validates :signups_allowed, :inclusion => { :in => %w(not_yet 1 2 3 yes not_now) }
  validates :show_schedule, :inclusion => { :in => %w(yes gms priv no) }
  validates :maximum_event_signups, presence: true
  validate :maximum_event_signups_must_cover_all_time
  validate :timezone_name_must_be_valid

  mount_uploader :banner_image, BannerImageUploader

  def started?
    starts_at && starts_at <= Time.now
  end

  def ended?
    ends_at && ends_at <= Time.now
  end

  def load_cms_content_set(name)
    LoadCmsContentSetService.new(convention: self, content_set_name: name).call!
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

  def timezone_name_must_be_valid
    return unless timezone_name.present?

    errors.add(:timezone_name, "must refer to a valid POSIX timezone") unless timezone
  end
end
