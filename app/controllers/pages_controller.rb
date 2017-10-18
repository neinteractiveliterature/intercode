class PagesController < ApplicationController

  # Cadmus::PagesController defines index, show, new, create, edit, update, and destroy actions for
  # CMS pages that include the cadmus_page directive.  So we don't need to implement those here;
  # instead we can just rely on the existing implementation, and override the protected methods in
  # Cadmus::PagesController as needed.
  #
  # We do have one special action Cadmus doesn't define, though: root.  This is for getting the
  # root page of a Convention (http://subdomain.interactiveliterature.org/).  Every Convention
  # has at least one page it defines as its root using the root_page association, so we'll need
  # to find it and get Cadmus to display it just as if it was showing some other page.

  include Cadmus::PagesController

  layout :determine_layout

  # In the case of the root action, we'll need to load the root page from the database before
  # Authority has a chance to run its authorization checks.  So we use a before_action filter that
  # comes before authorize_actions_for in the chain.
  before_action :find_root_page, :only => [:root]

  # Now it's safe to run authorize_actions_for.  We'll call out to the page_for_authorization
  # method to return the page we're using, and use read permissions for the root action.
  authorize_resource :page

  # If we're in the show action and being asked to show the root page, redirect to the domain
  # root URL.  Because pages should only have one canonical URL if possible, natch.
  before_action :redirect_if_root_page, :only => [:show]

  # We don't want to let the general public view the list of pages, so we'll use a special extra
  # authorization filter here.
  before_action :authorize_index, :only => [:index]

  # The actual root action implementation is exceedingly simple: since we've already loaded
  # @page in a before filter, we can just run the show action.  Sweet!
  def root
    show
  end

  protected

  # Set the @page variable if we're looking for the root page.  We expect a root page to exist on the
  # Convention.  If not, it's an error (which will become a 404).
  def find_root_page
    @page = page_parent.root_page
    raise ActiveRecord::RecordNotFound unless @page
  end

  # Cadmus requires this too.  This method is supposed to return the parent object to look for pages in,
  # for this particular HTTP request.  We can simply use the convention method defined by this controller's
  # parent class (ApplicationController) to look up the appropriate Convention object using the
  # domain name for this HTTP request.
  def page_parent
    convention
  end

  # See above comment on the before_action for this.
  def redirect_if_root_page
    if @page == convention.root_page
      redirect_to root_url
    end
  end

  # See above comment on the before_action for this.
  def authorize_index
    authorize! :create, Page
  end

  def determine_layout
    case params[:action]
    when 'root', 'show' then 'application'
    else 'cms_admin'
    end
  end
end
