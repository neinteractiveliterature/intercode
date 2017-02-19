class UserConProfileDrop < Liquid::Drop
  attr_reader :user_con_profile
  delegate :email, :first_name, :last_name, :nickname, :ticket, to: :user_con_profile

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
  end

  def team_member_events
    user_con_profile.team_members.map(&:event)
  end

  def signups
    user_con_profile.signups.includes(run: { event: :team_members }).reject(&:withdrawn?).to_a
  end
end