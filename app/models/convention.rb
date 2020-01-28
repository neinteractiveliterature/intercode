class Convention < ApplicationRecord
  TICKET_MODES = %w[disabled required_for_signup]
  SITE_MODES = %w[convention single_event]
  SIGNUP_MODES = %w[self_service moderated]

  belongs_to :updated_by, class_name: 'User', optional: true
  belongs_to :organization, optional: true

  has_many :cms_navigation_items, as: :parent, dependent: :destroy
  has_many :pages, as: :parent, dependent: :destroy
  has_many :cms_content_groups, as: :parent, dependent: :destroy
  has_many :cms_layouts, as: :parent, dependent: :destroy
  has_many :cms_partials, as: :parent, dependent: :destroy
  has_many :cms_files, as: :parent, dependent: :destroy
  has_many :cms_graphql_queries, as: :parent, dependent: :destroy
  has_many :cms_variables, as: :parent, dependent: :destroy
  has_many :departments, dependent: :destroy
  has_many :notification_templates, dependent: :destroy
  has_many :user_con_profiles, dependent: :destroy
  has_many :users, through: :user_con_profiles
  has_many :events, dependent: :destroy
  has_many :event_categories, dependent: :destroy
  has_many :runs, through: :events
  has_many :signups, through: :runs
  has_many :signup_requests, through: :runs
  has_many :rooms, dependent: :destroy
  has_many :ticket_types, dependent: :destroy
  has_many :tickets, through: :ticket_types
  has_many :staff_positions, dependent: :destroy
  has_many :forms, dependent: :destroy
  has_many :event_proposals, dependent: :destroy
  has_many :products, dependent: :destroy
  has_many :orders, through: :user_con_profiles
  has_many :user_activity_alerts, dependent: :destroy
  has_many :permissions, dependent: :destroy

  belongs_to :root_page, class_name: 'Page', optional: true
  belongs_to :default_layout, class_name: 'CmsLayout', optional: true
  belongs_to :user_con_profile_form, class_name: 'Form', optional: true

  serialize :maximum_event_signups, ActiveModelCoder.new('ScheduledValue::ScheduledValue')

  validates :name, presence: true
  validates :domain, presence: true, uniqueness: true
  validates :timezone_name, presence: true
  validates :show_schedule, inclusion: { in: %w[yes gms priv no] }
  validates :show_event_list, inclusion: { in: %w[yes gms priv no] }
  validates :ticket_mode, inclusion: { in: TICKET_MODES }, presence: true
  validates :signup_mode, inclusion: { in: SIGNUP_MODES }, presence: true
  validates :site_mode, inclusion: { in: SITE_MODES }, presence: true
  validates :maximum_event_signups, presence: true
  validate :maximum_event_signups_must_cover_all_time
  validate :timezone_name_must_be_valid
  validate :site_mode_must_be_possible
  validate :show_event_list_must_be_at_least_as_permissive_as_show_schedule

  def started?
    starts_at && starts_at <= Time.now
  end

  def ended?
    ends_at && ends_at <= Time.now
  end

  def registrations_frozen?
    maximum_event_signups.value_at(Time.now) == 'not_now'
  end

  def tickets_available_for_purchase?
    return false if ended?
    return false if ticket_mode == 'disabled'

    ticket_types.publicly_available.any? do |ticket_type|
      ticket_type.pricing_schedule.has_value_at?(Time.now)
    end
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

  def masked_stripe_secret_key
    return stripe_secret_key if stripe_secret_key.blank?

    "#{stripe_secret_key[0..7]}...#{stripe_secret_key[-4..-1]}"
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

  def site_mode_must_be_possible
    return unless site_mode

    if site_mode == 'single_event' && ticket_mode != 'disabled'
      errors.add(:base, 'Single-event sites cannot sell tickets (yet)')
    end

    return unless site_mode == 'single_event' && events.count > 1
    errors.add(
      :site_mode,
      'single_event is not valid because this convention has multiple events already'
    )
  end

  SCHEDULE_RELEASE_PERMISSIVITY_ORDER = %w[no priv gms yes]
  def show_event_list_must_be_at_least_as_permissive_as_show_schedule
    show_event_list_permissivity = SCHEDULE_RELEASE_PERMISSIVITY_ORDER.index(show_event_list)
    show_schedule_permissivity = SCHEDULE_RELEASE_PERMISSIVITY_ORDER.index(show_schedule)

    if show_event_list_permissivity < show_schedule_permissivity
      errors.add(:show_event_list, 'must be at least as permissive as show_schedule')
    end
  end
end
