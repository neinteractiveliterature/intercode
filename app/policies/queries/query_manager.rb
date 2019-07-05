class Queries::QueryManager
  def self.query_methods
    instance_methods(false)
  end

  attr_reader :user

  def initialize(user:)
    @user = user
  end
end
