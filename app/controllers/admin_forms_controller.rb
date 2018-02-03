class AdminFormsController < ApplicationController
  load_and_authorize_resource class: Form, through: :convention, through_association: :forms

  def index
  end

  def show
  end
end
