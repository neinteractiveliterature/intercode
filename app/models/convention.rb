require 'carrierwave/orm/activerecord'

class Convention < ApplicationRecord
  belongs_to :updated_by, class_name: 'User', optional: true
  has_many :pages, as: :parent, dependent: :destroy
  has_many :cms_layouts, as: :parent, dependent: :destroy
  has_many :cms_partials, as: :parent, dependent: :destroy
  has_many :cms_files, as: :parent, dependent: :destroy
  has_many :cms_navigation_items, as: :parent, dependent: :destroy
  has_many :user_con_profiles, dependent: :destroy
  has_many :users, through: :user_con_profiles
  has_many :events, dependent: :destroy
  has_many :runs, through: :events
  has_many :signups, through: :runs
  has_many :rooms, dependent: :destroy
  has_many :ticket_types, dependent: :destroy
  has_many :tickets, through: :ticket_types
  has_many :staff_positions, dependent: :destroy
  has_many :forms, dependent: :destroy
  has_many :event_proposals, dependent: :destroy
  has_many :products, dependent: :destroy

  belongs_to :root_page, class_name: 'Page', optional: true
  belongs_to :default_layout, class_name: 'CmsLayout', optional: true
  belongs_to :event_proposal_form, class_name: 'Form', optional: true
  belongs_to :user_con_profile_form, class_name: 'Form', optional: true
  belongs_to :regular_event_form, class_name: 'Form', optional: true
  belongs_to :volunteer_event_form, class_name: 'Form', optional: true
  belongs_to :filler_event_form, class_name: 'Form', optional: true

  serialize :maximum_event_signups, ActiveModelCoder.new('ScheduledValue::ScheduledValue')

  validates :name, presence: true
  validates :domain, presence: true, uniqueness: true
  validates :timezone_name, presence: true
  validates :show_schedule, inclusion: { in: %w[yes gms priv no] }
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

  def registrations_frozen?
    maximum_event_signups.value_at(Time.now) == 'not_now'
  end

  def length_seconds
    ends_at - starts_at
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

  def form_for_event_category(event_category)
    case event_category
    when 'volunteer_event' then volunteer_event_form
    when 'filler' then filler_event_form
    else regular_event_form
    end
  end

  private

  def maximum_event_signups_must_cover_all_time
    return if maximum_event_signups.try!(:covers_all_time?)

    errors.add(:maximum_event_signups, 'must cover all time')
  end

  def timezone_name_must_be_valid
    return unless timezone_name.present?

    errors.add(:timezone_name, 'must refer to a valid POSIX timezone') unless timezone
  end
end
