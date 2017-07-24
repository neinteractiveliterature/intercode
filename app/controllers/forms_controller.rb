class FormsController < BaseControllers::VirtualHost
  include Cadmus::Renderable

  load_and_authorize_resource through: :convention
  respond_to :html, :json

  def index
    respond_with @forms
  end

  def show
    respond_with(@form) do |format|
      format.json { render json: FormApiPresenter.new(@form, cadmus_renderer).as_json }
    end
  end

  def create
    @form.save
    respond_with @form
  end

  private

  def form_params
    params.require(:form).permit(:title)
  end
end
