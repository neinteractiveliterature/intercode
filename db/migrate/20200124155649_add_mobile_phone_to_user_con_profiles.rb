class AddMobilePhoneToUserConProfiles < ActiveRecord::Migration[6.0]
  def change
    add_column :user_con_profiles, :mobile_phone, :string

    reversible do |dir|
      dir.up do
        UserConProfile.reset_column_information

        total = UserConProfile.count
        current = 0
        UserConProfile.find_each do |user_con_profile|
          valid_numbers = %i[evening_phone day_phone].map do |field|
            number = user_con_profile.public_send(field)
            next unless number.present?
            country_code = country_code_from_country_field(user_con_profile.country)
            normalize_phone_number(number, country_code)
          end.compact

          if valid_numbers.any?
            user_con_profile.update!(mobile_phone: valid_numbers.first)
          end

          current += 1
          say "Processed #{current} of #{total} user profiles" if current % 1000 == 0
        end
      end
    end
  end

  def normalize_phone_number(number, country_code)
    digits = number.gsub(/[^0-9\-+\.\(\) ]/, '').gsub(/\(\)/, '').strip
    if country_code
      phone = Phonelib.parse(digits, country_code)
      if phone.valid?
        phone.international
      else
        # try it as a default-country number
        normalize_phone_number(number, nil)
      end
    else
      return nil unless Phonelib.valid?(digits)
      digits
    end
  end

  def country_code_from_country_field(country_field)
    return unless country_field

    # based on combing our actual data to see what people write
    downcase_country = country_field.strip.downcase
    return 'GB' if ['uk', 'united kingdom'].include?(downcase_country)
    return 'CA' if ['canada'].include?(downcase_country)
    return 'JP' if ['japan'].include?(downcase_country)
  end
end
