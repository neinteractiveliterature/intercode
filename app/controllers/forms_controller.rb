class FormsController < ApplicationController
  load_and_authorize_resource through: :convention

  def show
    respond_to do |format|
      format.json { render json: FormApiPresenter.new(@form, cadmus_renderer).as_json }
    end
  end
end
