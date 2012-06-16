module ApplicationHelper
  def page_banner
    banner_image_url = @con && @con.banner_image.try(:url)
    
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
end
