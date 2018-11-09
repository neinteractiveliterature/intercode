class SyncTeamMailingListService < CivilService::Service
  include Concerns::SkippableAdvisoryLock

  attr_reader :event

  def initialize(event:)
    @event = event
  end

  private

  def inner_call
    unless event.team_mailing_list_name.present? && convention.event_mailing_list_domain.present?
      return success
    end

    with_advisory_lock_unless_skip_locking("sync_team_mailing_list_event_#{event.id}") do
      if team_member_user_con_profiles.any?
        create_or_update_route
      else
        delete_route_if_exists
      end
    end

    success
  end

  def create_or_update_route
    if applicable_routes.size > 0
      keep_route, *delete_routes = applicable_routes
      mailgun.put("/routes/#{keep_route['id']}", route_properties)

      delete_routes.each do |route|
        mailgun.delete("/routes/#{route['id']}")
      end
    else
      mailgun.post('routes', route_properties)
    end
  end

  def delete_route_if_exists
    applicable_routes.each do |route|
      mailgun.delete("/routes/#{route['id']}")
    end
  end

  def convention
    event.convention
  end

  def team_member_user_con_profiles
    @team_member_user_con_profiles ||= event.team_members.includes(user_con_profile: :user)
      .map(&:user_con_profile)
  end

  def route_expression
    "match_recipient(\"#{recipient_email}\")"
  end

  def route_properties
    @route_properties ||= {
      expression: route_expression,
      action: team_member_user_con_profiles.map do |user_con_profile|
        "forward(\"#{user_con_profile.email}\")"
      end,
      description: "#{event.title} Mailing List"
    }
  end

  def recipient_email
    event.team_mailing_list_email
  end

  def applicable_routes
    @applicable_routes ||= begin
      matching_routes = all_routes.select do |route|
        route['expression'] == route_expression
      end

      matching_routes.sort_by { |route| route['id'] }
    end
  end

  def all_routes
    @all_routes ||= begin
      total_routes = nil
      routes = []

      while total_routes.nil? || routes.size < total_routes
        response = mailgun.get('/routes', skip: routes.size).to_h
        total_routes ||= response['total_count']
        routes.concat(response['items'])
      end

      routes
    end
  end

  def mailgun
    return unless ENV['MAILGUN_PRIVATE_KEY']
    @mailgun ||= Mailgun::Client.new(ENV['MAILGUN_PRIVATE_KEY'])
  end
end
