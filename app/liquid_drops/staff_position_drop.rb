class StaffPositionDrop < Liquid::Drop
  include ActionView::Helpers::UrlHelper

  attr_reader :staff_position
  delegate :id, :name, :email, to: :staff_position

  def initialize(staff_position)
    @staff_position = staff_position
  end

  def user_con_profiles
    staff_position.user_con_profiles.to_a
  end

  def email_link
    return unless email.present?
    mail_to email
  end

  def name_with_email_link
    if email.present?
      mail_to email, name
    else
      name
    end
  end
end
