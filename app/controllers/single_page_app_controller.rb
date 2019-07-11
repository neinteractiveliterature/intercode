class SinglePageAppController < ApplicationController
  def root
    render html: '', layout: 'application'
  end
end
