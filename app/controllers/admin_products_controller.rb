class AdminProductsController < ApplicationController
  def index
    authorize! :create, Product.new(convention: convention)
  end
end
