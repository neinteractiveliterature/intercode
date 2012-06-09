module ApplicationHelper
  def page_banner
    if @con
      image_tag @con.banner_image, :class => "page_banner"
    else
      content_tag(:div, :class => "page_banner", 
        :style => "background-color: black; color: white; height: 120px; width: 800px;
                   text-align: center;") do
          
        content_tag(:h1, "Welcome to Intercode", :style => "display: inline-block;")
      end
    end
  end
end
