class PagesController < ApplicationController
  include Cadmus::PagesController
  authorize_resource :page, :except => [:root]
  
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
    con && Con
  end
  
  def page_parent_name
    con && "con"
  end
  
  def page_parent
    con
  end
end
