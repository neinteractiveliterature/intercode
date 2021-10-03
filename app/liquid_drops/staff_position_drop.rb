# frozen_string_literal: true
# A staff position at a convention
class StaffPositionDrop < Liquid::Drop
  include ActionView::Helpers::UrlHelper

  # @api
  attr_reader :staff_position

  # @!method id
  #   @return [Integer] The numeric database ID of this staff position
  # @!method name
  #   @return [String] The name of this staff position
  # @!method email
  #   @return [String] The contact email for this staff position
  delegate :id, :name, :email, to: :staff_position

  # @api
  def initialize(staff_position)
    @staff_position = staff_position
  end

  # @return [Array<UserConProfileDrop>] The profiles of the people who hold this position
  def user_con_profiles
    staff_position.user_con_profiles.to_a
  end

  # @return [String] A mailto: URL for this staff position
  def email_link
    return if email.blank?
    mail_to email
  end

  # @return [String] An HTML link for emailing this staff position (the link text will be the name
  #                  of the position)
  def name_with_email_link
    if email.present?
      mail_to email, name
    else
      name
    end
  end
end
