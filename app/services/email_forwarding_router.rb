class EmailForwardingRouter
  attr_reader :address

  def initialize(address)
    @address = EmailRoute.normalize_address(address)
  end

  def convention_by_domain
    return @convention_by_domain if defined?(@convention_by_domain)
    @convention_by_domain ||= Convention.find_by(domain: Mail::Address.new(address).domain)
  end

  def convention_by_events_domain
    return @convention_by_events_domain if defined?(@convention_by_events_domain)
    @convention_by_events_domain ||= Convention.find_by(event_mailing_list_domain: Mail::Address.new(address).domain)
  end

  def forward_addresses
    [
      *staff_positions_for_recipient.flat_map { |sp| sp.user_con_profiles.map(&:email) + sp.cc_addresses },
      *team_members_for_recipient.flat_map { |tm| tm.user_con_profile.email },
      *email_routes_for_recipient.flat_map(&:forward_addresses)
    ]
  end

  def staff_positions_for_recipient
    @staff_positions_for_recipient ||=
      if convention_by_domain
        if convention_by_domain.email_mode == "staff_emails_to_catch_all"
          [convention.catch_all_staff_position].compact
        else
          matched_positions =
            convention
              .staff_positions
              .includes(user_con_profiles: :user)
              .select do |sp|
                full_email_aliases = sp.email_aliases.map { |ea| "#{ea}@#{convention.domain}" }
                destinations = [sp.email, *full_email_aliases].map { |dest| EmailRoute.normalize_address(dest) }
                destinations.include?(address)
              end

          matched_positions.any? ? matched_positions : [convention.catch_all_staff_position].compact
        end
      else
        []
      end
  end

  def team_members_for_recipient
    @team_members_for_recipient ||=
      if convention_by_events_domain
        events =
          convention_by_events_domain.events.select do |event|
            next if event.team_mailing_list_name.blank?
            full_alias = "#{event.team_mailing_list_name}@#{convention.event_mailing_list_domain}"
            EmailRoute.normalize_address(full_alias) == address
          end
        TeamMember.where(event_id: events.map(&:id)).includes(user_con_profile: :user).to_a
      else
        []
      end
  end

  def email_routes_for_recipient
    @email_routes_for_recipient ||= EmailRoute.where(receiver_address: address)
  end
end
