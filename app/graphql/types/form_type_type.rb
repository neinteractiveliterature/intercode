# frozen_string_literal: true
class Types::FormTypeType < Types::BaseEnum
  Form::FORM_TYPE_CONFIG.each { |key, config| value key, config["description"].capitalize }
end
