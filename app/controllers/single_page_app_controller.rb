class SinglePageAppController < ApplicationController
  skip_authorization_check

  def root
  end
end
