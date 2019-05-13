class NavigationBarPresenter
  include Rails.application.routes.url_helpers

  class NavigationItem
    def self.define(&definition)
      Class.new(self) do
        instance_eval(&definition)
      end
    end

    %i[label url visible? active?].each do |method_name|
      define_singleton_method(method_name) do |value = nil, &implementation|
        if value
          define_method(method_name) { value }
        else
          define_method(method_name) do |*args|
            @presenter.instance_exec(*args, &implementation)
          end
        end
      end
    end

    def initialize(presenter)
      @presenter = presenter
    end

    def label
      raise 'Navigation items must define #label'
    end

    def url
      raise 'Navigation items must define #url'
    end

    def visible?
      true
    end

    def active?(request)
      request.path.start_with?(url)
    end

    def item_class(request, navigation_section)
      item_classes = []
      if navigation_section
        item_classes << 'dropdown-item'
      else
        item_classes << 'nav-link'
      end
      item_classes << 'active' if active?(request)
      item_classes.join(' ')
    end
  end

  class NavigationSection
    attr_reader :label, :sort

    def initialize(label, items, sort: true)
      @label = label
      @items = items
      @sort = sort
    end

    def items
      visible_items = @items.select(&:visible?)
      sort ? visible_items.sort_by(&:label) : visible_items
    end
  end

  class UserNavigationSection < NavigationSection
    def initialize(items)
      super(nil, items, sort: false)
    end
  end

  class SignOutNavigationItem < NavigationItem
    def active?(*)
      false
    end

    def url(*)
      nil
    end
  end

  class NavigationBrand
    attr_reader :label

    def initialize(label)
      @label = label
    end
  end

  class NavigationCollapse
    attr_reader :groups

    def initialize(groups)
      @groups = groups
    end
  end

  class RootNavigationGroup
    attr_reader :items, :expand

    def initialize(items, expand: false)
      @items = items
      @expand = expand
    end
  end

  class TicketPurchaseNavigationItem
  end

  class NavigationBar
    attr_reader :classes, :items

    def initialize(classes, items)
      @classes = classes
      @items = items
    end
  end

  EVENTS_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Con Schedule'
      url { "#{events_path}/schedule" }
      visible? { can?(:schedule, convention) }
      active? { |request| request.path == "#{events_path}/schedule" }
    end,
    NavigationItem.define do
      label 'Con Schedule by Room'
      url { "#{events_path}/schedule_by_room" }
      visible? { can?(:schedule, convention) }
      active? { |request| request.path == "#{events_path}/schedule_by_room" }
    end,
    NavigationItem.define do
      label 'List of Events'
      url { events_path }
      visible? { can?(:list_events, convention) }
      active? { |request| request.path == events_path }
    end,
    NavigationItem.define do
      label 'Schedule With Counts'
      url { "#{events_path}/schedule_with_counts" }
      visible? { can?(:schedule_with_counts, convention) }
    end,
    NavigationItem.define do
      label 'Propose an Event'
      url { page_path('new-proposal') }
      visible? { convention.accepting_proposals }
    end
  ]

  SITE_CONTENT_NAVIGATION_ITEM = NavigationItem.define do
    label 'Site Content'
    url { cms_pages_path }
    visible? { can?(:update, Page.new(parent: convention)) }
    active? do |request|
      [
        cms_pages_path,
        cms_partials_path,
        cms_layouts_path,
        cms_files_path,
        cms_navigation_items_path
      ].include?(request.path)
    end
  end

  ADMIN_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Attendees'
      url '/user_con_profiles'
      visible? { can?(:view_attendees, convention) }
    end,
    NavigationItem.define do
      label 'Convention Settings'
      url '/convention/edit'
      visible? { can?(:update, convention) }
    end,
    NavigationItem.define do
      label 'Event Categories'
      url '/event_categories'
      visible? { can?(:update, EventCategory.new(convention: convention)) }
    end,
    NavigationItem.define do
      label 'Event Proposals'
      url '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc'
      visible? { can?(:view_event_proposals, convention) }
    end,
    NavigationItem.define do
      label 'Event Scheduling'
      url '/admin_events'
      visible? { can?(:update, Run.new(event: Event.new(convention: convention))) }
    end,
    NavigationItem.define do
      label 'Forms'
      url '/admin_forms'
      visible? { can?(:update, Form.new(convention: convention)) }
    end,
    NavigationItem.define do
      label 'Mailing Lists'
      url '/mailing_lists'
      visible? { can?(:mail_to_any, convention) }
    end,
    NavigationItem.define do
      label 'OAuth2 Applications'
      url { oauth_applications_path }
      visible? { can?(:manage, Doorkeeper::Application) }
    end,
    NavigationItem.define do
      label 'Reports'
      url { reports_path }
      visible? { can?(:view_reports, convention) }
    end,
    NavigationItem.define do
      label 'Rooms'
      url { rooms_path }
      visible? { can?(:update, Room.new(convention: convention)) }
    end,
    SITE_CONTENT_NAVIGATION_ITEM,
    NavigationItem.define do
      label 'Staff Positions'
      url { staff_positions_path }
      visible? { can?(:update, StaffPosition.new(convention: convention)) }
    end,
    NavigationItem.define do
      label 'Store'
      url { admin_store_path }
      visible? do
        can?(:read, Order.new(user_con_profile: UserConProfile.new(convention: convention)))
      end
    end,
    NavigationItem.define do
      label { "#{convention.ticket_name.titleize} Types" }
      url '/ticket_types'
      visible? do
        convention.ticket_mode != 'disabled' &&
          can?(:update, TicketType.new(convention: convention))
      end
    end,
    NavigationItem.define do
      label 'User Activity Alerts'
      url { user_activity_alerts_path }
      visible? { can?(:read, UserActivityAlert.new(convention: convention)) }
    end
  ]

  ROOT_SITE_ADMIN_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Organizations'
      url { organizations_path }
      visible? { can?(:read, Organization) }
    end,
    SITE_CONTENT_NAVIGATION_ITEM,
    NavigationItem.define do
      label 'Users'
      url { users_path }
      visible? { can?(:read, User) }
    end
  ]

  USER_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'My Account'
      url { edit_user_registration_path }
      visible? { user_signed_in? }
    end,
    NavigationItem.define do
      label { "My #{convention.name} Profile" }
      url { my_profile_path }
      visible? { user_con_profile }
    end,
    NavigationItem.define do
      label 'My Order History'
      url { order_history_path }
      visible? { user_con_profile }
    end,
    NavigationItem.define do
      label 'Authorized Applications'
      url { oauth_authorized_applications_path }
      visible? { user_signed_in? }
    end,
    SignOutNavigationItem.define do
      label 'Log Out'
      visible? { user_signed_in? }
    end
  ]

  attr_reader :navbar_classes, :request, :current_ability, :user_con_profile, :user_signed_in, :convention
  alias user_signed_in? user_signed_in
  delegate :can?, to: :current_ability

  def initialize(navbar_classes, request, current_ability, user_con_profile, user_signed_in, convention)
    @navbar_classes = navbar_classes
    @request = request
    @current_ability = current_ability
    @user_con_profile = user_con_profile
    @user_signed_in = user_signed_in
    @convention = convention
  end

  def navigation_bar
    NavigationBar.new(navbar_classes, root_navigation_items)
  end

  def ticket_purchase_navigation_items
    if convention&.tickets_available_for_purchase?
      [TicketPurchaseNavigationItem.new]
    else
      []
    end
  end

  def root_navigation_items
    [
      navbar_brand,
      NavigationCollapse.new([
        RootNavigationGroup.new([
          *ticket_purchase_navigation_items,
          *(
            if convention
              [NavigationSection.new('Events', events_navigation_items)]
            else
              []
            end
          ),
          *cms_navigation_item_sections,
          *(
            if convention
              [NavigationSection.new('Admin', admin_navigation_items)]
            else
              [NavigationSection.new('Admin', root_site_admin_navigation_items)]
            end
          )
        ], expand: true),
        RootNavigationGroup.new([
          UserNavigationSection.new(user_navigation_items)
        ])
      ])
    ]
  end

  def events_navigation_items
    build_navigation_items(EVENTS_NAVIGATION_ITEMS)
  end

  def cms_navigation_item_sections
    item_scope = (convention&.cms_navigation_items || CmsNavigationItem.global)
    items_by_section_id = item_scope.includes(:page).group_by(&:navigation_section_id)
    root_items = items_by_section_id[nil] || []

    root_items.sort_by(&:position).map do |item|
      case item.item_type
      when 'section'
        section_items = (items_by_section_id[item.id] || []).sort_by(&:position)
        NavigationSection.new(item.title, cms_navigation_items(section_items), sort: false)
      when 'link'
        cms_navigation_item_class(item).new(self)
      end
    end
  end

  def admin_navigation_items
    build_navigation_items(ADMIN_NAVIGATION_ITEMS)
  end

  def root_site_admin_navigation_items
    build_navigation_items(ROOT_SITE_ADMIN_NAVIGATION_ITEMS)
  end

  def user_navigation_items
    build_navigation_items(USER_NAVIGATION_ITEMS)
  end

  def navbar_brand
    NavigationBrand.new(convention ? convention.name : RootSite.instance.site_name)
  end

  private

  def build_navigation_items(item_classes)
    item_classes.map { |item_class| item_class.new(self) }.select(&:visible?)
  end

  def cms_navigation_item_class(item)
    NavigationItem.define do
      label item.title
      url { page_path(item.page) }
    end
  end

  def cms_navigation_items(section_items)
    item_classes = section_items.map do |item|
      cms_navigation_item_class(item)
    end

    build_navigation_items(item_classes)
  end
end
