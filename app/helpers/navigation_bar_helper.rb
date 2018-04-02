module NavigationBarHelper
  class NavigationItem
    def self.define(&definition)
      Class.new(NavigationBarHelper::NavigationItem) do
        instance_eval(&definition)
      end
    end

    %i[label url visible? active?].each do |method_name|
      define_singleton_method(method_name) do |value = nil, &implementation|
        if value
          define_method(method_name) { value }
        else
          define_method(method_name) do |*args|
            @view.instance_exec(*args, &implementation)
          end
        end
      end
    end

    def initialize(view)
      @view = view
    end

    def label
      raise 'Navigation items must define #label'
    end

    def url
      raise 'Navigation items must define #url'
    end

    def visible?
      raise 'Navigation items must define #visible?'
    end

    def active?(request)
      request.path.start_with?(url)
    end

    def item_class(request)
      item_class = 'dropdown-item'
      item_class << ' active' if active?(request)
      item_class
    end
  end

  EVENTS_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Con Schedule'
      url { schedule_events_path }
      visible? { can?(:schedule, convention) }
      active? { |request| request.path == schedule_events_path }
    end,
    NavigationItem.define do
      label 'List of Events'
      url { events_path }
      visible? true
      active? { |request| request.path == events_path }
    end,
    NavigationItem.define do
      label 'Schedule With Counts'
      url { schedule_with_counts_events_path }
      visible? { can?(:schedule_with_counts, convention) }
    end,
    NavigationItem.define do
      label 'Propose an Event'
      url { page_path('new-proposal') }
      visible? { convention.accepting_proposals }
    end
  ]

  ADMIN_NAVIGATION_ITEMS = [
    NavigationItem.define do
      label 'Attendees'
      url { user_con_profiles_path }
      visible? { can?(:view_attendees, convention) }
    end,
    NavigationItem.define do
      label 'Convention Settings'
      url { edit_convention_path }
      visible? { can?(:update, convention) }
    end,
    NavigationItem.define do
      label 'Event Proposals'
      url { admin_event_proposals_path }
      visible? { can?(:read, EventProposal.new(convention: convention, status: 'reviewing')) }
    end,
    NavigationItem.define do
      label 'Event Scheduling'
      url { admin_events_path }
      visible? { can?(:update, Run.new(event: Event.new(convention: convention))) }
    end,
    NavigationItem.define do
      label 'Forms'
      url { admin_forms_path }
      visible? { can?(:update, Form.new(convention: convention)) }
    end,
    NavigationItem.define do
      label 'Mailing Lists'
      url { mailing_lists_path }
      visible? { can?(:mail_to_any, convention) }
    end,
    NavigationItem.define do
      label 'Orders'
      url { admin_orders_path }
      visible? do
        can?(:read, Order.new(user_con_profile: UserConProfile.new(convention: convention)))
      end
    end,
    NavigationItem.define do
      label 'Reports'
      url { reports_path }
      visible? { can?(:view_reports, convention) }
    end,
    NavigationItem.define do
      label 'Site Content'
      url { pages_path }
      visible? { can?(:update, Page.new(parent: convention)) }
      active? do |request|
        [
          pages_path,
          cms_partials_path,
          cms_layouts_path,
          cms_files_path,
          cms_navigation_items_path
        ].include?(request.path)
      end
    end,
    NavigationItem.define do
      label 'Staff Positions'
      url { staff_positions_path }
      visible? { can?(:update, StaffPosition.new(convention: convention)) }
    end,
    NavigationItem.define do
      label 'Rooms'
      url { rooms_path }
      visible? { can?(:update, Room.new(convention: convention)) }
    end,
    NavigationItem.define do
      label { "#{convention.ticket_name.titleize} Types" }
      url { ticket_types_path }
      visible? { can?(:update, TicketType.new(convention: convention)) }
    end
  ]

  def render_navigation_item(item)
    link_to item.label, item.url, class: item.item_class(request)
  end

  def render_navigation_menu(label, items)
    visible_items = items.map { |item_class| item_class.new(self) }
    visible_items.select!(&:visible?)
    return unless visible_items.any?

    content_tag(:li, class: 'nav-item dropdown', role: 'presentation') do
      safe_join([
        content_tag(
          :a,
          label,
          class: 'nav-link dropdown-toggle',
          href: '#',
          role: 'button',
          'aria-expanded' => 'false',
          'aria-haspopup' => 'true',
          'data-toggle' => 'dropdown'
        ),
        content_tag(:div, class: 'dropdown-menu') do
          safe_join(visible_items.sort_by(&:label).map { |item| render_navigation_item(item) })
        end
      ])
    end
  end

  def events_navigation_menu
    render_navigation_menu('Events', EVENTS_NAVIGATION_ITEMS)
  end

  def admin_navigation_menu
    render_navigation_menu('Admin', ADMIN_NAVIGATION_ITEMS)
  end
end
