class PagesController < BaseControllers::VirtualHost
  include Cadmus::PagesController
  before_filter :find_root_page, :only => [:root]
  authorize_actions_for :page, :actions => { :root => :read }
  before_filter :redirect_if_root_page, :only => [:show]
  
  # Show the root page.  Used at the root of a con domain.
  def root
    show
  end

  protected
  # Authority needs this to find the page for authorization purposes
  def page
    @page
  end
  
  def find_root_page
    @page = page_parent.root_page
    raise ActiveRecord::RecordNotFound unless @page
  end
  
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
