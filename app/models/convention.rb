# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: conventions
#
#  id                             :integer          not null, primary key
#  accepting_proposals            :boolean
#  canceled                       :boolean          default(FALSE), not null
#  clickwrap_agreement            :text
#  domain                         :string           not null
#  email_from                     :text             not null
#  email_mode                     :string           default("forward"), not null
#  ends_at                        :datetime
#  event_mailing_list_domain      :text
#  favicon                        :text
#  hidden                         :boolean          default(FALSE), not null
#  language                       :string           not null
#  location                       :jsonb
#  maximum_event_signups          :jsonb
#  maximum_tickets                :integer
#  name                           :string
#  open_graph_image               :text
#  show_event_list                :string           default("no"), not null
#  show_schedule                  :string           default("no"), not null
#  signup_mode                    :string           default("self_service"), not null
#  signup_requests_open           :boolean          default(FALSE), not null
#  site_mode                      :string           default("convention"), not null
#  starts_at                      :datetime
#  stripe_account_ready_to_charge :boolean          default(FALSE), not null
#  ticket_mode                    :string           default("disabled"), not null
#  ticket_name                    :string           default("ticket"), not null
#  timezone_mode                  :string           not null
#  timezone_name                  :string
#  created_at                     :datetime
#  updated_at                     :datetime
#  catch_all_staff_position_id    :bigint
#  default_layout_id              :bigint
#  organization_id                :bigint
#  root_page_id                   :integer
#  stripe_account_id              :text
#  updated_by_id                  :integer
#  user_con_profile_form_id       :bigint
#
# Indexes
#
#  index_conventions_on_catch_all_staff_position_id  (catch_all_staff_position_id)
#  index_conventions_on_default_layout_id            (default_layout_id)
#  index_conventions_on_domain                       (domain) UNIQUE
#  index_conventions_on_organization_id              (organization_id)
#  index_conventions_on_updated_by_id                (updated_by_id)
#  index_conventions_on_user_con_profile_form_id     (user_con_profile_form_id)
#
# Foreign Keys
#
#  fk_rails_...  (catch_all_staff_position_id => staff_positions.id)
#  fk_rails_...  (default_layout_id => cms_layouts.id)
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (root_page_id => pages.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (user_con_profile_form_id => forms.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Convention < ApplicationRecord
  TICKET_MODES = %w[disabled required_for_signup].freeze
  SITE_MODES = %w[convention single_event event_series].freeze
  SIGNUP_MODES = %w[self_service moderated].freeze
  EMAIL_MODES = %w[forward staff_emails_to_catch_all].freeze
  TIMEZONE_MODES = %w[convention_local user_local].freeze

  mount_uploader :favicon, FaviconUploader
  mount_uploader :open_graph_image, OpenGraphImageUploader
  has_one_attached :as_favicon
  has_one_attached :as_open_graph_image

  before_destroy :nullify_associated_content

  belongs_to :updated_by, class_name: 'User', optional: true
  belongs_to :organization, optional: true
  belongs_to :catch_all_staff_position, class_name: 'StaffPosition', optional: true

  has_many :cms_navigation_items, as: :parent, dependent: :destroy
  has_many :pages, as: :parent, dependent: :destroy
  has_many :cms_content_groups, as: :parent, dependent: :destroy
  has_many :cms_layouts, as: :parent, dependent: :destroy
  has_many :cms_partials, as: :parent, dependent: :destroy
  has_many :cms_files, as: :parent, dependent: :destroy
  has_many :cms_graphql_queries, as: :parent, dependent: :destroy
  has_many :cms_variables, as: :parent, dependent: :destroy
  has_many :coupons, dependent: :destroy
  has_many :departments, dependent: :destroy
  has_many :notification_templates, dependent: :destroy
  has_many :user_con_profiles, dependent: :destroy
  has_many :users, through: :user_con_profiles
  has_many :events, dependent: :destroy
  has_many :event_categories, dependent: :destroy
  has_many :runs, through: :events
  has_many :signups, through: :runs
  has_many :signup_changes, through: :runs
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
  validates :timezone_name, presence: true, unless: ->(convention) { convention.timezone_mode == 'user_local' }
  validates :show_schedule, inclusion: { in: %w[yes gms priv no] }
  validates :show_event_list, inclusion: { in: %w[yes gms priv no] }
  validates :ticket_mode, inclusion: { in: TICKET_MODES }, presence: true
  validates :signup_mode, inclusion: { in: SIGNUP_MODES }, presence: true
  validates :site_mode, inclusion: { in: SITE_MODES }, presence: true
  validates :email_mode, inclusion: { in: EMAIL_MODES }, presence: true
  validates :maximum_event_signups, presence: true
  validate :maximum_event_signups_must_cover_all_time
  validate :timezone_name_must_be_valid
  validate :site_mode_must_be_possible
  validate :show_event_list_must_be_at_least_as_permissive_as_show_schedule

  after_commit { update_active_storage_favicon if previous_changes.key?('favicon') }
  after_commit { update_active_storage_open_graph_image if previous_changes.key?('open_graph_image') }

  def update_active_storage_favicon
    as_favicon.purge if as_favicon.attached?
    sync_favicon if favicon.present?
  rescue StandardError => e
    Log.error(e)
  end

  def sync_favicon
    picture = favicon
    picture.cache_stored_file!
    file = StringIO.new(picture.sanitized_file.read)
    content_type = picture.content_type
    as_favicon.attach(io: file, content_type: content_type, filename: attributes['favicon'])
    as_favicon.attachment.save!
  end

  def update_active_storage_open_graph_image
    as_open_graph_image.purge if as_open_graph_image.attached?
    sync_open_graph_image if open_graph_image.present?
  rescue StandardError => e
    Log.error(e)
  end

  def sync_open_graph_image
    picture = open_graph_image
    picture.cache_stored_file!
    file = StringIO.new(picture.sanitized_file.read)
    content_type = picture.content_type
    as_open_graph_image.attach(io: file, content_type: content_type, filename: attributes['open_graph_image'])
    as_open_graph_image.attachment.save!
  end

  def started?
    starts_at && starts_at <= Time.zone.now
  end

  def ended?
    ends_at && ends_at <= Time.zone.now
  end

  def registrations_frozen?
    maximum_event_signups.value_at(Time.zone.now) == 'not_now'
  end

  def tickets_available_for_purchase?
    return false if ended?
    return false if ticket_mode == 'disabled'

    products.ticket_providing.available.any? { |product| product.pricing_structure.price(time: Time.zone.now) }
  end

  def length_seconds
    ends_at - starts_at
  end

  def load_cms_content_set(name)
    LoadCmsContentSetService.new(convention: self, content_set_name: name).call!
  end

  def timezone
    return nil if timezone_name.blank?
    ActiveSupport::TimeZone[timezone_name]
  end

  def bucket_metadata_from_events
    events.pluck(:registration_policy).flat_map { |p| p.buckets.flat_map(&:metadata) }.uniq
  end

  def to_liquid
    ConventionDrop.new(self)
  end

  def stripe_account
    return nil unless stripe_account_id
    @stripe_account ||= Stripe::Account.retrieve(stripe_account_id)
  end

  def timespan
    ScheduledValue::Timespan.new(start: starts_at, finish: ends_at)
  end

  private

  def maximum_event_signups_must_cover_all_time
    return if maximum_event_signups&.covers_all_time?

    errors.add(:maximum_event_signups, 'must cover all time')
  end

  def timezone_name_must_be_valid
    return if timezone_name.blank?

    tz = timezone
    unless tz
      errors.add(:timezone_name, 'must refer to a valid IANA timezone')
      return
    end

    return if tz.tzinfo.canonical_identifier == tz.tzinfo.identifier
    errors.add(
      :timezone_name,
      "must refer to a canonical IANA timezone \
(in this case, probably #{tz.tzinfo.canonical_identifier})"
    )
  end

  def site_mode_must_be_possible
    case site_mode
    when 'single_event'
      errors.add(:base, 'Single-event sites cannot sell tickets (yet)') unless ticket_mode == 'disabled'

      if events.count > 1
        errors.add(:site_mode, 'single_event is not valid because this convention has multiple events already')
      end
    when 'event_series'
      errors.add(:base, 'Event series sites cannot sell tickets (yet)') unless ticket_mode == 'disabled'
    end
  end

  SCHEDULE_RELEASE_PERMISSIVITY_ORDER = %w[no priv gms yes].freeze
  def show_event_list_must_be_at_least_as_permissive_as_show_schedule
    show_event_list_permissivity = SCHEDULE_RELEASE_PERMISSIVITY_ORDER.index(show_event_list)
    show_schedule_permissivity = SCHEDULE_RELEASE_PERMISSIVITY_ORDER.index(show_schedule)

    return if show_event_list_permissivity >= show_schedule_permissivity
    errors.add(:show_event_list, 'must be at least as permissive as show_schedule')
  end

  def nullify_associated_content
    update!(root_page: nil, default_layout: nil, user_con_profile_form: nil)
  end
end
