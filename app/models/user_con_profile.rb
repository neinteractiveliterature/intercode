# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: user_con_profiles
#
#  id                           :bigint           not null, primary key
#  accepted_clickwrap_agreement :boolean          default(FALSE), not null
#  additional_info              :jsonb
#  address                      :text
#  allow_sms                    :boolean          default(TRUE), not null
#  best_call_time               :string
#  bio                          :text
#  birth_date                   :date
#  city                         :string
#  country                      :string
#  day_phone                    :string
#  evening_phone                :string
#  first_name                   :string           not null
#  gender                       :string
#  gravatar_enabled             :boolean          default(FALSE), not null
#  ical_secret                  :text             not null
#  last_name                    :string           not null
#  mobile_phone                 :string
#  needs_update                 :boolean          default(FALSE), not null
#  nickname                     :string
#  preferred_contact            :string
#  receive_whos_free_emails     :boolean          default(TRUE), not null
#  show_nickname_in_bio         :boolean
#  state                        :string
#  zipcode                      :string
#  created_at                   :datetime
#  updated_at                   :datetime
#  convention_id                :bigint           not null
#  user_id                      :bigint           not null
#
# Indexes
#
#  index_user_con_profiles_on_convention_id_and_user_id  (convention_id,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (user_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class UserConProfile < ApplicationRecord
  include PgSearch::Model
  include FormResponse
  include Names

  belongs_to :convention
  belongs_to :user
  has_one :ticket, dependent: :destroy
  has_many :team_members, dependent: :destroy
  has_many :signups, dependent: :destroy
  has_many :signup_requests, dependent: :destroy
  has_many :event_proposals, foreign_key: :owner_id, dependent: :nullify
  has_many :event_ratings, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_and_belongs_to_many :staff_positions
  has_many :permissions, through: :staff_positions

  delegate :email, to: :user, allow_nil: true

  validates :name, presence: true
  validates :preferred_contact, inclusion: { in: %w[email day_phone evening_phone], allow_blank: true }

  before_create :generate_ical_secret
  after_commit :send_user_activity_alerts, on: :create
  after_commit :touch_team_member_events, on: %i[create update]

  scope :is_team_member, -> { joins(:team_members).distinct }

  scope :has_staff_position, -> { joins(:staff_positions).distinct }

  scope :can_have_bio, -> { where(id: has_staff_position.select(:id)).or(where(id: is_team_member.select(:id))) }

  multisearchable(
    against: %i[name_without_nickname nickname email],
    additional_attributes: ->(user_con_profile) { { convention_id: user_con_profile.convention_id } }
  )

  register_form_response_attrs :first_name,
                               :last_name,
                               :nickname,
                               :birth_date,
                               :address,
                               :city,
                               :state,
                               :zipcode,
                               :country,
                               :mobile_phone,
                               :allow_sms,
                               :day_phone,
                               :evening_phone,
                               :best_call_time,
                               :preferred_contact,
                               :receive_whos_free_emails

  def paid?
    ticket
  end

  def unpaid?
    !ticket
  end

  def age_as_of_convention
    age_as_of convention.starts_at
  end

  # More or less copied from:
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  def age_as_of(date)
    return unless birth_date

    on_or_after_birthday =
      (date.month > birth_date.month || (date.month == birth_date.month && date.day >= birth_date.day))

    date.year - birth_date.year - (on_or_after_birthday ? 0 : 1)
  end

  def age
    age_as_of Time.zone.today
  end

  def full_address
    [address, city_state_zip, country].reject(&:blank?).join("\n")
  end

  def city_state_zip
    [city_state, zipcode].reject(&:blank?).join(' ')
  end

  def city_state
    [city, state].reject(&:blank?).join(', ')
  end

  # @deprecated
  delegate :privileges, to: :user

  def is_team_member? # rubocop:disable Naming/PredicateName
    return team_members.size.positive? if team_members.loaded?
    self.class.is_team_member.where(id: id).any?
  end

  def can_have_bio?
    if team_members.loaded? && staff_positions.loaded?
      return team_members.size.positive? || staff_positions.size.positive?
    end

    team_members.any? || staff_positions.any?
  end

  def email=(email)
    self.user = User.find_by(email: email)
    self.first_name ||= user.first_name
    self.last_name ||= user.last_name
  end

  def preferred_contact_humanized
    case preferred_contact
    when 'day_phone'
      'Daytime phone'
    when 'evening_phone'
      'Evening phone'
    when 'email'
      'Email'
    else
      preferred_contact.try(:humanize)
    end
  end

  def to_liquid
    UserConProfileDrop.new(self)
  end

  def name_without_nickname
    [first_name, last_name].compact.join(' ')
  end

  def name_parts
    [first_name, nickname.present? ? "\"#{nickname}\"" : nil, last_name]
  end

  def bio_name
    [first_name, show_nickname_in_bio && nickname.present? ? "\"#{nickname}\"" : nil, last_name].compact.join(' ')
  end

  def gravatar_url
    if gravatar_enabled?
      "https://gravatar.com/avatar/#{Digest::MD5.hexdigest(email.strip.downcase)}"
    else
      "https://gravatar.com/avatar/#{Digest::MD5.hexdigest('badrequest')}"
    end
  end

  def order_summary
    OrderSummaryPresenter.preload_associations([self])
    OrderSummaryPresenter.new(user_con_profile: self).order_summary
  end

  def current_pending_order
    return @current_pending_order if defined?(@current_pending_order)
    @current_pending_order ||=
      begin
        pending_orders = orders.pending.to_a

        if pending_orders.empty?
          nil
        elsif pending_orders.size > 1
          # combine orders into one cart
          first_order = pending_orders.pop
          OrderEntry.where(order_id: pending_orders.map(&:id)).update_all(order_id: first_order.id)
          pending_orders.destroy_all
          first_order.reload
        else
          pending_orders.first
        end
      end
  end

  private

  def send_user_activity_alerts
    SendUserActivityAlertsJob.perform_later(self, 'user_con_profile_create')
  end

  def generate_ical_secret
    self.ical_secret ||= Devise.friendly_token
  end

  def touch_team_member_events
    Event.where(id: team_members.select(:event_id)).update_all(updated_at: Time.zone.now)
  end
end
