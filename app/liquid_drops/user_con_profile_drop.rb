class UserConProfileDrop < Liquid::Drop
  extend ActionView::Helpers::SanitizeHelper::ClassMethods

  attr_reader :user_con_profile
  delegate :bio_name, :email, :first_name, :gravatar_url, :id, :last_name,
    :name, :name_inverted, :nickname, :name_without_nickname, :ticket,
    to: :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def team_member_events
    user_con_profile.team_members.map(&:event)
  end

  def signups
    user_con_profile.signups.includes(run: { event: :team_members }).reject(&:withdrawn?).to_a
  end

  def bio
    markdown_presenter.render(user_con_profile.bio)
  end

  def privileges
    user_con_profile.privileges.map(&:titleize)
  end

  def staff_positions
    user_con_profile.staff_positions.to_a
  end

  def event_proposals
    user_con_profile.event_proposals.to_a
  end

  private

  def markdown_presenter
    @markdown_presenter ||= MarkdownPresenter.new('No bio provided')
  end
end
