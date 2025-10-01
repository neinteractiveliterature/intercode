# frozen_string_literal: true
class Types::UserConProfileInputType < Types::BaseInputObject
  description "An input for creating or modifying UserConProfiles."

  argument :address, String, required: false do
    description "The street address portion of this profile's mailing address."
  end
  argument :best_call_time, String, required: false, camelize: false do
    description "The time this user profile prefers to be called on the phone."
  end
  argument :bio, String, required: false, description: "The bio to display for this user profile, in Markdown format."
  argument :birth_date, Types::DateType, required: false, camelize: false do
    description "This user profile's date of birth."
  end
  argument :city, String, required: false, description: "The city portion of this profile's mailing address."
  argument :country, String, required: false, description: "The country portion of this profile's mailing address."
  argument :day_phone, String, required: false, camelize: false do
    description "This user profile's daytime phone number."
  end
  argument :evening_phone, String, required: false, camelize: false do
    description "This user profile's evening phone number."
  end
  argument :first_name, String, required: false, camelize: false, description: "This user profile's first name."
  argument :form_response_attrs_json, String, required: false, camelize: false do
    description <<~MARKDOWN
      An object in JSON format, where the keys are form fields on the UserConProfile form for this convention and the
      values are the appropriate values to be set on those fields for this user profile.
    MARKDOWN
  end
  argument :gravatar_enabled, Boolean, required: false, camelize: false do
    description "Has this user enabled Gravatars for this profile?"
  end
  argument :last_name, String, required: false, camelize: false, description: "This user profile's last name."
  argument :nickname, String, required: false, description: "This user profile's nickname."
  argument :preferred_contact, String, required: false, camelize: false do
    description "The method by which this user profile prefers the convention contact them."
  end
  argument :ranked_choice_fallback_action, Types::RankedChoiceFallbackAction, required: false, camelize: false do
    description "If this user can't be signed up for any of their ranked choices, what should the site do?"
  end
  argument :show_nickname_in_bio, Boolean, required: false, camelize: false do
    description "Should this profile's bio use the nickname as part of their name?"
  end
  argument :state, String, required: false, description: "The state portion of this profile's mailing address."
  argument :zipcode, String, required: false, description: "The ZIP portion of this profile's mailing address."
end
