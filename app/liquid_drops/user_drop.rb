class UserDrop < Liquid::Drop
  attr_reader :user
  delegate :email, :first_name, :id, :last_name, :name, to: :user

  def initialize(user)
    @user = user
  end
end
