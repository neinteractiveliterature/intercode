# A profile for a user attending a convention.  This is the main object used for all user-specific
# data in a convention, rather than User, which is just the sitewide account data shared between
# all conventions.
class UserConProfileDrop < Liquid::Drop
  extend ActionView::Helpers::SanitizeHelper::ClassMethods
  include Rails.application.routes.url_helpers

  # @api
  attr_reader :user_con_profile

  # @!method bio_name
  #   @return [String] The name used for the user's bio, which will either include a nickname or not
  #                    depending on their preference
  # @!method email
  #   @return [String] The user's email address
  # @!method first_name
  #   @return [String] The user's first name
  # @!method gravatar_url
  #   @return [String] The URL of the user's Gravatar
  # @!method id
  #   @return [Integer] The numeric database ID of the user profile
  # @!method last_name
  #   @return [String] The user's last name
  # @!method name
  #   @return [String] The user's name, including nickname if present
  # @!method name_inverted
  #   @return [String] The user's name in "Last, First" format
  # @!method nickname
  #   @return [String] The nickname the user entered on their profile
  # @!method name_without_nickname
  #   @return [String] The user's name, not including nickname
  # @!method ticket
  #   @return [TicketDrop] The user's convention ticket, if present
  # @!method ical_secret
  #   @return [String] The user's iCal secret for this convention (used in the
  #                    {% add_to_calendar_dropdown %} tag)
  delegate :bio_name, :email, :first_name, :gravatar_url, :id, :last_name,
    :name, :name_inverted, :nickname, :name_without_nickname, :ticket, :ical_secret,
    to: :user_con_profile

  # @api
  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  # @return [Array<EventDrop>] All the active events at this convention for which this user is a
  #                            team member
  def team_member_events
    user_con_profile.team_members.includes(:event).where(events: { status: 'active' }).map(&:event)
  end

  # @return [Array<SignupDrop>] All the user's signups, excluding withdrawn events
  def signups
    user_con_profile.signups.where.not(state: 'withdrawn')
      .includes(
        event: :event_category,
        run: {
          rooms: nil,
          event: { team_members: :user_con_profile }
        }
      ).to_a
  end

  # @return [String] The user's bio, as HTML
  def bio
    markdown_presenter.render(user_con_profile.bio)
  end

  # @return [Array<String>] The user's privileges for this convention
  # @deprecated Privileges have been removed in favor of permissions and staff positions.  This
  #   method still exists for compatibility reasons but will return either an empty array or an
  #   array containing only the string 'site_admin'.
  def privileges
    user_con_profile.privileges.map(&:titleize)
  end

  # @return [Array<StaffPosition>] All the staff positions this user holds at this convention
  def staff_positions
    user_con_profile.staff_positions.to_a
  end

  # @return [Array<StaffPosition>] All the event proposals this user submitted for this convention
  def event_proposals
    user_con_profile.event_proposals.to_a
  end

  # @return [String] A webcal:// URL for the user's personal schedule for this convention.  This URL
  #                  is considered secret and should only be given to that user.
  def schedule_calendar_url
    user_schedule_url(
      user_con_profile.ical_secret,
      host: user_con_profile.convention.domain,
      protocol: 'webcal'
    )
  end

  private

  # @api
  def markdown_presenter
    @markdown_presenter ||= MarkdownPresenter.new('No bio provided')
  end
end
