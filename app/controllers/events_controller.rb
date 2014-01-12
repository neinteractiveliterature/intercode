class EventsController < BaseControllers::VirtualHost

  # TODO: Verify that the user is logged in.  For now we're
  # skipping authorization.
  skip_after_filter :ensure_authorization_performed

  # Display form to propose a new LARP.  Create a new LARP event to initialize
  # the form
  def new
    @larp = Events::Larp.new
  end

  # Write information from the new LARP to the database
  def create
    @larp = Events::Larp.new(larp_params)
    @larp.convention_id = convention.id
    @larp.user_id = current_user.id
    @larp.updated_by_id = current_user.id
    if @larp.save
    else
      render 'new'
    end
  end

  # Edit information about a LARP. The id is specified as part of the URL
  def edit
    @larp = Event.find(params[:id])
  end

  # Update information about a LARP to the database
  def update
    @larp = Events::Larp.find(params[:id])

    @larp.updated_by_id = current_user.id
    @larp.updated_at = nil

    if @larp.update_attributes(larp_params)
    else
      render 'edit'
    end
  end

  # Permit access to fields that can be updated
  def larp_params
    params.require(:event).permit(:author,
                                  :description,
                                  :email,
                                  :length_seconds,
                                  :organization,
                                  :short_blurb,
                                  :title,
                                  :url)
  end

  def configure_permitted_parameters
    ActionController::Parameters.permit_all_parameters = true
  end
end
