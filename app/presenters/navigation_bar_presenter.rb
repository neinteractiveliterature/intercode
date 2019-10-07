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
      url '/events/schedule'
      visible? { Pundit.policy(pundit_user, convention).schedule? }
    end,
    NavigationItem.define do
      label 'Con Schedule by Room'
      url '/events/schedule_by_room'
      visible? { Pundit.policy(pundit_user, convention).schedule? }
    end,
    NavigationItem.define do
      label 'List of Events'
      url '/events'
      visible? { Pundit.policy(pundit_user, convention).list_events? }
    end,
    NavigationItem.define do
      label 'Schedule With Counts'
      url '/events/schedule_with_counts'
      visible? { Pundit.policy(pundit_user, convention).schedule_with_counts? }
    end,
    NavigationItem.define do
      label 'Propose an Event'
      url '/pages/new-proposal'
      visible? { convention.accepting_proposals }
    end
  ]

  SITE_CONTENT_NAVIGATION_ITEM = NavigationItem.define do
    label 'Site Content'
    url '/cms_pages'
    visible? do
      PagePolicy::ManageScope.new(pundit_user, Page.where(parent: convention)).resolve.any?
    end
  end

  ADMIN_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Attendees'
      url '/user_con_profiles'
      visible? { Pundit.policy(pundit_user, convention).view_attendees? }
    end,
    NavigationItem.define do
      label 'Convention Settings'
      url '/convention/edit'
      visible? { Pundit.policy(pundit_user, convention).update? }
    end,
    NavigationItem.define do
      label 'Event Categories'
      url '/event_categories'
      visible? { convention.site_mode != 'single_event' && Pundit.policy(pundit_user, EventCategory.new(convention: convention)).update? }
    end,
    NavigationItem.define do
      label 'Event Proposals'
      url '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc'
      visible? { convention.site_mode != 'single_event' && Pundit.policy(pundit_user, convention).view_event_proposals? }
    end,
    NavigationItem.define do
      label 'Event Scheduling'
      url '/admin_events'
      visible? { Pundit.policy(pundit_user, Run.new(event: Event.new(convention: convention))).manage? }
    end,
    NavigationItem.define do
      label 'Forms'
      url '/admin_forms'
      visible? { Pundit.policy(pundit_user, Form.new(convention: convention)).update? }
    end,
    NavigationItem.define do
      label 'Mailing Lists'
      url '/mailing_lists'
      visible? { Pundit.policy(pundit_user, MailingListsPresenter.new(convention)).read_any_mailing_list? }
    end,
    NavigationItem.define do
      label 'OAuth2 Applications'
      url '/oauth/applications-embed'
      visible? { Pundit.policy(pundit_user, Doorkeeper::Application.new).manage? }
    end,
    NavigationItem.define do
      label 'Reports'
      url '/reports'
      visible? { Pundit.policy(pundit_user, convention).view_reports? }
    end,
    NavigationItem.define do
      label 'Rooms'
      url '/rooms'
      visible? { Pundit.policy(pundit_user, Room.new(convention: convention)).update? }
    end,
    NavigationItem.define do
      label 'Signup Moderation'
      url '/signup_moderation'
      visible? do
        convention.signup_mode == 'moderated' &&
          Pundit.policy(
            pundit_user,
            Signup.new(run: Run.new(event: Event.new(convention: convention)))
          ).manage?
      end
    end,
    SITE_CONTENT_NAVIGATION_ITEM,
    NavigationItem.define do
      label 'Staff Positions'
      url '/staff_positions'
      visible? { Pundit.policy(pundit_user, StaffPosition.new(convention: convention)).update? }
    end,
    NavigationItem.define do
      label 'Store'
      url '/admin_store'
      visible? do
        Pundit.policy(
          pundit_user,
          Order.new(user_con_profile: UserConProfile.new(convention: convention))
        ).read?
      end
    end,
    NavigationItem.define do
      label { "#{convention.ticket_name.titleize} Types" }
      url '/ticket_types'
      visible? do
        convention.ticket_mode != 'disabled' &&
          Pundit.policy(pundit_user, TicketType.new(convention: convention)).update?
      end
    end,
    NavigationItem.define do
      label 'User Activity Alerts'
      url '/user_activity_alerts'
      visible? { Pundit.policy(pundit_user, UserActivityAlert.new(convention: convention)).read? }
    end
  ]

  ROOT_SITE_ADMIN_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Organizations'
      url '/organizations'
      visible? { Pundit.policy(pundit_user, Organization.new).read? }
    end,
    SITE_CONTENT_NAVIGATION_ITEM,
    NavigationItem.define do
      label 'Users'
      url '/users'
      visible? { Pundit.policy(pundit_user, User.new).read? }
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
      url '/my_profile'
      visible? { user_con_profile }
    end,
    NavigationItem.define do
      label 'My Order History'
      url '/order_history'
      visible? { user_con_profile }
    end,
    NavigationItem.define do
      label 'Authorized Applications'
      url '/oauth/applications-embed'
      visible? { user_signed_in? }
    end,
    SignOutNavigationItem.define do
      label 'Log Out'
      visible? { user_signed_in? }
    end
  ]

  attr_reader :navbar_classes, :request, :user_con_profile, :pundit_user, :user_signed_in, :convention
  alias user_signed_in? user_signed_in

  def initialize(navbar_classes, request, pundit_user, user_con_profile, user_signed_in, convention)
    @navbar_classes = navbar_classes
    @request = request
    @pundit_user = pundit_user
    @user_con_profile = user_con_profile
    @user_signed_in = user_signed_in
    @convention = convention
  end

  def navigation_bar
    NavigationBar.new(navbar_classes, root_navigation_items)
  end

  def ticket_purchase_navigation_items
    if convention&.tickets_available_for_purchase? && convention.site_mode != 'single_event'
      [TicketPurchaseNavigationItem.new]
    else
      []
    end
  end

  def root_navigation_items
    [
      *ticket_purchase_navigation_items,
      *(
        if convention && convention.site_mode != 'single_event'
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
      url "/pages/#{item.page.to_param}"
    end
  end

  def cms_navigation_items(section_items)
    item_classes = section_items.map do |item|
      cms_navigation_item_class(item)
    end

    build_navigation_items(item_classes)
  end
end
