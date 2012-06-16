class ConsController < ApplicationController
  load_and_authorize_resource
  
  def index
    @upcoming_cons = []
    @past_cons = []
    
    @cons.each do |con|
      if con.ended?
        @past_cons << con
      else
        @upcoming_cons << con
      end
    end
  end
  
  def show
  end
end
