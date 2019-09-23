module Concerns::AgeRestrictions
  def age_restrictions
    {
      age_restrictions_description: read_form_response_attribute(:age_restrictions_description),
      minimum_age: read_form_response_attribute(:minimum_age)
    }
  end

  def age_restrictions=(attributes)
    symbolized_attributes = attributes.symbolize_keys
    if symbolized_attributes[:age_restrictions_description]
      assign_form_response_attributes(
        age_restrictions_description: symbolized_attributes[:age_restrictions_description],
        minimum_age: symbolized_attributes[:minimum_age]
      )
    else
      assign_form_response_attributes(symbolized_attributes)
    end
    age_restrictions
  end
end
