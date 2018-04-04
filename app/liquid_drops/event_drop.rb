class EventDrop < Liquid::Drop
  include Rails.application.routes.url_helpers

  attr_reader :event
  delegate :id, :title, :team_member_name, :event_proposal, :author, :organization,
    :email, to: :event

  def initialize(event)
    @event = event
  end

  def team_member_user_con_profiles
    event.team_members.map(&:user_con_profile)
  end

  def url
    event_path(event)
  end

  def homepage_url
    event.url
  end

  %w[
    description
    content_warnings
    age_restrictions
    participant_communications
    short_blurb
  ].each do |field|
    define_method field do
      markdown = event.public_send(field)
      return nil unless markdown
      MarkdownPresenter.new('').render(markdown)
    end
  end
end
