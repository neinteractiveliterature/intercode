class Intercode::Import::Procon::Tables::Conventions < Intercode::Import::Procon::Table
  include Intercode::Import::Procon::EventHelpers

  after_create_record do |row, convention|
    if convention.site_mode == 'convention'
      convention.create_root_page!(
        parent: convention,
        slug: 'root',
        name: 'Root page',
        content: root_page(row)
      )

      LoadCmsContentSetService.new(convention: convention, content_set_name: 'procon_import').call!
      overwrite_layout_if_applicable(convention)
      convention.reload

      convention.event_categories.create!(
        name: 'Larp',
        team_member_name: 'GM',
        scheduling_ui: 'regular',
        default_color: '#d2b9fb',
        full_color: 'rgba(210, 185, 251, 0.6)',
        signed_up_color: '#6610f2',
        event_form: convention.forms.find_by!(title: 'Regular event form'),
        event_proposal_form: convention.forms.find_by!(title: 'Proposal form')
      )

      convention.event_categories.create!(
        name: 'Con services',
        team_member_name: 'team member',
        scheduling_ui: 'single_run',
        default_color: '#ffeeba',
        full_color: 'rgba(255, 238, 186, 0.6)',
        signed_up_color: '#d6a100',
        event_form: convention.forms.find_by!(title: 'Filler event form')
      )
    else
      LoadCmsContentSetService.new(convention: convention, content_set_name: 'single_event').call!
      convention.reload

      convention.event_categories.create!(
        name: 'Larp',
        team_member_name: 'GM',
        scheduling_ui: 'regular',
        default_color: '#d2b9fb',
        full_color: 'rgba(210, 185, 251, 0.6)',
        signed_up_color: '#6610f2',
        event_form: convention.forms.find_by!(title: 'Regular event form')
      )
    end
  end

  def initialize(connection, convention_domain_regex, organization)
    super connection
    @markdownifier = Intercode::Import::Markdownifier.new(logger)
    @convention_domain_regex = convention_domain_regex
    @organization = organization
  end

  def table_name
    :events
  end

  def dataset
    super.where(parent_id: nil)
  end

  private

  def build_record(row)
    return nil unless convention_domain_regex_matches?(row[:id])

    domain = convention_domain(row[:id])
    unless domain
      logger.warn("Skipping #{row[:fullname]} because it has no virtual sites")
      return nil
    end

    Convention.new(
      organization: @organization,
      name: row[:fullname],
      domain: convention_domain(row[:id]),
      timezone_name: 'America/New_York',
      ticket_mode: 'disabled',
      site_mode: site_mode(row[:id]),
      maximum_event_signups: ScheduledValue::ScheduledValue.always(maximum_event_signups(row)),
      starts_at: force_timezone(row[:start], 'America/New_York'),
      ends_at: force_timezone(row[:end], 'America/New_York'),
      show_schedule: 'yes',
      show_event_list: 'yes'
    )
  end

  def site_mode(convention_id)
    return 'convention' if connection[:events].where(parent_id: convention_id).any?
    'single_event'
  end

  def convention_domain_regex_matches?(event_id)
    all_domains = connection[:virtual_sites].where(event_id: event_id).map(:domain)
    all_domains.any? { |domain| @convention_domain_regex.match?(domain) }
  end

  # Pick the longest domain on the theory that it's the least ambiguous
  def convention_domain(event_id)
    all_domains = connection[:virtual_sites].where(event_id: event_id).map(:domain)
    all_domains.sort_by { |domain| [domain.length, domain] }.last
  end

  def maximum_event_signups(row)
    if row[:max_child_event_attendances].nil?
      'unlimited'
    elsif row[:max_child_event_attendances] <= 0
      'not_yet'
    elsif row[:max_child_event_attendances] < 4
      row[:max_child_event_attendances].to_s
    else
      'unlimited' # some cons used really high numbers to mean this
    end
  end

  def overwrite_layout_if_applicable(convention)
    virtual_site = connection[:virtual_sites].where(domain: convention.domain).first
    return unless virtual_site && virtual_site[:site_template_id]

    site_template = connection[:site_templates].where(id: virtual_site[:site_template_id]).first
    return unless site_template

    convention.default_layout.update!(
      name: site_template[:name],
      navbar_classes: 'row navbar-expand-md mt-4 bg-dark navbar-dark',
      content: content_for_layout(site_template)
    )
  end

  def content_for_layout(site_template)
    inner_content = <<~LIQUID
      {{ content_for_navbar }}
      {{ content_for_layout }}
    LIQUID

    if site_template[:footer].blank?
      inner_content = <<~HTML
        <div class="container">
          {{ content_for_navbar }}
        </div>
        <div class="container bg-white py-4">
          {{ content_for_layout }}
        </div>
      HTML
    end

    <<~HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          {{ content_for_head }}
          <style type="text/css">
            #{process_css(site_template[:css] || site_template[:themeroller_css])}
          </style>
        <body>
          #{site_template[:header]}
          #{inner_content}
          #{site_template[:footer]}
        </body>
      </html>
    HTML
  end

  def root_page(row)
    <<~LIQUID
      <div class="row">
        <div class="col-md-8">
          #{descriptive_content(row)}
        </div>
        <div class="col-md-4">
          {% include 'dates_card' %}
          {% include 'event_staff_card' %}
        </div>
      </div>
    LIQUID
  end

  def process_css(css)
    css.gsub('a, a:visited, a:hover {', 'a {')
  end
end
