class StaffPositionDrop < Liquid::Drop
  attr_reader :staff_position
  delegate :id, :name, :email, to: :staff_position

  def initialize(staff_position)
    @staff_position = staff_position
  end

  def user_con_profiles
    staff_position.user_con_profiles.to_a
  end
end
