# frozen_string_literal: true
class Types::UserConProfileInputType < Types::BaseInputObject
  argument :first_name, String, required: false, camelize: false
  argument :last_name, String, required: false, camelize: false
  argument :nickname, String, required: false
  argument :bio, String, required: false
  argument :show_nickname_in_bio, Boolean, required: false, camelize: false
  argument :form_response_attrs_json, String, required: false, camelize: false
  argument :birth_date, Types::DateType, required: false, camelize: false
  argument :address, String, required: false
  argument :city, String, required: false
  argument :state, String, required: false
  argument :zipcode, String, required: false
  argument :country, String, required: false
  argument :day_phone, String, required: false, camelize: false
  argument :evening_phone, String, required: false, camelize: false
  argument :best_call_time, String, required: false, camelize: false
  argument :preferred_contact, String, required: false, camelize: false
  argument :gravatar_enabled, Boolean, required: false, camelize: false
  argument :ranked_choice_allow_waitlist, Boolean, required: false, camelize: false
end
