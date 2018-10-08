module NavigationBarHelper
  class NavigationItem
    def self.define(&definition)
      Class.new(NavigationBarHelper::NavigationItem) do
        instance_eval(&definition)
      end
    end

    %i[label url visible? active? http_method].each do |method_name|
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

    def http_method
      'GET'
    end

    def visible?
      true
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
      url { admin_event_proposals_path('sort.status' => 'asc', 'sort.submitted_at' => 'desc') }
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
      label 'Store'
      url { admin_store_path }
      visible? do
        can?(:read, Order.new(user_con_profile: UserConProfile.new(convention: convention)))
      end
    end,
    NavigationItem.define do
      label { "#{convention.ticket_name.titleize} Types" }
      url { ticket_types_path }
      visible? { can?(:update, TicketType.new(convention: convention)) }
    end
  ]

  DROPDOWN_TARGET_ATTRS = {
    class: 'nav-link dropdown-toggle',
    href: '#',
    role: 'button',
    'aria-expanded' => 'false',
    'aria-haspopup' => 'true',
    'data-toggle' => 'dropdown'
  }

  def render_navigation_item(item)
    link_to item.label, item.url, class: item.item_class(request), method: item.http_method
  end

  def render_navigation_items(items, sort: true)
    ordered_items = sort ? items.sort_by(&:label) : items
    safe_join(ordered_items.map { |item| render_navigation_item(item) })
  end

  def render_navigation_menu(label, items)
    visible_items = items.map { |item_class| item_class.new(self) }
    visible_items.select!(&:visible?)
    return unless visible_items.any?

    content_tag(:li, class: 'nav-item dropdown', role: 'presentation') do
      safe_join([
        content_tag(:a, label, DROPDOWN_TARGET_ATTRS),
        content_tag(:div, class: 'dropdown-menu') do
          render_navigation_items(visible_items)
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

  def user_con_profile_navigation_items
    return [] unless user_con_profile

    [
      NavigationItem.define do
        label { "My #{convention.name} Profile" }
        url { my_profile_path }
      end,
      NavigationItem.define do
        label 'My Order History'
        url { order_history_path }
      end
    ]
  end

  def user_navigation_items
    return [] unless user_signed_in?

    [
      NavigationItem.define do
        label 'My Account'
        url { edit_user_registration_path }
      end,
      *user_con_profile_navigation_items,
      NavigationItem.define do
        label 'Authorized Applications'
        url { oauth_authorized_applications_path }
      end,
      NavigationItem.define do
        label 'Log Out'
        url { destroy_user_session_path }
        http_method 'DELETE'
      end
    ]
  end

  def current_pending_order_navigation_item
    return unless user_signed_in? && current_pending_order

    total_entries = current_pending_order.order_entries.sum(:quantity)
    return unless total_entries > 0

    content_tag(:li, class: 'nav-item') do
      link_to cart_path, class: 'btn btn-light mr-2', style: 'position: relative' do
        content_tag(:i, '', class: 'fa fa-shopping-cart', title: 'My shopping cart') +
          content_tag(
            :badge,
            total_entries,
            class: 'badge-pill badge-danger',
            style: 'position: absolute; right: -9px; top: -9px;'
          )
      end
    end
  end

  def revert_assumed_identity_navigation_item
    return unless assumed_identity_from_profile

    link_to revert_become_user_con_profiles_path, method: 'POST', class: 'btn btn-secondary' do
      safe_join([
        'Revert ',
        content_tag(
          :span,
          "to #{assumed_identity_from_profile.name}",
          class: 'd-inline.d-md-none.d-lg-inline'
        )
      ])
    end
  end

  def logged_out_user_navigation_section
    safe_join([
      content_tag(:li, class: 'nav-item login') do
        link_to 'Log In', new_user_session_path, class: 'nav-link'
      end,
      content_tag(:li, class: 'nav-item my-auto') do
        content_tag(:div, class: 'nav-link') do
          link_to 'Sign Up', new_user_registration_path, class: 'btn btn-primary btn-sm'
        end
      end
    ])
  end

  def user_navigation_dropdown_target
    if assumed_identity_from_profile
      content_tag(:a, DROPDOWN_TARGET_ATTRS.merge(class: 'btn btn-warning dropdown-toggle')) do
        safe_join([
          content_tag(:i, '', class: 'fa fa-user-secret'),
          ' ',
          content_tag(:span, class: 'd-inline d-md-none d-lg-inline') do
            user_con_profile.name_without_nickname
          end,
          content_tag(:span, class: 'd-none d-md-inline d-lg-none') do
            "#{user_con_profile.first_name.slice(0, 1)}#{user_con_profile.last_name.slice(0, 1)}"
          end
        ])
      end
    else
      content_tag(:a, DROPDOWN_TARGET_ATTRS) do
        safe_join([
          content_tag(:i, '', class: 'fa fa-user'),
          ' ',
          if user_con_profile
            user_con_profile.name
          else
            current_user.name
          end
        ])
      end
    end
  end

  def user_navigation_section
    return logged_out_user_navigation_section unless user_signed_in?

    safe_join([
      current_pending_order_navigation_item,
      content_tag(:li, class: 'nav-item') do
        content_tag(:div, class: 'btn-group', role: 'group') do
          safe_join([
            content_tag(:div, class: 'btn-group', role: 'group') do
              safe_join([
                user_navigation_dropdown_target,
                content_tag(:div, class: 'dropdown-menu') do
                  render_navigation_items(
                    user_navigation_items.map { |item_class| item_class.new(self) },
                    sort: false
                  )
                end
              ])
            end,
            revert_assumed_identity_navigation_item
          ])
        end
      end
    ])
  end
end
