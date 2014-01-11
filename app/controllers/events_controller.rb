class EventsController < BaseControllers::VirtualHost

  # TODO: Verify that the user is logged in.  For now we're
  # skipping authorization.
  skip_after_filter :ensure_authorization_performed

  # Display form to propose a new LARP
  def new
    @larp = Events::Larp.new
  end

  def create
    @larp = Events::Larp.new(params[:event])
    if @user.save
    else
      render 'new'
    end
  end
end
