class ProductsController < ApplicationController
  load_and_authorize_resource through: :convention

  def show
    @page_title = @product.name
  end
end
