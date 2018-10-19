class SyncTeamMailingListService < CivilService::Service
  attr_reader :event

  def initialize(event:)
    @event = event
  end

  private

  def inner_call
    unless event.team_mailing_list_name.present? && convention.event_mailing_list_domain.present?
      return success
    end

    if applicable_routes.size > 0
      keep_route, *delete_routes = applicable_routes
      mailgun.put("/routes/#{keep_route['id']}", route_properties)

      delete_routes.each do |route|
        mailgun.delete("/routes/#{route['id']}")
      end
    else
      mailgun.post('routes', route_properties)
    end

    success
  end

  def convention
    event.convention
  end

  def route_expression
    "match_recipient(\"#{recipient_email}\")"
  end

  def route_properties
    @route_properties ||= {
      expression: route_expression,
      action: event.team_members.includes(user_con_profile: :user).map do |team_member|
        "forward(\"#{team_member.user_con_profile.email}\")"
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
