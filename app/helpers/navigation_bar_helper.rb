module NavigationBarHelper
  DROPDOWN_TARGET_ATTRS = {
    class: 'nav-link dropdown-toggle',
    href: '#',
    role: 'button',
    'aria-expanded' => 'false',
    'aria-haspopup' => 'true',
    'data-toggle' => 'dropdown'
  }

  def render_sign_out_navigation_item(item, navigation_section)
    app_component 'SignOutButton',
      className: item.item_class(request, navigation_section),
      caption: item.label
  end

  def render_navigation_item(item, navigation_section)
    if item.is_a?(NavigationBarPresenter::SignOutNavigationItem)
      return render_sign_out_navigation_item(item, navigation_section)
    end

    options = { class: item.item_class(request, navigation_section), method: item.http_method }
    options.delete(:method) if options[:method] && options[:method].to_s.downcase == 'get'
    link_to item.label, item.url, options.compact
  end

  def render_navigation_items(items, navigation_section)
    safe_join(items.map { |item| render_navigation_item(item, navigation_section) })
  end

  def render_navigation_menu(label, items, navigation_section)
    return unless items.any?

    content_tag(:li, class: 'nav-item dropdown', role: 'presentation') do
      safe_join([
        content_tag(:a, label, DROPDOWN_TARGET_ATTRS),
        content_tag(:div, class: 'dropdown-menu', style: 'z-index: 1100;') do
          render_navigation_items(items, navigation_section)
        end
      ])
    end
  end

  def render_navigation_collapse(items)
    content_tag(:div, id: 'navbarSupportedContent', class: 'collapse navbar-collapse') do
      safe_join(items.map { |item| render_root_navigation_item(item) })
    end
  end

  def render_root_navigation_group(root_navigation_group)
    content_tag(:ul, class: 'navbar-nav' + (root_navigation_group.expand ? ' mr-auto' : '')) do
      safe_join(root_navigation_group.items.map { |item| render_root_navigation_item(item) })
    end
  end

  def render_navigation_brand(item)
    link_to(item.label, root_url, class: 'navbar-brand')
  end

  def render_ticket_purchase_navigation_item
    return unless convention
    return unless user_con_profile && !user_con_profile.ticket
    return unless convention.ticket_types.publicly_available.any?

    content_tag(:li, class: 'nav-item my-auto') do
      link_to ticket_path, class: 'btn btn-sm btn-primary' do
        safe_join([
          content_tag(
            :span,
            "Buy a #{convention.ticket_name}!",
            class: 'd-inline d-md-none d-lg-inline'
          ),
          content_tag(
            :span,
            "#{convention.ticket_name.humanize}!",
            class: 'd-none d-md-inline d-lg-none'
          )
        ])
      end
    end
  end

  def render_root_navigation_item(item)
    case item
    when NavigationBarPresenter::NavigationItem
      content_tag(:li, class: 'navigation-item my-auto') do
        render_navigation_item(item, nil)
      end
    when NavigationBarPresenter::NavigationCollapse
      render_navigation_collapse(item.groups)
    when NavigationBarPresenter::NavigationBrand
      render_navigation_brand(item)
    when NavigationBarPresenter::RootNavigationGroup
      render_root_navigation_group(item)
    when NavigationBarPresenter::TicketPurchaseNavigationItem
      render_ticket_purchase_navigation_item
    when NavigationBarPresenter::UserNavigationSection
      user_navigation_section(item.items, item)
    when NavigationBarPresenter::NavigationSection
      render_navigation_menu(item.label, item.items, item)
    else item
    end
  end

  def root_navigation_menus
    safe_join(
      navigation_bar_presenter.root_navigation_items.map do |root_item|
        render_root_navigation_item(root_item)
      end
    )
  end

  def navigation_bar_presenter
    @navigation_bar_presenter ||= NavigationBarPresenter.new(
      ApplicationHelper::DEFAULT_NAVBAR_CLASSES,
      request,
      current_ability,
      user_con_profile,
      user_signed_in?,
      convention
    )
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
        app_component 'SignInButton',
          className: 'btn btn-link nav-link',
          initiallyOpen: params[:show_authentication] == 'signIn'
      end,
      content_tag(:li, class: 'nav-item my-auto') do
        app_component 'SignUpButton',
          className: 'btn btn-primary nav-link py-1 text-white',
          initiallyOpen: params[:show_authentication] == 'signUp'
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

  def user_navigation_section(items, navigation_section)
    return logged_out_user_navigation_section unless user_signed_in?

    safe_join([
      current_pending_order_navigation_item,
      content_tag(:li, class: 'nav-item') do
        content_tag(:div, class: 'btn-group', role: 'group') do
          safe_join([
            content_tag(:div, class: 'btn-group', role: 'group') do
              safe_join([
                user_navigation_dropdown_target,
                content_tag(:div, class: 'dropdown-menu', style: 'z-index: 1100;') do
                  render_navigation_items(items, navigation_section)
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
