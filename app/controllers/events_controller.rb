class EventsController < BaseControllers::VirtualHost

  # TODO: Verify that the user is logged in.  For now we're
  # skipping authorization.
  skip_after_filter :ensure_authorization_performed

  # Display form to propose a new LARP
  def new
    @larp = Events::Larp.new
  end

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

  # Having to "permit" access to every field to avoid an
  # ActiveModel::ForbiddenAttributesError is an absolute pain in the ass.
  def larp_params
    params.require(:event).permit(:title, :length_seconds,
                                  :description, :short_blurb)
  end
end
