module Concerns::FormResponseController
  def send_form_response(form, form_response)
    respond_with(form_response) do |format|
      format.json do
        presenter = FormResponsePresenter.new(form, form_response)
        render json: presenter.as_json
      end
    end
  end

  def update_form_response(form_response)
    form_response.assign_form_response_attributes(params[:form_response])
    form_response.save

    respond_with form_response
  end
end
