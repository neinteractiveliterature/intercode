# frozen_string_literal: true

require "base64"

# Reads a convention export JSON hash (as produced by intercode-import) and creates all records
# in the database using ActiveRecord. Intended for one-shot historical data migrations.
#
# Usage:
#   data = JSON.parse(File.read('convention-export.json'), symbolize_names: true)
#   ImportConventionDataService.new(data: data, organization: org).call!
# rubocop:disable Metrics/ClassLength
class ImportConventionDataService < CivilService::Service
  attr_reader :data, :organization

  validates_presence_of :data

  def initialize(data:, organization: nil)
    super()
    @data = data
    @organization = organization
  end

  private

  def inner_call
    ActiveRecord::Base.transaction do
      convention = build_convention
      load_cms_content_set(convention)
      import_event_categories(convention)
      import_cms_content(convention)
      import_ticket_types(convention)
      import_rooms(convention)
      staff_position_map = import_staff_positions(convention)
      user_map = import_users
      user_con_profile_map = import_user_con_profiles(convention, user_map)
      assign_staff_position_users(staff_position_map, user_con_profile_map)
      event_map = import_events(convention)
      import_event_proposals(convention, event_map, user_con_profile_map)
      run_map = import_runs(convention, event_map)
      import_team_members(event_map, user_con_profile_map)
      import_signups(run_map, user_con_profile_map)
      import_tickets(convention, event_map, user_con_profile_map)
      import_store(convention, user_con_profile_map)
    end
    success
  end

  def build_convention # rubocop:disable Metrics/MethodLength
    con = data[:convention]
    domain = con[:domain]

    convention =
      Convention.new(
        organization: organization,
        name: con[:name],
        domain: domain,
        timezone_name: con[:timezone_name],
        timezone_mode: "convention_local",
        ticket_mode: con[:ticket_mode] || "disabled",
        site_mode: con[:site_mode] || "convention",
        signup_mode: "self_service",
        signup_automation_mode: "none",
        starts_at: con[:starts_at],
        ends_at: con[:ends_at],
        show_schedule: con[:show_schedule] || "no",
        show_event_list: con[:show_event_list] || "no",
        maximum_tickets: con[:maximum_tickets],
        email_from: "noreply@#{domain}",
        language: "en"
      )
    convention.save!

    # Replace the auto-created 'not_yet' signup round with the imported schedule
    convention.signup_rounds.delete_all
    import_signup_rounds(convention, con[:maximum_event_signups])

    convention
  end

  def import_signup_rounds(convention, schedule)
    return unless schedule

    timespans =
      (schedule[:always] ? [{ start: nil, finish: nil, value: schedule[:always] }] : schedule[:timespans] || [])

    timespans.each do |ts|
      convention.signup_rounds.create!(
        start: ts[:start] ? Time.zone.parse(ts[:start].to_s) : nil,
        maximum_event_signups: ts[:value],
        executed_at: Time.current
      )
    end
  end

  def load_cms_content_set(convention)
    content_set_name = data[:cms_content_set]
    return if content_set_name.blank?
    LoadCmsContentSetService.new(convention: convention, content_set_name: content_set_name).call!
    convention.reload
  end

  def import_cms_content(convention)
    layout_map = import_cms_layouts(convention)
    import_cms_files(convention)
    import_cms_pages(convention, layout_map)
    import_cms_partials(convention)
    import_cms_navigation_items(convention)

    con = data[:convention]
    updates = {}
    updates[:default_layout] = layout_map[con[:default_layout_name]] if con[:default_layout_name].present?
    updates[:root_page] = convention.pages.find_by(slug: con[:root_page_slug]) if con[:root_page_slug].present?
    convention.update!(updates) if updates.any?
  end

  def import_cms_layouts(convention)
    (data[:cms_layouts] || []).each_with_object({}) do |layout_data, map|
      layout = convention.cms_layouts.find_or_initialize_by(name: layout_data[:name])
      layout.content = layout_data[:content]
      layout.save!
      map[layout_data[:name]] = layout
    end
  end

  def import_cms_files(convention)
    existing = Set.new(convention.cms_files.joins(file_attachment: :blob).pluck("lower(active_storage_blobs.filename)"))

    (data[:cms_files] || []).each do |file_data|
      next if existing.include?(file_data[:filename].downcase)

      cms_file = convention.cms_files.new
      cms_file.file.attach(
        io: StringIO.new(Base64.decode64(file_data[:content_base64])),
        filename: file_data[:filename],
        content_type: file_data[:content_type]
      )
      cms_file.save!
    end
  end

  def import_cms_pages(convention, layout_map = {})
    (data[:cms_pages] || []).each do |page_data|
      page = convention.pages.find_or_initialize_by(slug: page_data[:slug])
      page.assign_attributes(name: page_data[:name], content: page_data[:content])
      page.cms_layout = layout_map[page_data[:cms_layout_name]] if page_data[:cms_layout_name].present?
      page.save!
    end
  end

  def import_cms_partials(convention)
    (data[:cms_partials] || []).each do |partial_data|
      partial = convention.cms_partials.find_or_initialize_by(name: partial_data[:name])
      partial.content = partial_data[:content]
      partial.save!
    end
  end

  def import_cms_navigation_items(convention)
    nav_data = data[:cms_navigation_items] || []
    return if nav_data.empty?

    convention.cms_navigation_items.delete_all
    nav_data.each do |section_data|
      section = convention.cms_navigation_items.create!(title: section_data[:title])
      (section_data[:links] || []).each do |link_data|
        page = convention.pages.find_by(name: link_data[:page_name])
        next unless page

        convention.cms_navigation_items.create!(title: link_data[:title], page: page, navigation_section: section)
      end
    end
  end

  def import_event_categories(convention)
    categories = data.dig(:convention, :event_categories) || []
    categories.each do |cat|
      event_form = convention.forms.find_by(title: cat[:event_form_title])
      event_proposal_form =
        (convention.forms.find_by(title: cat[:event_proposal_form_title]) if cat[:event_proposal_form_title].present?)

      convention.event_categories.create!(
        name: cat[:name],
        team_member_name: cat[:team_member_name],
        scheduling_ui: cat[:scheduling_ui],
        default_color: cat[:default_color] || "#d4f5fa",
        full_color: cat[:full_color] || "rgba(23, 162, 184, 0.7)",
        signed_up_color: cat[:signed_up_color] || "#17a2b8",
        event_form: event_form,
        event_proposal_form: event_proposal_form
      )
    end
  end

  def import_ticket_types(convention)
    ticket_types = data.dig(:convention, :ticket_types) || []
    ticket_types.each do |tt|
      convention.ticket_types.create!(
        name: tt[:name],
        description: tt[:description],
        allows_event_signups: tt.key?(:allows_event_signups) ? tt[:allows_event_signups] : true,
        counts_towards_convention_maximum:
          tt.key?(:counts_towards_convention_maximum) ? tt[:counts_towards_convention_maximum] : true,
        maximum_event_provided_tickets: tt[:maximum_event_provided_tickets] || 0
      )
    end
  end

  def import_rooms(convention)
    rooms = data.dig(:convention, :rooms) || []
    rooms.each { |r| convention.rooms.create!(name: r[:name]) }
  end

  def import_staff_positions(convention)
    positions = data.dig(:convention, :staff_positions) || []
    positions.each_with_object({}) do |pos, map|
      sp =
        convention.staff_positions.create!(
          name: pos[:name],
          email: pos[:email],
          visible: pos.key?(:visible) ? pos[:visible] : false
        )
      Permission.grant(sp, convention, *pos[:permissions]) if pos[:permissions]&.any?
      map[pos[:name]] = sp
    end
  end

  def assign_staff_position_users(staff_position_map, user_con_profile_map)
    positions = data.dig(:convention, :staff_positions) || []
    positions.each do |pos|
      sp = staff_position_map[pos[:name]]
      next unless sp

      (pos[:user_emails] || []).each do |email|
        profile = user_con_profile_map[email.downcase]
        next unless profile
        sp.user_con_profiles << profile
      end
    end
  end

  def import_users
    (data[:users] || []).each_with_object({}) do |u, map|
      email = u[:email].downcase
      user = User.find_or_initialize_by(email: email)
      user.first_name = u[:first_name]
      user.last_name = u[:last_name]
      apply_password(user, u)
      user.save!
      map[email] = user
    end
  end

  def apply_password(user, user_data)
    # Always skip Devise's virtual-attribute password validation since we're setting
    # encrypted_password / legacy columns directly from imported hashes.
    user.blank_password!
    hash = user_data[:password_hash]
    return if hash.nil?

    case user_data[:password_hash_type]
    when "bcrypt_wrapped_md5"
      user.legacy_password_md5 = hash
    when "bcrypt_wrapped_sha1"
      user.legacy_password_sha1 = hash
      user.legacy_password_sha1_salt = user_data[:password_sha1_salt]
    else # 'bcrypt' or nil
      user.encrypted_password = hash
    end
  end

  def import_user_con_profiles(convention, user_map)
    (data[:user_con_profiles] || []).each_with_object({}) do |prof, map|
      email = prof[:user_email].downcase
      user = user_map[email]
      next unless user

      profile = convention.user_con_profiles.new(user: user)
      profile.assign_form_response_attributes(profile_form_response_attrs(prof))
      profile.save!
      map[email] = profile
    end
  end

  def profile_form_response_attrs(prof)
    {
      first_name: prof[:first_name].to_s,
      last_name: prof[:last_name].to_s,
      nickname: prof[:nickname],
      bio: prof[:bio],
      show_nickname_in_bio: prof[:show_nickname_in_bio],
      receive_whos_free_emails: prof[:receive_whos_free_emails],
      phone: prof[:phone],
      day_phone: prof[:day_phone],
      evening_phone: prof[:evening_phone],
      best_call_time: prof[:best_call_time],
      preferred_contact: prof[:preferred_contact],
      address: prof[:address],
      city: prof[:city],
      state: prof[:state],
      zipcode: prof[:zipcode],
      country: prof[:country],
      gender: prof[:gender],
      birth_date: prof[:birth_date]
    }.merge(prof[:additional_info] || {}).compact
  end

  def import_events(convention) # rubocop:disable Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    category_map = convention.event_categories.index_by(&:name)

    (data[:events] || []).each_with_object({}) do |e, map|
      category = category_map[e[:event_category_name]]
      next unless category

      event =
        convention.events.new(
          title: e[:title],
          event_category: category,
          status: e[:status] || "active",
          author: e[:author],
          email: e[:email],
          organization: e[:organization],
          url: e[:url],
          length_seconds: e[:length_seconds] || 3600,
          can_play_concurrently: e[:can_play_concurrently] || false,
          con_mail_destination: e[:con_mail_destination] || "gms",
          description: e[:description],
          short_blurb: e[:short_blurb],
          participant_communications: e[:participant_communications],
          registration_policy: build_registration_policy(e[:registration_policy])
        )
      event.assign_form_response_attributes(e[:form_response_attributes] || {})
      event.save!
      map[e[:id]] = event
    end
  end

  def import_event_proposals(convention, event_map, user_con_profile_map) # rubocop:disable Metrics/CyclomaticComplexity
    category_map = convention.event_categories.index_by(&:name)

    (data[:event_proposals] || []).each do |ep|
      category = category_map[ep[:event_category_name]]
      profile = user_con_profile_map[ep[:owner_email].downcase]
      next unless category && profile

      proposal = convention.event_proposals.new(event_category: category, owner: profile, status: ep[:status])
      proposal.event = event_map[ep[:event_id]] if ep[:event_id] && event_map[ep[:event_id]]
      proposal.assign_form_response_attributes(ep[:form_response_attributes] || {})
      proposal.save!
    end
  end

  def import_runs(convention, event_map)
    room_map = convention.rooms.index_by(&:name)
    run_indexes = Hash.new(-1)

    (data[:runs] || []).each_with_object({}) do |r, map|
      event = event_map[r[:event_id]]
      next unless event

      run_indexes[r[:event_id]] += 1
      index = run_indexes[r[:event_id]]

      rooms = (r[:room_names] || []).filter_map { |name| room_map[name] }
      run =
        event.runs.create!(
          starts_at: r[:starts_at],
          title_suffix: r[:title_suffix],
          schedule_note: r[:schedule_note],
          rooms: rooms
        )
      map[[r[:event_id], index]] = run
    end
  end

  def import_team_members(event_map, user_con_profile_map) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    (data[:team_members] || []).each do |tm|
      event = event_map[tm[:event_id]]
      profile = user_con_profile_map[tm[:user_email].downcase]
      next unless event && profile

      event.team_members.create!(
        user_con_profile: profile,
        display: tm.key?(:display) ? tm[:display] : true,
        show_email: tm.key?(:show_email) ? tm[:show_email] : false,
        receive_con_email: tm.key?(:receive_con_email) ? tm[:receive_con_email] : true,
        receive_signup_email: tm[:receive_signup_email] || "no"
      )
    end
  end

  def import_signups(run_map, user_con_profile_map)
    (data[:signups] || []).each do |s|
      run = run_map[[s[:event_id], s[:run_index]]]
      profile = user_con_profile_map[s[:user_email].downcase]
      next unless run && profile

      run.signups.create!(
        user_con_profile: profile,
        state: s[:state],
        bucket_key: s[:bucket_key],
        requested_bucket_key: s[:requested_bucket_key],
        counted: s.key?(:counted) ? s[:counted] : true
      )
    end
  end

  def import_tickets(convention, event_map, user_con_profile_map)
    ticket_type_map = convention.ticket_types.index_by(&:name)

    (data[:tickets] || []).each do |t|
      profile = user_con_profile_map[t[:user_email].downcase]
      ticket_type = ticket_type_map[t[:ticket_type_name]]
      next unless profile && ticket_type

      Ticket.create!(
        user_con_profile: profile,
        ticket_type: ticket_type,
        provided_by_event: t[:provided_by_event_id] ? event_map[t[:provided_by_event_id]] : nil
      )
    end
  end

  def import_store(convention, user_con_profile_map)
    product_map = import_store_items(convention)
    import_store_orders(convention, product_map, user_con_profile_map)
  end

  def import_store_items(convention)
    ticket_type_map = convention.ticket_types.index_by(&:name)

    (data[:store_items] || []).each_with_object({}) do |item, map|
      price_money = item[:price] ? money_value(item[:price]) : Money.new(0, Money.default_currency)
      pricing_structure = PricingStructure.new(pricing_strategy: "fixed", value: price_money)
      payment_options = price_money.positive? ? ["stripe"] : []

      product =
        convention.products.create!(
          name: item[:name],
          description: item[:description],
          available: item.key?(:available) ? item[:available] : false,
          pricing_structure: pricing_structure,
          payment_options: payment_options,
          provides_ticket_type:
            item[:provides_ticket_type_name] ? ticket_type_map[item[:provides_ticket_type_name]] : nil
        )
      map[item[:name]] = product
    end
  end

  def import_store_orders(_convention, product_map, user_con_profile_map)
    (data[:store_orders] || []).each do |order_data|
      profile = user_con_profile_map[order_data[:user_email].downcase]
      next unless profile

      order =
        profile.orders.create!(
          status: order_data[:status],
          payment_amount: money_value(order_data[:payment_amount]),
          payment_note: order_data[:payment_note]
        )

      (order_data[:entries] || []).each do |entry|
        product = product_map[entry[:store_item_name]]
        next unless product
        order.order_entries.create!(
          product: product,
          quantity: entry[:quantity],
          price_per_item: money_value(entry[:price_per_item])
        )
      end
    end
  end

  def build_registration_policy(policy_data)
    return RegistrationPolicy.unlimited unless policy_data

    RegistrationPolicy.new(
      buckets: (policy_data[:buckets] || []).map { |b| RegistrationPolicy::Bucket.new(**b.transform_keys(&:to_sym)) },
      prevent_no_preference_signups: policy_data[:prevent_no_preference_signups] || false
    )
  end

  def money_value(money_data)
    return nil unless money_data
    Money.new(money_data[:fractional], money_data[:currency_code])
  end
end
# rubocop:enable Metrics/ClassLength
