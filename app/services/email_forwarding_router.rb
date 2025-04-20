class EmailForwardingRouter
  class Mapping
    attr_reader :inbound_domain, :inbound_local, :destination_addresses

    def self.from_address(address, destination_addresses: [])
      return nil if address.blank?

      parsed_address = EmailRoute.parse_address(address)
      return nil unless parsed_address

      new(
        inbound_domain: EmailRoute.normalize_domain(parsed_address.domain),
        inbound_local: EmailRoute.normalize_local(parsed_address.local),
        destination_addresses: destination_addresses
      )
    end

    def initialize(inbound_domain:, inbound_local:, destination_addresses:)
      @inbound_domain = EmailRoute.normalize_domain(inbound_domain)
      @inbound_local = EmailRoute.normalize_local(inbound_local)
      @destination_addresses = destination_addresses.map { |address| EmailRoute.normalize_address(address) }.uniq
    end

    def inbound_email
      "#{inbound_local}@#{inbound_domain}"
    end

    def catch_all?
      inbound_local.nil?
    end
  end

  class MappingSet
    delegate :values, to: :@mappings

    def initialize(mappings = [])
      @mappings = {}
      mappings.each { |mapping| self << mapping }
    end

    def <<(mapping)
      return if mapping.nil?

      if @mappings[mapping.inbound_email]
        @mappings[mapping.inbound_email] = Mapping.new(
          inbound_domain: mapping.inbound_domain,
          inbound_local: mapping.inbound_local,
          destination_addresses: @mappings[mapping.inbound_email].destination_addresses + mapping.destination_addresses
        )
      else
        @mappings[mapping.inbound_email] = mapping
      end
    end

    def merge(other_mapping_set)
      MappingSet.new(@mappings.values + other_mapping_set.values)
    end

    def by_domain
      @mappings.values.group_by(&:inbound_domain)
    end
  end

  def self.all_staff_position_mappings
    MappingSet.new(
      StaffPosition
        .includes(user_con_profiles: :user)
        .joins(:convention)
        .where("staff_positions.email ilike '%@' || conventions.domain")
        .map do |sp|
          Mapping.from_address(sp.email, destination_addresses: sp.user_con_profiles.map(&:email) + sp.cc_addresses)
        end
    )
  end

  def self.all_catch_all_mappings
    MappingSet.new(
      Convention
        .where.not(catch_all_staff_position_id: nil)
        .filter_map do |convention|
          sp = convention.catch_all_staff_position
          destination_addresses = sp.user_con_profiles.map(&:email) + sp.cc_addresses
          next if destination_addresses.empty?

          Mapping.new(inbound_domain: convention.domain, inbound_local: nil, destination_addresses:)
        end
    )
  end

  def self.all_team_member_mappings
    MappingSet.new(
      Event
        .includes(:convention, team_members: { user_con_profile: :user })
        .joins(:convention)
        .where.not(conventions: { event_mailing_list_domain: nil })
        .where.not(events: { team_mailing_list_name: nil })
        .map do |event|
          Mapping.new(
            inbound_domain: event.convention.event_mailing_list_domain,
            inbound_local: event.team_mailing_list_name,
            destination_addresses: event.team_members.map { |tm| tm.user_con_profile.email }
          )
        end
    )
  end

  def self.all_email_route_mappings
    MappingSet.new(
      EmailRoute
        .pluck(:receiver_address, :forward_addresses)
        .filter_map do |receiver_address, forward_addresses|
          if forward_addresses.blank?
            nil
          else
            Mapping.from_address(receiver_address, destination_addresses: forward_addresses)
          end
        end
    )
  end

  def self.all_mappings
    all_staff_position_mappings
      .merge(all_catch_all_mappings)
      .merge(all_team_member_mappings)
      .merge(all_email_route_mappings)
  end

  def self.all_inbound_addresses
    all_mappings.keys
  end

  def self.all_destination_addresses
    all_mappings.values.flatten.uniq
  end

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
    ].compact.uniq
  end

  def staff_positions_for_recipient
    @staff_positions_for_recipient ||=
      if convention_by_domain
        if convention_by_domain.email_mode == "staff_emails_to_catch_all"
          [convention_by_domain.catch_all_staff_position].compact
        else
          matched_positions =
            convention_by_domain
              .staff_positions
              .includes(user_con_profiles: :user)
              .select do |sp|
                full_email_aliases = sp.email_aliases.map { |ea| "#{ea}@#{convention_by_domain.domain}" }
                destinations = [sp.email, *full_email_aliases].map { |dest| EmailRoute.normalize_address(dest) }
                destinations.include?(address)
              end

          matched_positions.any? ? matched_positions : [convention_by_domain.catch_all_staff_position].compact
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
            full_alias = "#{event.team_mailing_list_name}@#{convention_by_events_domain.event_mailing_list_domain}"
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
