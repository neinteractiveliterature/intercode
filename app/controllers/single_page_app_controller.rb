class SinglePageAppController < ApplicationController
  skip_authorization_check

  def root
    render html: '', layout: 'application'
  end
end
