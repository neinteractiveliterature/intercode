class UserConProfileDrop < Liquid::Drop
  extend ActionView::Helpers::SanitizeHelper::ClassMethods
  include BioHelper

  attr_reader :user_con_profile
  delegate :email, :first_name, :last_name, :name, :name_inverted, :nickname, :ticket, to: :user_con_profile

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
    format_bio(user_con_profile.bio)
  end
end