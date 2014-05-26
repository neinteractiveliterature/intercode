require 'spec_helper'

describe UserConProfile do

  before(:each) do
    @attr = {
      :first_name => 'Example',
      :last_name => 'Name',
      :email => 'user@example.com',
      :password => 'changeme',
      :password_confirmation => 'changeme'
    }
  end

  it 'should create a new instance given a valid attribute' do
    User.create!(@attr)
  end
end