class PagesController < BaseControllers::VirtualHost
  include Cadmus::PagesController
  authorize_resource :page, :except => [:root]
  before_filter :redirect_if_root_page, :only => [:show]
  
  # Show the root page.  Used at the root of a con domain.
  def root
    @page = page_parent.root_page
    raise ActiveRecord::RecordNotFound unless @page
    
    authorize! :read, @page
    show
  end

  protected
  def page_class
    Page
  end
  
  def page_parent_class
    convention && Convention
  end
  
  def page_parent_name
    convention && "convention"
  end
  
  def page_parent
    convention
  end
  
  def redirect_if_root_page
    if @page == convention.root_page
      redirect_to root_url
    end
  end
end
