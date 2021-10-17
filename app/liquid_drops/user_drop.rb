# frozen_string_literal: true
# A user account on the site.  Most of the relevant data for the user is not here, but in
# UserConProfileDrop, which is the user's profile for a particular convention.
class UserDrop < Liquid::Drop
  # @api
  attr_reader :user

  # @!method email
  #   @return [String] The user's email address
  # @!method first_name
  #   @return [String] The user's first name.  Note that this may be different than the first name
  #                    this person has used for particular convention profiles.
  # @!method id
  #   @return [Integer] The numeric database ID for this user account
  # @!method last_name
  #   @return [String] The user's last name.  Note that this may be different than the last name
  #                    this person has used for particular convention profiles.
  # @!method name
  #   @return [String] The user's full name.  Note that this may be different than the name
  #                    this person has used for particular convention profiles.
  delegate :email, :first_name, :id, :last_name, :name, to: :user

  # @api
  def initialize(user)
    @user = user
  end
end
