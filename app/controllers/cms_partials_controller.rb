class CmsPartialsController < BaseControllers::VirtualHost
  self.responder = NoShowActionResponder

  load_and_authorize_resource through: :convention
  respond_to :html

  def index
  end

  def new
  end

  def edit
  end

  def create
    @cms_partial.save
    respond_with @cms_partial
  end

  def update
    @cms_partial.update(cms_partial_params)
    respond_with @cms_partial
  end

  def destroy
    @cms_partial.destroy
    respond_with @cms_partial
  end

  private

  def cms_partial_params
    params.require(:cms_partial).permit(:identifier, :content)
  end
end
