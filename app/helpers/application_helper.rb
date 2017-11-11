module ApplicationHelper
  def self.obfuscated_email(address)
    address.gsub('.', ' DOT ').gsub('@', ' AT ')
  end

  # Cadmus checks for this when rendering a page
  def liquid_assigns_for_layout(cms_layout)
    head_content = render(partial: 'layouts/head')
    {
      'content_for_head' => head_content,
      'content_for_navbar' => navigation_bar(cms_layout.navbar_classes)
    }
  end

  def navigation_bar(navbar_classes = nil)
    navbar_classes ||= 'navbar-dark bg-intercode-blue'

    renderer = CadmusNavbar::Renderers::Bootstrap4.new(
      request: request,
      url_for_page: ->(page) { page_url(page) },
      root_items: convention.cms_navigation_items.root
    )
    render partial: 'layouts/navigation_bar', locals: { renderer: renderer, navbar_classes: navbar_classes }
  end

  def page_title
    parts = []

    parts << @page_title if @page_title.present?
    parts << @event.title if @event

    if @convention
      parts << @convention.name
    else
      parts << "Intercode"
    end

    parts.join(" - ")
  end

  def page_banner
    banner_image_url = @convention && @convention.banner_image.try(:url)

    if banner_image_url
      image_tag banner_image_url, :class => "page_banner"
    else
      content_tag(:div, :class => "page_banner",
        :style => "background-color: black; color: white; height: 120px; width: 800px;
                   text-align: center;") do

        content_tag(:h1, @con ? @con.name : "Welcome to Intercode", :style => "display: inline-block;")
      end
    end
  end

  # Generate an obfuscated email address if the user is not logged in.
  # Note that we may not need this.  Rails has other mechanisms to
  # prevent the harvesting of email addresses. But this way all of the
  # code to generate mailto links will be gathered in one place so we
  # can easily modify them.
  def intercode_mail_to(address, name=nil, html_options={})
    # If the address is empty, just return the empty string
    return unless address.present?

    # If the user is logged in, return a mailto link.  Otherwise,
    # return an obfuscated version of the address
    if user_signed_in?
      mail_to(address, name, html_options)
    else
      ApplicationHelper.obfuscated_email(address)
    end
  end

  def check_mark_for(boolean)
    return '' unless boolean

    content_tag(:i, class: "fa fa-check") do
      content_tag(:span, "✓", class: 'sr-only')
    end
  end

  def nav_link_to(name, url, html_options = nil, &block)
    html_options = html_options.symbolize_keys
    classes = [html_options[:class], 'nav-link', (html_options.delete(:active) ? 'active' : '')].compact.join(' ')
    link_to(name, url, html_options.merge(class: classes), &block)
  end

  def graphql_authenticity_token
    form_authenticity_token(form_options: { action: graphql_path, method: 'POST' })
  end

  def beginning_of_convention_day(time)
    if time.hour < 6
      (time - 1.day).beginning_of_day.change(hour: 6)
    else
      time.beginning_of_day.change(hour: 6)
    end
  end
end
