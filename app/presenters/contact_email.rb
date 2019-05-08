class ContactEmail
  def self.from_user_con_profiles(user_con_profiles)
    user_con_profiles.map { |user_con_profile| from_user_con_profile(user_con_profile) }
  end

  def self.from_user_con_profile(user_con_profile)
    new(
      user_con_profile.email,
      user_con_profile.name_inverted,
      address_name: user_con_profile.name_without_nickname
    )
  end

  attr_reader :email, :name, :address_name, :metadata

  def initialize(email, name, address_name: nil, **metadata)
    @email = email
    @name = name
    @address_name = address_name || name
    @metadata = metadata || {}
  end

  def formatted_address
    address = Mail::Address.new(email)
    address.display_name = address_name
    address.format
  rescue
    email
  end
end
